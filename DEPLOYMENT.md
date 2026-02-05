# SitePilot Deployment Guide

## 🚀 Quick Start (Development)

```bash
# Navigate to project directory
cd sitepilot

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

---

## 📦 Production Build

```bash
# Create optimized production build
npm run build

# The build folder is ready to deploy
```

---

## 🌐 Deployment Options

### 1. **Vercel** (Recommended - Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Or use Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Click "Deploy"
4. Done! Your app is live

---

### 2. **Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

**Or use Netlify Dashboard:**
1. Drag and drop `build` folder to [netlify.com/drop](https://netlify.com/drop)
2. Done!

---

### 3. **GitHub Pages**

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

---

### 4. **AWS S3 + CloudFront**

```bash
# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Configure CloudFront for caching
```

---

### 5. **Traditional Hosting** (cPanel, etc.)

1. Run `npm run build`
2. Upload contents of `build` folder via FTP
3. Point domain to the folder
4. Done!

---

## 🔧 Environment Configuration

For production, you should move API calls to a backend:

### Create `.env` file:

```env
REACT_APP_API_URL=https://your-backend.com/api
REACT_APP_ENV=production
```

### Update API calls in `App.js`:

```javascript
const response = await fetch(`${process.env.REACT_APP_API_URL}/analyze`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(projectData)
});
```

---

## 🔐 Security Best Practices

### For Production:

1. **Never expose API keys in frontend code**
2. **Create a backend API:**

```javascript
// Backend (Node.js/Express example)
app.post('/api/analyze', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: req.body.messages
    })
  });
  
  const data = await response.json();
  res.json(data);
});
```

3. **Use HTTPS**
4. **Implement rate limiting**
5. **Add authentication for user accounts**

---

## 🎯 Performance Optimization

### Code Splitting:

```javascript
// In App.js
import React, { lazy, Suspense } from 'react';

const Results = lazy(() => import('./components/Results/Results'));

// Wrap in Suspense
<Suspense fallback={<LoadingStep />}>
  <Results {...props} />
</Suspense>
```

### Image Optimization:
- Use WebP format for images
- Implement lazy loading
- Add compression

### Caching:
- Configure service workers
- Add PWA capabilities

---

## 📊 Analytics Integration

### Google Analytics:

```bash
npm install react-ga4
```

```javascript
// In index.js
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
ReactGA.send('pageview');
```

---

## 🐛 Debugging Production Issues

```bash
# Check build errors
npm run build

# Test production build locally
npx serve -s build
```

---

## 📈 Monitoring

### Recommended Services:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User analytics
- **Hotjar** - User behavior

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## 💰 Cost Estimation

### Hosting Costs (Monthly):
- **Vercel/Netlify (Hobby)**: $0 (100GB bandwidth)
- **Vercel/Netlify (Pro)**: $20
- **AWS S3 + CloudFront**: ~$1-5 (depending on traffic)
- **Traditional Hosting**: $5-50

### API Costs:
- Anthropic Claude API: Pay per token
- Consider implementing caching to reduce costs

---

## 📞 Support

For deployment issues:
- Check browser console for errors
- Review Network tab for API failures
- Test in incognito mode
- Clear cache and rebuild

---

**Last Updated:** February 2026
