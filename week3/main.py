"""
TRINET AI Red Team Lab — FastAPI Backend
Run with: uvicorn main:app --reload
"""

import asyncio
import base64
import io
import json
import time
from typing import Optional

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

app = FastAPI(title="TRINET AI Red Team Lab")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global state ──────────────────────────────────────────────────────────────
device = "cuda" if torch.cuda.is_available() else "cpu"
model: Optional[nn.Module] = None
surrogate: Optional[nn.Module] = None
criterion = nn.CrossEntropyLoss()

# Keep one test sample available after training
current_image: Optional[torch.Tensor] = None
current_label: Optional[torch.Tensor] = None

transform = transforms.Compose([transforms.ToTensor()])


# ── Model definition ──────────────────────────────────────────────────────────
class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 32, 3), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3), nn.ReLU(), nn.MaxPool2d(2),
        )
        self.fc = nn.Sequential(
            nn.Linear(64 * 5 * 5, 128), nn.ReLU(),
            nn.Linear(128, 10),
        )

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)


# ── Helpers ───────────────────────────────────────────────────────────────────
def tensor_to_b64(tensor: torch.Tensor, cmap="gray") -> str:
    arr = tensor.detach().cpu().squeeze().numpy()
    fig, ax = plt.subplots(figsize=(3, 3))
    ax.imshow(arr, cmap=cmap)
    ax.axis("off")
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", pad_inches=0)
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode()


def confidence_chart_b64(output: torch.Tensor) -> str:
    probs = F.softmax(output, dim=1).detach().cpu().numpy()[0]
    fig, ax = plt.subplots(figsize=(5, 2.5))
    colors = ["#00ff41" if p == probs.max() else "#003b00" for p in probs]
    ax.bar(range(10), probs, color=colors, edgecolor="#00ff41", linewidth=0.5)
    ax.set_facecolor("#0a0a0a")
    fig.patch.set_facecolor("#0a0a0a")
    ax.tick_params(colors="#00ff41")
    ax.spines[:].set_color("#003b00")
    ax.set_xlabel("Digit", color="#00ff41", fontsize=9)
    ax.set_ylabel("Confidence", color="#00ff41", fontsize=9)
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", facecolor="#0a0a0a")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode()


async def send(ws: WebSocket, event: str, data: dict):
    await ws.send_text(json.dumps({"event": event, **data}))


# ── Attack functions ──────────────────────────────────────────────────────────
def fgsm_attack(mdl, image, label, epsilon):
    img = image.clone().requires_grad_(True)
    output = mdl(img)
    loss = criterion(output, label.to(device))
    mdl.zero_grad()
    loss.backward()
    sign_grad = img.grad.data.sign()
    # No clamp — image may be normalized outside [0,1]
    adv = img + epsilon * sign_grad
    return adv.detach()


def pgd_attack(mdl, image, label, epsilon=0.2, alpha=0.01, steps=10):
    original = image.clone()
    adv = image.clone()
    for _ in range(steps):
        adv = adv.detach().requires_grad_(True)
        output = mdl(adv)
        loss = criterion(output, label.to(device))
        mdl.zero_grad()
        loss.backward()
        adv = adv + alpha * adv.grad.sign()
        eta = torch.clamp(adv - original, -epsilon, epsilon)
        adv = torch.clamp(original + eta, 0, 1)
    return adv.detach()


# ── WebSocket: Training ───────────────────────────────────────────────────────
@app.websocket("/ws/train")
async def ws_train(ws: WebSocket):
    global model, current_image, current_label
    await ws.accept()

    try:
        await send(ws, "log", {"msg": "Initializing TRINET AI Red Team Lab..."})
        await send(ws, "log", {"msg": "Target identified: NeuralVision Digit Classifier"})
        await send(ws, "log", {"msg": f"Running on: {device.upper()}"})
        await asyncio.sleep(0.4)

        await send(ws, "log", {"msg": "Downloading MNIST dataset..."})
        train_dataset = torchvision.datasets.MNIST(root="./data", train=True, download=True, transform=transform)
        test_dataset = torchvision.datasets.MNIST(root="./data", train=False, download=True, transform=transform)
        train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=64, shuffle=True)
        test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=1, shuffle=True)
        await send(ws, "log", {"msg": f"Dataset acquired — {len(train_dataset):,} training samples"})

        model = CNN().to(device)
        optimizer = optim.Adam(model.parameters(), lr=0.001)
        epochs = 3

        await send(ws, "log", {"msg": "Training NeuralVision victim model..."})

        total_batches = len(train_loader) * epochs
        batch_count = 0

        for epoch in range(epochs):
            epoch_loss = 0.0
            for i, (images, labels) in enumerate(train_loader):
                images, labels = images.to(device), labels.to(device)
                optimizer.zero_grad()
                outputs = model(images)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                epoch_loss += loss.item()
                batch_count += 1

                if i % 100 == 0:
                    pct = int(batch_count / total_batches * 100)
                    await send(ws, "progress", {"pct": pct, "epoch": epoch + 1, "loss": round(loss.item(), 4)})
                    await asyncio.sleep(0)

            avg_loss = epoch_loss / len(train_loader)
            await send(ws, "log", {"msg": f"Epoch {epoch+1}/3 complete — avg loss: {avg_loss:.4f}"})

        await send(ws, "progress", {"pct": 100, "epoch": 3, "loss": 0})
        await send(ws, "log", {"msg": "Target AI deployed. Beginning recon..."})

        # Recon — find least-confident (most vulnerable) sample
        await send(ws, "log", {"msg": "Scanning for vulnerable target sample..."})
        dataiter = iter(test_loader)
        best_image, best_label, best_output = None, None, None
        lowest_conf = 1.0
        for _ in range(200):
            try:
                image, label = next(dataiter)
            except StopIteration:
                break
            image = image.to(device)
            with torch.no_grad():
                out = model(image)
            conf = F.softmax(out, dim=1).max().item()
            if conf < lowest_conf:
                lowest_conf = conf
                best_image, best_label, best_output = image, label, out

        current_image = best_image
        current_label = best_label
        output = best_output
        label = best_label
        pred = output.argmax().item()
        await send(ws, "log", {"msg": f"Vulnerable sample acquired — confidence: {lowest_conf:.1%}"})

        img_b64 = tensor_to_b64(current_image)
        conf_b64 = confidence_chart_b64(output)

        await send(ws, "recon", {
            "true_label": label.item(),
            "pred": pred,
            "image_b64": img_b64,
            "conf_b64": conf_b64,
        })

        await send(ws, "done", {"msg": "Training complete. Ready for attacks."})

    except WebSocketDisconnect:
        pass


# ── WebSocket: FGSM Attack ────────────────────────────────────────────────────
@app.websocket("/ws/fgsm")
async def ws_fgsm(ws: WebSocket):
    global model, current_image, current_label
    await ws.accept()

    try:
        data = json.loads(await ws.receive_text())
        epsilon = float(data.get("epsilon", 0.2))

        if model is None or current_image is None:
            await send(ws, "error", {"msg": "Model not trained yet. Run training first."})
            return

        await send(ws, "log", {"msg": "Running gradient analysis on target..."})
        await asyncio.sleep(0.3)
        await send(ws, "log", {"msg": f"Crafting adversarial perturbation (ε={epsilon})..."})
        await asyncio.sleep(0.3)
        await send(ws, "log", {"msg": "Launching FGSM attack..."})

        adv = fgsm_attack(model, current_image.clone(), current_label, epsilon)

        out_orig = model(current_image)
        out_adv = model(adv)

        orig_pred = out_orig.argmax().item()
        adv_pred = out_adv.argmax().item()
        noise = adv - current_image

        await send(ws, "result", {
            "orig_pred": orig_pred,
            "adv_pred": adv_pred,
            "true_label": current_label.item(),
            "success": adv_pred != current_label.item(),
            "orig_img_b64": tensor_to_b64(current_image),
            "noise_b64": tensor_to_b64(noise, cmap="hot"),
            "adv_img_b64": tensor_to_b64(adv),
            "conf_before_b64": confidence_chart_b64(out_orig),
            "conf_after_b64": confidence_chart_b64(out_adv),
        })

    except WebSocketDisconnect:
        pass


# ── WebSocket: PGD Attack ─────────────────────────────────────────────────────
@app.websocket("/ws/pgd")
async def ws_pgd(ws: WebSocket):
    global model, current_image, current_label
    await ws.accept()

    try:
        data = json.loads(await ws.receive_text())
        epsilon = float(data.get("epsilon", 0.2))
        alpha = float(data.get("alpha", 0.01))
        steps = int(data.get("steps", 10))

        if model is None or current_image is None:
            await send(ws, "error", {"msg": "Model not trained yet."})
            return

        await send(ws, "log", {"msg": "Deploying advanced PGD attack..."})
        await asyncio.sleep(0.3)
        await send(ws, "log", {"msg": f"Config: ε={epsilon}, α={alpha}, steps={steps}"})

        for step in range(steps):
            await send(ws, "step", {"step": step + 1, "total": steps})
            await asyncio.sleep(0.05)

        adv_pgd = pgd_attack(model, current_image.clone(), current_label, epsilon, alpha, steps)
        out_pgd = model(adv_pgd)
        pgd_pred = out_pgd.argmax().item()

        await send(ws, "result", {
            "pgd_pred": pgd_pred,
            "true_label": current_label.item(),
            "success": pgd_pred != current_label.item(),
            "adv_img_b64": tensor_to_b64(adv_pgd),
            "conf_b64": confidence_chart_b64(out_pgd),
        })

    except WebSocketDisconnect:
        pass


# ── REST: Upload custom image ─────────────────────────────────────────────────
@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    global current_image, current_label

    if model is None:
        return {"error": "Train the model first."}

    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("L").resize((28, 28), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0

    # MNIST format: white digit on BLACK background.
    # Most real images are black-on-white, so invert them.
    # Heuristic: if the image is majority bright, it needs inverting.
    if arr.mean() > 0.5:
        arr = 1.0 - arr

    # Normalize to roughly match MNIST pixel distribution
    # (mean ~0.1307, std ~0.3081 across the dataset)
    arr = (arr - arr.min()) / (arr.max() - arr.min() + 1e-8)  # stretch contrast first
    arr = (arr - 0.1307) / 0.3081

    tensor = torch.tensor(arr).unsqueeze(0).unsqueeze(0).to(device)

    output = model(tensor)
    pred = output.argmax().item()

    current_image = tensor
    current_label = torch.tensor([pred])

    return {
        "pred": pred,
        "image_b64": tensor_to_b64(tensor),
        "conf_b64": confidence_chart_b64(output),
    }


# ── Rate limiter state ───────────────────────────────────────────────────────
RATE_LIMIT_QPS   = 10
RATE_WINDOW      = 1.0
COOLDOWN_SECONDS = 8
rate_buckets: dict = {}


def check_rate(ws_id: str):
    now = time.time()
    bucket = rate_buckets.setdefault(ws_id, [])
    rate_buckets[ws_id] = [t for t in bucket if now - t < RATE_WINDOW]
    qps = len(rate_buckets[ws_id])
    if qps >= RATE_LIMIT_QPS:
        return False, float(qps + 1)
    rate_buckets[ws_id].append(now)
    return True, float(qps + 1)


# ── WebSocket: Model Extraction ───────────────────────────────────────────────
@app.websocket("/ws/extract")
async def ws_extract(ws: WebSocket):
    global model, surrogate
    await ws.accept()
    ws_id = str(id(ws))

    try:
        data = json.loads(await ws.receive_text())
        delay_ms = max(0, int(data.get("delay_ms", 0)))
        delay_s  = delay_ms / 1000.0

        if model is None:
            await send(ws, "error", {"msg": "Train the model first."})
            return

        train_dataset = torchvision.datasets.MNIST(root="./data", train=True, download=False, transform=transform)
        train_loader  = torch.utils.data.DataLoader(train_dataset, batch_size=1, shuffle=True)
        test_dataset  = torchvision.datasets.MNIST(root="./data", train=False, download=False, transform=transform)
        test_loader   = torch.utils.data.DataLoader(test_dataset,  batch_size=1, shuffle=True)

        TARGET_QUERIES = 500
        query_images, query_labels = [], []
        rate_buckets[ws_id] = []
        blocked_count = 0

        await send(ws, "log", {"msg": "Initialising black-box query engine..."})
        await send(ws, "log", {"msg": f"Delay set to {delay_ms}ms between requests"})
        await send(ws, "log", {"msg": f"Target: {TARGET_QUERIES} queries — rate limit: {RATE_LIMIT_QPS} q/s"})
        await asyncio.sleep(0.3)

        for i, (img, _) in enumerate(train_loader):
            if len(query_images) >= TARGET_QUERIES:
                break

            if delay_s > 0:
                await asyncio.sleep(delay_s)

            allowed, qps = check_rate(ws_id)

            if not allowed:
                blocked_count += 1
                await send(ws, "blocked", {
                    "qps": round(qps, 1),
                    "blocked": blocked_count,
                    "msg": f"429 RATE LIMITED — {qps:.0f} q/s detected. Cooling down {COOLDOWN_SECONDS}s...",
                })
                await asyncio.sleep(COOLDOWN_SECONDS)
                rate_buckets[ws_id] = []
                if blocked_count >= 3:
                    await send(ws, "error", {"msg": "EXTRACTION FAILED — blocked 3 times. Increase delay and retry."})
                    return
                await send(ws, "log", {"msg": "Cooldown complete. Resuming queries..."})
                continue

            img = img.to(device)
            with torch.no_grad():
                pred = model(img).argmax(dim=1)
            query_images.append(img.cpu())
            query_labels.append(pred.cpu())

            pct = int(len(query_images) / TARGET_QUERIES * 100)
            await send(ws, "progress", {
                "collected": len(query_images),
                "total": TARGET_QUERIES,
                "pct": pct,
                "qps": round(qps, 1),
            })
            # Always yield so WebSocket messages flush to the browser
            await asyncio.sleep(0.01)

        if len(query_images) < 100:
            await send(ws, "error", {"msg": f"Only {len(query_images)} queries — not enough. Increase delay and retry."})
            return

        query_images = torch.cat(query_images)
        query_labels = torch.cat(query_labels)
        await send(ws, "log", {"msg": f"Query phase complete — {len(query_images):,} responses stolen"})
        await send(ws, "log", {"msg": f"Rate limit triggered {blocked_count}x during extraction"})

        surrogate = CNN().to(device)
        opt = optim.Adam(surrogate.parameters(), lr=0.001)
        dataset = torch.utils.data.TensorDataset(query_images, query_labels)
        loader  = torch.utils.data.DataLoader(dataset, batch_size=64, shuffle=True)

        await send(ws, "log", {"msg": "Training surrogate model on stolen labels..."})
        for epoch in range(3):
            for images, labels in loader:
                images, labels = images.to(device), labels.to(device)
                opt.zero_grad()
                loss = criterion(surrogate(images), labels)
                loss.backward()
                opt.step()
            await send(ws, "log", {"msg": f"Surrogate epoch {epoch+1}/3 complete"})
            await asyncio.sleep(0)

        correct_v = correct_s = total = 0
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            if model(images).argmax() == labels:
                correct_v += 1
            if surrogate(images).argmax() == labels:
                correct_s += 1
            total += 1
            if total > 1000:
                break

        await send(ws, "result", {
            "victim_acc":    round(correct_v / total, 4),
            "surrogate_acc": round(correct_s / total, 4),
            "queries":       len(query_images),
            "blocked":       blocked_count,
        })

    except WebSocketDisconnect:
        pass
    finally:
        rate_buckets.pop(ws_id, None)


# ── Serve frontend ────────────────────────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
async def root():
    with open("index.html", encoding="utf-8") as f:
        return f.read()