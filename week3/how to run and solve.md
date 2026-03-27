# TRINET AI Red Team Lab

This guide explains how to get the lab running on your local machine and the steps to complete all of the attacks successfully.

## 🛠️ How to Run the Lab

Prerequisites: Ensure you have Python installed on your system.

**1. Open a terminal** and navigate to this folder.

**2. Create and activate a virtual environment (Optional but Recommended):**
- **Windows:**
  ```powershell
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  ```
- **Mac/Linux:**
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

**3. Install the dependencies:**
```bash
pip install -r requirements.txt
```

**4. Start the Application Server:**
```bash
uvicorn main:app --reload
```
Instead of `uvicorn main:app --reload`, you can also use `python -m uvicorn main:app --reload`.

**5. Access the Lab:**
Open your web browser and navigate to exactly: [http://localhost:8000](http://localhost:8000)

---

## 🎮 How to Solve the Lab

The goal of this lab is to conduct a series of adversarial AI attacks on a digit classification model.

### Phase 1: Target Deployment (Training)
1. In the browser interface, go to the **Target Env** section.
2. Click the **INITIALIZE VIRUS / TRAIN MODEL** button.
3. Wait for the MNIST dataset to download and the vulnerable AI model to finish training. Once it finishes, it will automatically find a "vulnerable sample."

### Phase 2: FGSM Attack
1. Navigate to the **FGSM ATTACK** panel. Fast Gradient Sign Method (FGSM) uses gradients to add calculated noise.
2. Slowly increase the **ε (Epsilon)** slider.
3. Click **EXECUTE FGSM ATTACK**.
4. If it fails, increase ε further and try again until the verdict reads **ATTACK SUCCESSFUL — MODEL FOOLED**.

### Phase 3: PGD Attack
1. Navigate to the **PGD ATTACK** panel. Projected Gradient Descent (PGD) is a stronger, iterative attack.
2. Adjust the **ε (Epsilon)**, **α (Alpha)**, and **Steps** sliders. You may need to increase ε or the number of steps if the model resists.
3. Click **EXECUTE PGD ATTACK**.
4. Repeat until the model is hijacked and the verdict reads **PGD ATTACK SUCCESSFUL — MODEL HIJACKED**.

### Phase 4: Model Extraction
1. Navigate to the **DATA EXFILTRATION (Model Extraction)** panel. The goal here is to steal a clone of the model by repeatedly querying it. 
2. The server has a rate limiter set to **10 queries per second (QPS)**. If you query too fast, you will be blocked. If blocked 3 times, extraction will fail.
3. **The Solution:** Increase the **DELAY (ms)** slider to roughly `150ms` or `200ms` so that the rate sits comfortably below the 10 QPS block-limit (putting you in the "SAFE" or "ELEVATED" zone).
4. Click **INITIATE EXTRACTION** and wait patiently for the system to steal enough queries.
5. Once completed successfully, the stolen clone will achieve a high fidelity ratio compared to the victim model.

### 🏆 Lab Complete
Once you successfully complete the Training, FGSM, PGD, and Model Extraction phases, you will be greeted by the **LAB COMPLETE** modal. Mission accomplished!
