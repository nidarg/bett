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


## 25. Ce urmează

salvare în Supabase  
generare activation token  
trimitere email  
integrare Telegram bot  
control acces abonament  

---

# 26. Integrarea Supabase (Database Layer)

După webhook, următorul pas a fost salvarea utilizatorului într-o bază de date reală.

Am folosit :contentReference[oaicite:0]{index=0} pentru:

- stocare persistentă
- acces rapid prin API
- integrare simplă cu Node.js

---

## Tabela `subscribers`

```sql
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'trialing',
  created_at timestamptz not null default now()
);
Flow actualizat
Stripe webhook
        ↓
backend
        ↓
insert în Supabase
27. Salvarea subscriberului din webhook

În webhookService.js:

await createSubscriber({
  email: session.customer_email,
  stripeCustomerId: session.customer,
  stripeSubscriptionId: session.subscription,
  status: "trialing"
})
28. Activation Token (identitate unică)

Pentru a securiza accesul, fiecare user primește un token unic.

Generare token
import crypto from "crypto"

export const generateActivationToken = () => {
  return crypto.randomBytes(32).toString("hex")
}
Extindere DB
alter table subscribers
add column activation_token text;
Salvare token
activation_token: token
29. De ce folosim activation token
✔ identifică userul unic
✔ permite validare fără login
✔ previne sharing-ul accesului
✔ conectează Stripe cu Telegram
30. Endpoint de activare
GET /api/activate?token=...
Flow
User accesează link
→ frontend citește token
→ frontend apelează backend
→ backend verifică token
→ returnează subscriber
31. Activation Page (Frontend)

Ruta:

/activate?token=...
Ce face
citește tokenul din URL
apelează backendul
afișează rezultat
UI rezultat

Succes:

✓ Activare validă
Email: user@example.com
[ Conectează Telegram ]

Eroare:

❌ Token invalid sau expirat
32. Telegram Deep Linking

Telegram permite transmiterea de parametri către bot:

https://t.me/BOT_NAME?start=TOKEN
Ce se întâmplă
User apasă link
→ Telegram deschide botul
→ trimite:
/start TOKEN
33. Crearea botului Telegram

Botul este creat folosind:

BotFather

Pași
/start
/newbot
→ nume
→ username (trebuie să se termine în "bot")
Rezultat
TELEGRAM_BOT_TOKEN
34. Integrarea botului în backend
import TelegramBot from "node-telegram-bot-api"

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN)
35. Tratarea comenzii /start
bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  const token = match[1]
})
36. Legarea Telegram de subscriber
await supabase
  .from("subscribers")
  .update({ telegram_id: chatId })
  .eq("activation_token", token)
Extindere DB
alter table subscribers
add column telegram_id bigint;
37. Flow complet actual
User plătește (Stripe)
        ↓
Webhook Stripe
        ↓
Salvare subscriber (Supabase)
        ↓
Generare token
        ↓
User accesează /activate
        ↓
Validare token
        ↓
User apasă "Conectează Telegram"
        ↓
Telegram trimite /start TOKEN
        ↓
Backend validează token
        ↓
Salvează telegram_id
38. Ce am realizat acum
✔ Stripe payments
✔ webhook real
✔ database persistence
✔ activation system
✔ frontend activation page
✔ Telegram identity linking
39. Arhitectura aplicației
Frontend → UI & UX
Backend → business logic
Stripe → payments
Supabase → database
Telegram → delivery channel
40. Ce urmează
1. Email automat
trimite link de activare
2. Acces Telegram
invite privat sau auto-add
3. Subscription control
eliminare user dacă nu plătește
4. Webhook handling extins
invoice failed
subscription canceled
41. Concluzie finală

Aplicația este acum un sistem complet funcțional:

Payment → Identity → Validation → Access → Delivery

Acesta este fundamentul unei aplicații SaaS bazate pe abonament.


