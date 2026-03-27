# START HERE - Quick Setup Guide

## To Run the Application

### Single Command (Recommended)
```bash
npm run dev
```

This starts both the backend and frontend automatically.

**Access the app at:** http://localhost:5173

---

## Troubleshooting

### If you see "Error submitting resume" popup:

**Problem:** The backend server isn't running or there's a connection issue.

**Solution 1 - Restart everything:**
```bash
# Stop any running processes (Ctrl+C)
# Then run:
npm run dev
```

**Solution 2 - Run servers separately (for debugging):**

Terminal 1 (Backend):
```bash
npm run server
```
Wait for: "AI HR Screening Lab Backend running on http://localhost:3001"

Terminal 2 (Frontend):
```bash
npm run client
```

**Solution 3 - Check ports are free:**
```bash
# Kill any processes on ports 3001 and 5173
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Then restart
npm run dev
```

**Solution 4 - Fresh start:**
```bash
# Remove database and restart
rm -f database/resumes.db
npm run dev
```

---

## First Time Setup

If you haven't installed dependencies yet:

```bash
npm install
npm run dev
```

---

## Quick Test (30 seconds)

1. Open http://localhost:5173
2. Click "Prompt Injection" button (red)
3. Click "Submit Application"
4. You should see:
   - Score = 100
   - Red banner: "PROMPT INJECTION SUCCESSFUL!"

If this works, everything is working correctly!

---

## What Should You See?

### When Backend Starts:
```
🚀 AI HR Screening Lab Backend running on http://localhost:3001
📊 Mode: VULNERABLE (Educational)
```

### When Frontend Starts:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

### In Browser:
- Navigation bar with "Apply" and "HR Dashboard" links
- "VULNERABLE MODE" button (red, pulsing)
- Application form with example buttons
- System stats in navbar

---

## Still Having Issues?

### Check if ports are already in use:
```bash
lsof -i:3001  # Should show node process
lsof -i:5173  # Should show node process
```

### Check backend is responding:
```bash
curl http://localhost:3001/stats
```
Should return JSON with stats.

### Check for errors:
Look in the terminal where you ran `npm run dev` for error messages.

---

## Need Help?

1. Make sure you ran `npm install` first
2. Make sure ports 3001 and 5173 are not in use
3. Check terminal output for error messages
4. Try the troubleshooting steps above
5. Read QUICKSTART.md for more details

---

## Success Checklist

- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Backend shows "running on http://localhost:3001"
- [ ] Frontend shows "Local: http://localhost:5173"
- [ ] Browser opens to http://localhost:5173
- [ ] Can see application form
- [ ] Can click example buttons
- [ ] Can submit and see results

✅ If all checked, you're ready to go!

---

**Quick Start:** Just run `npm run dev` and open http://localhost:5173 🚀
