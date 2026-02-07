#!/bin/bash

# FormFlow AI - Vercel + Railway Deployment Script
set -e

echo "🚀 Deploying FormFlow AI to Vercel + Railway..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed. Installing...${NC}"
        case $1 in
            "vercel")
                npm install -g vercel
                ;;
            "railway")
                npm install -g @railway/cli
                ;;
        esac
    else
        echo -e "${GREEN}✅ $1 is installed${NC}"
    fi
}

echo -e "${YELLOW}📋 Step 1: Check Dependencies${NC}"
check_tool "vercel"
check_tool "railway"

echo -e "${YELLOW}📋 Step 2: Build Frontend${NC}"
cd client
npm install
npm run build
cd ..

echo -e "${YELLOW}📋 Step 3: Build Backend${NC}"
cd backend
./mvnw clean package -DskipTests
cd ..

echo -e "${YELLOW}📋 Step 4: Deploy to Vercel${NC}"
echo "Deploying frontend to Vercel..."
vercel --prod --confirm

echo -e "${YELLOW}📋 Step 5: Deploy to Railway${NC}"
echo "Deploying backend to Railway..."
railway up

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Get your Railway backend URL from dashboard"
echo "2. Add VITE_API_URL environment variable in Vercel"
echo "3. Test your application"
echo ""
echo -e "${GREEN}🌐 Your app will be available at:${NC}"
echo "- Frontend: https://your-app.vercel.app"
echo "- Backend: https://your-backend.railway.app/api"
echo ""
echo -e "${YELLOW}📋 Don't forget to:${NC}"
echo "- Set up MySQL database on Railway"
echo "- Configure environment variables"
echo "- Test API connectivity"
