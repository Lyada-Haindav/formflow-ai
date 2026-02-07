# FormFlow AI EC2 Deployment Guide

## 🚀 Quick Start Deployment

### Option 1: Docker Deployment (Recommended)

**Step 1: Setup EC2 Instance**
```bash
# Launch EC2 with Ubuntu 22.04
# Security Group: Open ports 80, 443, 22
# Instance Type: t3.small or larger
```

**Step 2: Install Docker**
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER
newgrp docker
```

**Step 3: Deploy with Docker**
```bash
# Copy files to EC2
scp -r . ubuntu@your-ec2-ip:/home/ubuntu/formflow-ai/

# SSH into EC2
ssh ubuntu@your-ec2-ip

# Deploy
cd formflow-ai
docker-compose -f docker-compose.ec2.yml up -d
```

### Option 2: Manual Deployment

**Step 1: Setup EC2 Instance**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install openjdk-17-jdk nginx nodejs npm postgresql postgresql-contrib -y
```

**Step 2: Run Deployment Script**
```bash
# Make script executable
chmod +x deploy-ec2.sh

# Run deployment
./deploy-ec2.sh
```

## 🔧 Configuration Required

### Environment Variables
Update these in `deploy-ec2.sh`:
- `DOMAIN="your-domain.com"` - Your domain or EC2 IP
- MySQL credentials (user, password, database name)
- API keys

### Database Setup
```bash
# MySQL on EC2
sudo docker exec -it formflow-mysql mysql -u root -p
CREATE DATABASE IF NOT EXISTS formflow;
CREATE USER IF NOT EXISTS 'formflow_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON formflow.* TO 'formflow_user'@'%';
FLUSH PRIVILEGES;
```

## 🌐 Access Your App

Once deployed:
- **Frontend:** `http://your-ec2-ip`
- **Backend API:** `http://your-ec2-ip/api`
- **Health Check:** `http://your-ec2-ip/health`

## 🔒 SSL Setup (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew SSL
sudo crontab -e
```

## 📊 Monitoring

### Check Logs
```bash
# Docker logs
docker-compose -f docker-compose.ec2.yml logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log

# Backend logs
docker logs formflow-backend
```

### Restart Services
```bash
# Restart all services
docker-compose -f docker-compose.ec2.yml restart

# Restart individual service
docker-compose -f docker-compose.ec2.yml restart backend
```

## 🚨 Troubleshooting

### Common Issues
1. **Port conflicts** - Check if ports 80, 8080 are open
2. **Database connection** - Verify PostgreSQL is running
3. **Nginx errors** - Check nginx configuration
4. **Backend not starting** - Check Java version and logs

### Health Checks
```bash
# Check if services are running
docker-compose -f docker-compose.ec2.yml ps

# Test backend API
curl http://localhost:8080/api/health

# Test frontend
curl -I http://localhost/
```

## 📱 Mobile Responsiveness

The deployed app includes:
- ✅ Responsive design for all screen sizes
- ✅ Touch-friendly interface
- ✅ Progressive Web App features
- ✅ Fast loading with optimization

## 🔐 Security Best Practices

1. **Firewall Rules** - Only open necessary ports
2. **SSL Certificate** - Use HTTPS in production
3. **Environment Variables** - Never commit secrets to git
4. **Regular Updates** - Keep system and dependencies updated
5. **Backups** - Regular database and file backups

## 📈 Scaling

### When to Scale:
- **High CPU usage** - Consider larger instance
- **Memory pressure** - Add more RAM
- **Database load** - Consider RDS for production
- **Traffic spikes** - Add load balancer

## 🎯 Production Checklist

- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Database created and seeded
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Load testing completed
