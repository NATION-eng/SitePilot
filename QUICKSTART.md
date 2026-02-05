# SitePilot - Quick Start Guide

## 🚀 Get Running in 3 Minutes

### Step 1: Extract Project

```bash
# If you have the .tar.gz file:
tar -xzf sitepilot-project.tar.gz
cd sitepilot

# Or just navigate to the sitepilot folder
cd sitepilot
```

### Step 2: Install Dependencies

```bash
npm install
```

**This will install:**
- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1

**Wait time:** ~2-3 minutes (depending on internet speed)

### Step 3: Start Development Server

```bash
npm start
```

**What happens:**
- Webpack dev server starts
- Browser opens automatically at `http://localhost:3000`
- Hot reload enabled (changes appear instantly)

---

## ✅ You're Done!

Your app should now be running. Try:
1. Click "Start New Project"
2. Select a project type
3. Fill in the details
4. Generate AI analysis

---

## 🐛 Troubleshooting

### "npm: command not found"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org)

### Port 3000 already in use
**Solution:** 
```bash
# Use different port
PORT=3001 npm start
```

### Dependency installation fails
**Solution:**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### API calls failing
**Issue:** The current implementation calls Claude API directly from browser
**For MVP:** This works fine for testing
**For Production:** You need to set up a backend (see DEPLOYMENT.md)

---

## 📁 What You Have

```
sitepilot/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── App.js             # Main app logic
│   └── styles.js          # Styling
├── public/                 # Static files
├── package.json           # Dependencies
├── README.md              # Documentation
├── DEPLOYMENT.md          # How to deploy
└── ARCHITECTURE.md        # Technical details
```

---

## 🎯 Next Steps

### For Development:
1. **Edit Components:** Open `src/components/` and start customizing
2. **Add Features:** Check `ARCHITECTURE.md` for code structure
3. **Test Changes:** Save file → browser auto-reloads

### For Deployment:
1. **Build:** `npm run build`
2. **Deploy:** Follow `DEPLOYMENT.md` guide
3. **Options:** Vercel, Netlify, AWS, or traditional hosting

### For Production:
1. **Backend:** Set up Node.js/Express server
2. **Database:** Add PostgreSQL for project storage
3. **Auth:** Implement user authentication
4. **Security:** Move API calls to backend

---

## 📚 Learning Resources

### React Basics:
- [React Docs](https://react.dev)
- [React Tutorial](https://react.dev/learn)

### Project Structure:
- Read `ARCHITECTURE.md` for detailed technical overview
- Each component has comments explaining its purpose

### Deployment:
- Read `DEPLOYMENT.md` for step-by-step guides
- Includes Vercel, Netlify, AWS, GitHub Pages

---

## 💡 Key Commands

```bash
# Development
npm start              # Start dev server
npm test               # Run tests
npm run build          # Production build

# Deployment
npm run build          # Build first
vercel                 # Deploy to Vercel
netlify deploy         # Deploy to Netlify

# Maintenance
npm install            # Install dependencies
npm update             # Update packages
npm audit fix          # Fix security issues
```

---

## 🎨 Customization Quick Tips

### Change Colors:
Edit `src/styles.js` - Look for color variables at the top

### Add New Step:
1. Create `src/components/Steps/StepFour.js`
2. Import in `src/components/FormContainer.js`
3. Add condition: `{currentStep === 4 && <StepFour />}`

### Modify AI Prompt:
Edit `src/App.js` → `generateAnalysis()` function → Update the prompt text

### Change Layout:
Edit component styles in `src/styles.js`

---

## 🆘 Need Help?

1. **Check ARCHITECTURE.md** - Explains how everything works
2. **Check DEPLOYMENT.md** - Deployment and production setup
3. **Browser Console** - Check for error messages (F12)
4. **React DevTools** - Install browser extension for debugging

---

## ✨ What Makes This Project Special

- **Component-Based:** Clean, reusable React components
- **State Management:** Proper React hooks (useState)
- **AI-Powered:** Real Claude API integration
- **Professional Design:** Industrial/utilitarian aesthetic
- **Well-Documented:** Comprehensive guides included
- **Production-Ready:** Easy to deploy and scale

---

**You're all set! Happy coding! 🚀**

---

**Version:** 1.0.0  
**Last Updated:** February 2026
