


🚀 LeadScrape MVP
Automate public LinkedIn lead scraping → get CSV exports via Chrome Extension + Playwright backend.

⚠️ Compliant: No login, no messaging — public data only.

✅ Features
Chrome Extension (Manifest V3)
Playwright + BullMQ + Redis
PostgreSQL + Prisma
Docker Compose (local)
Stripe-ready billing
Kubernetes + Helm + GitHub Actions
▶️ Quick Start
bash


1
2
3
4
git clone https://github.com/your-username/leadscrape-mvp.git
cd leadscrape-mvp
npm install --prefix backend --prefix worker
cd infra && docker-compose up --build
Then:

Run npx prisma db push (in backend/)
Load extension/ in Chrome (chrome://extensions)
Submit a job → worker scrapes → CSV result
📜 Legal
Only public LinkedIn data
Not affiliated with LinkedIn
Add Privacy Policy before publishing
MIT License — free for commercial use.

