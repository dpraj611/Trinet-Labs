# Quick Start Guide

Get the AI HR Screening Lab running in 2 minutes.

## Installation

```bash
# Install dependencies
npm install

# Start the application
npm run dev
```

That's it! The application will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## First Steps

1. **Open the app**: Navigate to http://localhost:5173
2. **Test normal behavior**: Click "Normal Resume" → Submit
3. **Test an attack**: Click "Prompt Injection" → Submit → See score jump to 100
4. **View dashboard**: Click "HR Dashboard" in navbar
5. **Toggle modes**: Click "VULNERABLE MODE" button to enable secure mode

## Quick Test

### Test Prompt Injection (30 seconds)
1. Click "Prompt Injection" button
2. Click "Submit Application"
3. See red banner: "PROMPT INJECTION SUCCESSFUL"
4. Score = 100 despite low qualifications

### Test Keyword Stuffing (30 seconds)
1. Click "Keyword Stuffing" button
2. Click "Submit Application"
3. See orange warning about repeated keywords
4. Score is inflated (90+)

### Test Model Extraction (30 seconds)
1. Go to "HR Dashboard"
2. In yellow box, type "Python"
3. Click "Extract"
4. See: "Weight: +5 points"

## Modes

### Vulnerable Mode (Red Button)
- All attacks work
- System demonstrates security flaws
- Educational mode

### Secure Mode (Green Button)
- Attacks are blocked
- Shows how defenses work
- Compare before/after

## Controls

- **Reset**: Clear all data and start fresh
- **Apply**: Submit resumes (Applicant Portal)
- **HR Dashboard**: View rankings and candidate details

## Common Issues

**Port already in use?**
```bash
# Kill processes on ports 3001 or 5173
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**Database locked?**
```bash
# Remove database and restart
rm database/resumes.db
npm run dev
```

**Build fails?**
```bash
# Ensure Node.js 18+
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## File Structure

```
project/
├── backend/
│   ├── database.js          # SQLite schema
│   ├── scoringEngine.js     # Vulnerable AI logic
│   └── server.js            # Express API
├── src/
│   ├── components/
│   │   ├── ApplicantPortal.jsx
│   │   └── HRDashboard.jsx
│   ├── App.jsx
│   └── main.jsx
├── database/
│   └── resumes.db           # Created on first run
├── README.md                # Full documentation
├── LAB_GUIDE.md            # Step-by-step exercises
├── ATTACK_EXAMPLES.md      # Attack payloads
└── package.json
```

## Documentation

- **README.md**: Complete project documentation
- **LAB_GUIDE.md**: Step-by-step lab exercises
- **ATTACK_EXAMPLES.md**: Ready-to-use attack payloads

## Next Steps

1. Read **LAB_GUIDE.md** for structured exercises
2. Try all attacks in **ATTACK_EXAMPLES.md**
3. Toggle secure mode to see defenses
4. Customize attacks and test bypasses

## Teaching Tips

### For Instructors

**Demo Flow** (10 minutes):
1. Show normal resume (2 min)
2. Demo prompt injection (2 min)
3. Demo keyword stuffing (2 min)
4. Show model extraction (2 min)
5. Toggle secure mode (2 min)

**Lab Session** (60 minutes):
1. Students complete Lab Exercises 1-7 (40 min)
2. Group discussion of findings (10 min)
3. Challenge: Find new vulnerabilities (10 min)

**Assessment Ideas**:
- Write security audit report
- Design better defenses
- Create threat model
- Build detection system
- Develop bypass techniques

### Learning Objectives

After this lab, students will understand:
- ✅ AI-specific vulnerabilities
- ✅ Prompt injection attacks
- ✅ Adversarial machine learning
- ✅ STRIDE threat modeling
- ✅ Defense strategies
- ✅ Secure AI development

## Support

This is a self-contained educational tool. Everything runs locally.

For issues:
1. Check this guide
2. Review README.md
3. Check LAB_GUIDE.md

## Safety Notes

⚠️ This system is **INTENTIONALLY VULNERABLE**

- ❌ Do NOT deploy to production
- ❌ Do NOT use for real hiring
- ❌ Do NOT expose to internet
- ❌ Do NOT store real user data

✅ Use in controlled lab environments
✅ Use for educational purposes
✅ Learn attack and defense techniques

## Quick Commands

```bash
# Start application
npm run dev

# Build for production (testing only)
npm run build

# Reset everything
rm -rf database/resumes.db node_modules
npm install
npm run dev
```

## Success Indicators

You know it's working when:
- ✅ Frontend loads at localhost:5173
- ✅ Example buttons load resume text
- ✅ Submissions show scores
- ✅ Dashboard shows rankings
- ✅ Prompt injection gives score of 100
- ✅ Secure mode toggle works
- ✅ Visual attack banners appear

---

**Ready?** Run `npm run dev` and start learning AI security! 🚀
