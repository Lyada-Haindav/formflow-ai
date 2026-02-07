#!/bin/bash

# FormFlow AI EC2 Deployment Script
# This script deploys both frontend and backend to EC2

set -e

echo "🚀 Starting FormFlow AI EC2 Deployment..."

# Configuration
APP_DIR="/var/www/formflow-ai"
BACKEND_JAR="form-weaver-backend-0.0.1-SNAPSHOT.jar"
BACKEND_PORT=8080
DOMAIN="your-domain.com"  # UPDATE THIS

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}📋 Step 1: Update System${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${GREEN}📋 Step 2: Install Dependencies${NC}"
sudo apt install openjdk-17-jdk nginx nodejs npm docker.io docker-compose -y

echo -e "${GREEN}📋 Step 3: Setup Directories${NC}"
sudo mkdir -p $APP_DIR/{frontend,backend,logs}
sudo chown -R $USER:$USER $APP_DIR

echo -e "${GREEN}📋 Step 4: Setup Nginx${NC}"
sudo tee /etc/nginx/sites-available/formflow-ai << 'EOF'
server {
    listen 80;
    server_name $DOMAIN;
    
    # Frontend
    location / {
        root $APP_DIR/frontend;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
EOF

sudo ln -sf /etc/nginx/sites-available/formflow-ai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}📋 Step 5: Deploy Frontend${NC}"
cd /tmp
git clone https://github.com/Lyada-Haindav/formflow-ai.git
cd formflow-ai/client
npm install
npm run build
sudo cp -r dist/* $APP_DIR/frontend/

echo -e "${GREEN}📋 Step 6: Deploy Backend${NC}"
cd ../backend
./mvnw clean package -DskipTests
sudo cp target/$BACKEND_JAR $APP_DIR/backend/

echo -e "${GREEN}📋 Step 7: Create Backend Service${NC}"
sudo tee /etc/systemd/system/formflow-backend.service << 'EOF'
[Unit]
Description=FormFlow AI Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$APP_DIR/backend
ExecStart=/usr/bin/java -jar $BACKEND_JAR
RestartSec=10
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable formflow-backend
sudo systemctl start formflow-backend

echo -e "${GREEN}📋 Step 8: Setup Environment Variables${NC}"
sudo tee $APP_DIR/backend/.env << 'EOF'
# MySQL Database Configuration
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/formflow
SPRING_DATASOURCE_USERNAME=formflow_user
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQL8Dialect

# Gemini API
GOOGLE_API_KEY=your_gemini_api_key
EOF

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update DOMAIN variable in this script"
echo "2. Configure database (PostgreSQL/Supabase)"
echo "3. Set environment variables"
echo "4. Setup SSL certificate with Let's Encrypt"
echo ""
echo -e "${GREEN}🌐 Access your app at: http://$DOMAIN${NC}"
echo -e "${GREEN}🔧 Backend API at: http://$DOMAIN/api${NC}"
