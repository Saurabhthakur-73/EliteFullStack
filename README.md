# EliteFinish — MERN Starter (v0.1)

Ye ek MERN stack (MongoDB, Express, React, Node) starter project hai jo painter-hiring platform ke liye base structure deta hai.

## Kya-kya bana hai (~15% of full project)

- ✅ User auth (register/login) — customer & painter roles, JWT-based
- ✅ Painter model + listing API + city/skill filter
- ✅ Product catalog model + API
- ✅ Booking system (create booking, view my bookings, update status)
- ✅ Frontend connected to backend: Home, Login, Signup, Painters listing, Booking form
- ⏳ AI 2D/3D scan + BOQ generation — NOT included (separate microservice, next phase)
- ⏳ Payments, notifications, admin dashboard — NOT included yet

## Folder Structure

```
EliteFinish/
├── backend/     → Node + Express + MongoDB API
└── frontend/    → React + Vite app

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
```

- Copy `.env.example` to `.env` and fill in your values:
  ```
  PORT=5000
  MONGO_URI=mongodb://127.0.0.1:27017/elitefinish
  JWT_SECRET=your_secret_here
  ```
- Make sure MongoDB is running locally (or use MongoDB Atlas — just paste the connection string into `MONGO_URI`).
- Start the server:
  ```bash
  npm run dev
  ```
  Server runs on `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` and is already configured to call the backend at `http://localhost:5000/api`.

## Testing the flow

1. Start backend (`npm run dev` in `/backend`)
2. Start frontend (`npm run dev` in `/frontend`)
3. Open `http://localhost:5173`
4. Sign up as a customer or painter
5. If you signed up as a painter, create a painter profile via API (`POST /api/painters`) — a dedicated "Create Painter Profile" UI page isn't built yet, this is a next step
6. Browse `/painters`, click "Book Now" to test the booking flow

## API Endpoints (quick reference)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/profile` | Yes | Get logged-in user |
| GET | `/api/painters?city=&skill=` | No | List painters |
| POST | `/api/painters` | Yes | Create painter profile |
| GET | `/api/painters/:id` | No | Get single painter |
| GET | `/api/products?category=` | No | List products |
| POST | `/api/products` | Yes | Add product |
| POST | `/api/bookings` | Yes | Create booking |
| GET | `/api/bookings/my` | Yes | My bookings |
| PUT | `/api/bookings/:id/status` | Yes | Update booking status |

## Next Steps (remaining ~85%)

- Product catalog UI page
- Painter profile creation UI
- Painter dashboard (view/accept bookings)
- Admin panel
- Payment integration (Razorpay/Stripe)
- AI 2D/3D scan + BOQ generation (separate microservice)
- Reviews & ratings UI
- Notifications (SMS/WhatsApp/push)
