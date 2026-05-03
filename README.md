<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=250&section=header&text=Axio-Manage&fontSize=90&fontAlignY=38&desc=Your%20Ultimate%20Personal%20Management%20Companion&descAlignY=51&descAlign=62" alt="header" />

  <br />

  <div>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </div>

  <h3 align="center">A robust, visually striking full-stack MERN application for organizing your digital life.</h3>
</div>

---

## 🌟 About the Project

**Axio-Manage** is a comprehensive personal management dashboard designed with a beautiful, minimalist, neo-brutalist aesthetic. It serves as your daily companion to track everything from expenses and habits to personal diary entries and to-do lists.

With its sleek interface powered by Tailwind CSS and Framer Motion, and a robust backend powered by Node.js and MongoDB, Axio-Manage delivers a blazing-fast, secure, and delightful user experience.

## ✨ Key Features

- 🔐 **Secure Authentication**: Traditional JWT-based login alongside seamless Google OAuth integration.
- 📝 **Personal Diary**: A private space to jot down your daily thoughts and reflections.
- ✅ **Task Management**: An intuitive to-do list to keep you productive and on track.
- 💰 **Expense Tracker**: Keep a close eye on your financial health, tracking both inflows and outflows with detailed charts.
- 📖 **Contact Book**: A centralized hub for your important personal and professional contacts.
- 🎯 **Habit Tracker**: Build and maintain healthy routines with visual streak tracking.
- 📅 **Attendance System**: Monitor attendance records with an easy-to-use interface.
- 💸 **Support & Payments**: Integrated with Razorpay for secure transactions and supporter tracking.
- 📊 **Beautiful Analytics**: Visual data representation using Recharts for your financial and habit data.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React & React Icons
- **Routing**: React Router DOM v7
- **Data Visualization**: Recharts
- **Notifications**: Sonner (Toast)

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT, bcryptjs, Google Auth Library
- **Payments**: Razorpay

## 📂 Project Structure

```text
axio-manage/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/          # Full-page components (Home, Diary, Expenses, etc.)
│   │   ├── context/        # React Context providers for global state
│   │   └── utils/          # Helper functions and protected route wrappers
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── package.json        # Frontend dependencies
│
└── server/                 # Backend Express Application
    ├── config/             # Database and environment configurations
    ├── controllers/        # Request handlers for routes
    ├── models/             # Mongoose database schemas
    ├── routes/             # API endpoint definitions
    ├── middlewares/        # Custom Express middlewares (Auth, etc.)
    └── package.json        # Backend dependencies
```

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (Local or Atlas)
- Razorpay Account (Optional, for payment features)
- Google Cloud Console Project (For Google OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Axio-Manage
   ```

2. **Setup the Server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   GOOGLE_CLIENT_ID=your_google_client_id
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

3. **Setup the Client**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run the Application**
   Open two terminals.
   
   Terminal 1 (Server):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Client):
   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <sub>Built with ❤️ for a more organized life.</sub>
</div>
