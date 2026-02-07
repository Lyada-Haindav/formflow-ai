# FormFlow AI - Vercel + Railway Deployment

## 🚀 Quick Deployment Guide

### Frontend on Vercel (Free)

**Step 1: Install Vercel CLI**
```bash
npm i -g vercel
```

**Step 2: Deploy Frontend**
```bash
# From project root
vercel --prod
```

**Step 3: Configure Environment Variables**
In Vercel dashboard:
- `VITE_API_URL` = Your Railway backend URL

---

### Backend on Railway (Free Tier)

**Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

**Step 2: Login to Railway**
```bash
railway login
```

**Step 3: Deploy Backend**
```bash
# From project root
railway up
```

**Step 4: Configure Environment Variables**
In Railway dashboard:
- `SPRING_DATASOURCE_URL` = Your MySQL connection string
- `SPRING_DATASOURCE_USERNAME` = Your MySQL username
- `SPRING_DATASOURCE_PASSWORD` = Your MySQL password
- `GOOGLE_API_KEY` = Your Gemini API key

---

## 🔧 Database Setup (Railway MySQL)

**Step 1: Add MySQL Service**
1. Go to Railway dashboard
2. Click "New Service"
3. Select "MySQL"
4. Choose "MySQL" from the marketplace

**Step 2: Get Connection Details**
```bash
# Get connection string from Railway
# Format: jdbc:mysql://host:port/database
```

**Step 3: Update Backend Config**
```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://your-railway-mysql-host:3306/railway
    username: railway
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

---

## 🌐 Access Your App

**Frontend:** `https://your-app.vercel.app`
**Backend:** `https://your-backend.railway.app/api`
**Health Check:** `https://your-backend.railway.app/api/health`

---

## 🔗 Connect Frontend to Backend

**Update client/src/lib/api.ts:**
```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'https://your-backend.railway.app/api';
```

**Or update .env.local:**
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 📱 Mobile App Ready

Your deployed app will be:
- ✅ **Responsive** - Works on all devices
- ✅ **Fast** - Global CDN with Vercel
- ✅ **Reliable** - Managed infrastructure
- ✅ **Scalable** - Auto-scaling included

---

## 🔄 Auto-Deploy Setup

**Frontend (Vercel):**
- Connect GitHub repository
- Auto-deploy on push to main

**Backend (Railway):**
- Connect GitHub repository
- Auto-deploy on push to main

---

## 📊 Monitoring

**Vercel Dashboard:**
- Analytics and performance
- Error tracking
- Build logs

**Railway Dashboard:**
- Service health
- Resource usage
- Application logs

---

## 🔒 Security

**HTTPS:** Automatic on both platforms
**Environment Variables:** Secure storage
**Database:** Private network
**API:** Railway handles security

---

## 💰 Cost Breakdown

**Vercel (Frontend):**
- Free tier: 100GB bandwidth/month
- Hobby: $20/month for more features

**Railway (Backend + MySQL):**
- Free tier: $5 credit/month
- Hobby: $20/month for more resources

**Total Cost:** $0-$40/month depending on usage

---

## 🎯 Production Checklist

- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Set up MySQL on Railway
- [ ] Configure environment variables
- [ ] Update frontend API URL
- [ ] Test all endpoints
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring

---

## 🚨 Troubleshooting

**Common Issues:**
1. **CORS errors** - Add backend URL to Vercel env vars
2. **Database connection** - Check MySQL connection string
3. **Build failures** - Verify dependencies in pom.xml
4. **API timeouts** - Check Railway service status

**Health Checks:**
```bash
# Test backend
curl https://your-backend.railway.app/api/health

# Test frontend
curl -I https://your-app.vercel.app
```
