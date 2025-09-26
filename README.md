🚀 LeadScrape MVP — Chrome Extension + Playwright Automation
Automate LinkedIn lead discovery with a secure, scalable browser automation stack.
Scrape public LinkedIn search results → Get CSV exports → Grow your pipeline.

⚠️ Compliance Note: This tool only accesses publicly available LinkedIn data and does not log in, send messages, or violate LinkedIn’s Terms of Service. Use responsibly. 

📦 Features
✅ Chrome Extension (Manifest V3) to trigger jobs
✅ Playwright-based worker for stealthy scraping
✅ Job queue (BullMQ + Redis)
✅ User & job tracking (PostgreSQL + Prisma)
✅ Local dev with Docker Compose
✅ Kubernetes + Helm for production
✅ Stripe-ready billing hooks (subscription + metered)
🛠️ Tech Stack
LAYER
TECH
Frontend
Chrome Extension (HTML/JS)
Backend
Fastify (Node.js + TypeScript)
ORM
Prisma
Queue
BullMQ + Redis
Browser Automation
Playwright (Chromium, headless)
Storage
PostgreSQL + MinIO (S3-compatible)
Infra
Docker, Docker Compose, Kubernetes, Helm
CI/CD
GitHub Actions

🚴 Quick Start (Local Dev)
1. Clone & Install
bash


1
2
3
4
5
6
git clone https://github.com/your-username/leadscrape-mvp.git
cd leadscrape-mvp

# Install backend & worker deps
npm install --prefix backend
npm install --prefix worker
2. Start Services
bash


1
2
cd infra
docker-compose up --build
This runs: Postgres, Redis, MinIO, Backend (port 3000), and Worker. 

3. Initialize Database
bash


1
2
cd backend
npx prisma db push
4. Test API
bash


1
2
3
4
5
6
curl -X POST http://localhost:3000/api/v1/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "flowId": "linkedin-scrape-v1",
    "input": {"searchQuery": "CTO in Berlin", "maxProfiles": 5}
  }'
5. Load Chrome Extension
Open Chrome → chrome://extensions
Enable Developer mode
Click Load unpacked → select extension/ folder
The extension sends jobs to http://localhost:3000 by default. 

📁 Project Structure


1
2
3
4
5
6
7
8
9
leadscrape-mvp/
├── extension/          # Chrome extension (Manifest V3)
├── backend/            # Fastify API + Prisma
├── worker/             # Playwright job processor
├── infra/
│   ├── docker-compose.yml   # Local dev
│   └── helm/                # Kubernetes Helm chart
├── .github/workflows/  # CI/CD (build + deploy)
└── README.md
☁️ Deployment
Docker Compose (Staging)
Already included in infra/docker-compose.yml.

Kubernetes (Production)
bash


1
2
3
4
5
6
7
kubectl create secret generic leadscrape-secrets \
  --from-literal=DATABASE_URL="..." \
  --from-literal=REDIS_URL="..." \
  --from-literal=JWT_SECRET="..." \
  --from-literal=STRIPE_KEY="..."

helm install leadscrape ./infra/helm/leadscrape
CI/CD
Push to main → GitHub Actions builds images and deploys to your cluster.

💰 Monetization Ready
Stripe integration stubs included (backend/src/services/stripe.ts)
Usage-based billing via job runtime & profile count
Plans: Free / Pro ($29/mo) / Agency ($99/mo)
Add your STRIPE_KEY and STRIPE_PRICE_PRO in env. 

📜 Legal & Safety
Only scrapes public LinkedIn search results
No session cookies, no login, no messaging
GDPR-compliant data handling (results auto-expire)
Include clear warnings in UI (already in popup)
Recommendation: Add a privacy policy and terms of service before publishing. 

🚀 Launch Checklist
Deploy backend to cloud (Render, Fly, or AWS)
Connect real S3 bucket (replace MinIO)
Implement auth (Chrome Identity → JWT)
Add Stripe checkout + webhooks
Publish extension to Chrome Web Store
Create landing page (use marketing copy from docs)
Launch on Product Hunt + LinkedIn
🤝 Contributing
PRs welcome! Focus areas:

Better Playwright stealth (user-agent rotation, proxy support)
CRM exports (HubSpot, Pipedrive)
Job status notifications (email/webhook)
📄 License
MIT — use freely for commercial or personal projects.

Built with ❤️ for sales teams, recruiters, and growth hackers.
Not affiliated with LinkedIn. 
