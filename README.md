# APEX TIPS

Expert football predictions SaaS with crypto payments.

**Stack:** Django + DRF · React + React Bootstrap · Supabase (Postgres + Auth) · NowPayments · Render

---

## Project Structure

```
apex-tips/
├── backend/     # Django + DRF
├── frontend/    # React (Vite) + React Bootstrap
└── render.yaml  # Render deploy config
```

---

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # Fill in your values

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Required .env values

| Key | Where to get it |
|-----|----------------|
| `DJANGO_SECRET_KEY` | Generate: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `DB_*` | Supabase → Settings → Database → Connection string |
| `SUPABASE_JWT_SECRET` | Supabase → Settings → API → JWT Secret |
| `NOWPAYMENTS_API_KEY` | nowpayments.io → Store Settings → API Key |
| `NOWPAYMENTS_IPN_SECRET` | nowpayments.io → Store Settings → IPN Secret |
| `BACKEND_URL` | Your Render app URL |
| `CORS_ALLOWED_ORIGINS` | Your Vercel frontend URL |

---

## Frontend Setup

```bash
cd frontend
npm install

cp .env.example .env.local      # Fill in your Supabase values
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/games/` | All games (premium locked without access) |
| `GET` | `/api/games/<id>/` | Single game detail |
| `GET` | `/api/access/verify/` | Check if user/token has access |
| `POST` | `/api/payments/create/` | Create NowPayments invoice |
| `POST` | `/api/payments/webhook/` | NowPayments IPN webhook |
| `GET` | `/api/subscriptions/me/` | Current user's subscription |

### Payment product IDs

| product_id | Price | Type |
|------------|-------|------|
| `token_one_time` | $2 | 24h access token |
| `token_daily` | $3 | Daily token |
| `token_weekly` | $8 | Weekly token |
| `subscription_weekly` | $5 | Recurring subscription |
| `subscription_monthly` | $15 | Recurring subscription |
| `subscription_vip` | $40 | 90-day subscription |

---

## Deploy to Render (Backend)

1. Push repo to GitHub
2. Go to render.com → New Web Service → connect repo
3. Render auto-detects `render.yaml`
4. Add all env vars in Render dashboard
5. Deploy

## Deploy Frontend to Vercel

```bash
cd frontend
npm run build
# Push to GitHub, connect to Vercel
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel env vars
# Set VITE_API_URL to your Render backend URL
```

---

## NowPayments Webhook Setup

In your NowPayments dashboard set the IPN callback URL to:
```
https://your-app.onrender.com/api/payments/webhook/
```

---

## Django Admin

Visit `/admin/` to manage games, transactions, and subscriptions.
Add tips directly from the admin panel without building a separate CMS.
