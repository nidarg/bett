# Betting Platform MVP – Full Flow Explanation

Acest proiect este un MVP pentru o platformă de **live betting insights cu abonament**.

Scopul aplicației este:
- colectarea emailului utilizatorului
- inițierea unui trial gratuit prin Stripe
- confirmarea plății prin webhook
- pregătirea accesului către Telegram

Acest document explică în detaliu:
- flow-ul complet al aplicației
- cum se leagă frontend-ul de backend
- cum funcționează Stripe Checkout
- de ce este necesar webhook-ul
- cum ajunge Stripe să comunice cu backend-ul de pe Render

---

# 1. Arhitectura aplicației

Proiectul este împărțit în două părți:

bett/
frontend/
backend/


## Frontend
- React + Vite + Tailwind
- UI + formular
- trimite request către backend
- face redirect către Stripe

## Backend
- Node.js + Express
- creează sesiune Stripe
- primește webhook-uri Stripe
- validează semnătura Stripe
- procesează evenimentele

---

# 2. Flow-ul complet (END-TO-END)

Flow-ul aplicației este:

User intră pe site
↓
Introduce email
↓
Frontend → POST /api/subscribe
↓
Backend creează Stripe Checkout Session
↓
Frontend face redirect la Stripe
↓
User plătește
↓
Stripe trimite webhook la backend (Render)
↓
Backend validează webhook
↓
Backend procesează eventul


---

# 3. Frontend – cum funcționează

## Formularul

În `HomePage.jsx`:

```js
const onSubmit = async (data) => {
  const API_URL = import.meta.env.VITE_API_URL

  const response = await fetch(`${API_URL}/api/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const result = await response.json()

  window.location.href = result.url
}

Ce se întâmplă aici
1.User introduce email
2.Se face request către backend:

POST /api/subscribe

3.Backend răspunde cu:
{ "url": "https://checkout.stripe.com/..." }

4.Frontend face redirect la Stripe

4. Variabile de mediu frontend
frontend/.env
VITE_API_URL=https://bett-backend.onrender.com

În cod:

const API_URL = import.meta.env.VITE_API_URL

5. Backend – structură
backend/
  server.js
  src/
    config/stripe.js
    controllers/
    routes/
    services/
6. server.js – punctul central
app.use("/webhook", webhookRoutes)
app.use(express.json())
app.use("/api", subscribeRoutes)
IMPORTANT

Webhook-ul este definit înainte de express.json() pentru că Stripe are nevoie de raw body.

7. Config Stripe
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
8. Crearea Stripe Checkout Session
Route
POST /api/subscribe
Controller
const { email } = req.body
const result = await createSubscription(email)
Service
const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  customer_email: email,
  line_items: [
    {
      price: process.env.STRIPE_PRICE_ID,
      quantity: 1
    }
  ],
  subscription_data: {
    trial_period_days: 7
  },
  success_url: `${process.env.FRONTEND_URL}/success`,
  cancel_url: `${process.env.FRONTEND_URL}/cancel`
})
9. Ce înseamnă fiecare câmp
mode: "subscription"

Creăm abonament, nu plată unică.

customer_email

Stripe știe cine este utilizatorul.

price

Trebuie să fie:

price_...
trial_period_days

Activează trial-ul gratuit.

success_url / cancel_url

Redirect UI (nu logică backend).

10. De ce NU ne bazăm pe success page

Pagina /success NU garantează plata.

Userul poate:

închide tab-ul
pierde conexiunea
nu se întoarce pe site

👉 Singura sursă de adevăr = webhook Stripe

11. Ce este webhook-ul

Webhook = request trimis de Stripe către backend-ul nostru.

Exemplu:

POST https://bett-backend.onrender.com/webhook/stripe
12. Flow webhook
Stripe finalizează plata
        ↓
Stripe trimite event
        ↓
Backend primește request
        ↓
Verifică semnătura
        ↓
Procesează event
13. Route webhook
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
)
14. De ce folosim express.raw()

Stripe verifică semnătura folosind body-ul original.

Dacă folosim:

express.json()

→ semnătura NU mai este validă

15. Controller webhook
const signature = req.headers["stripe-signature"]

const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
)
Ce face
verifică că request-ul vine de la Stripe
protejează împotriva requesturilor fake
16. Service webhook
switch (event.type) {
  case "checkout.session.completed":
    ...
}
17. Eventuri importante
checkout.session.completed

User a terminat checkout-ul

customer.subscription.updated

Abonament modificat

customer.subscription.deleted

Abonament anulat

invoice.payment_failed

Plată eșuată

18. Ce primim din Stripe

În event:

const session = event.data.object

session.id
session.customer
session.subscription
session.customer_email

Acestea vor fi salvate ulterior în DB.

19. Backend live pe Render

URL:

https://bett-backend.onrender.com

Webhook:

https://bett-backend.onrender.com/webhook/stripe
20. De ce folosim Render
URL public HTTPS
Stripe poate trimite webhook
rulează server Node.js
gestionează environment variables
21. De ce NU folosim Stripe CLI

Stripe CLI este pentru local.

Noi folosim:

Stripe → Render backend (LIVE)
22. Environment variables
Backend
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
Frontend
VITE_API_URL=https://bett-backend.onrender.com
23. Ce am realizat până acum

✔ landing page
✔ formular validat
✔ integrare Stripe Checkout
✔ free trial
✔ backend structurat
✔ webhook live pe Render
✔ validare semnătură Stripe
✔ procesare event

24. Concluzie

Aplicația funcționează complet pe flow-ul real:

Frontend → Backend → Stripe → Webhook → Backend

Aceasta este baza pentru:

salvare user în DB
trimitere email
acces Telegram
control abonament
25. Ce urmează
salvare în Supabase
generare activation token
trimitere email
integrare Telegram bot
control acces abonament