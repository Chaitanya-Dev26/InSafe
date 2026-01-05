# 🛡️ InSafe Digital Shield

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)

**InSafe Digital Shield** is a state-of-the-art safety and emergency response platform designed to provide immediate assistance and peace of mind. Whether it's a medical emergency, a lost item, or a personal safety threat, InSafe provides the tools to alert the right people at the right time.

---

## 🚀 Key Features

*   **🚨 One-Tap SOS:** Instantly notify emergency contacts and authorities with your real-time location.
*   **📍 Real-Time Tracking:** Live location sharing with trusted contacts during emergencies.
*   **🏥 Medical Help:** Quick access to medical assistance and emergency services.
*   **🔍 Lost & Found:** A dedicated portal for reporting and finding lost items within the community.
*   **👥 Safety Network:** Manage your emergency contacts and groups easily.
*   **🛡️ Admin Dashboard:** Comprehensive monitoring and management for system administrators.
*   **🎨 Premium UI/UX:** Clean, modern, and intuitive interface built with Shadcn/UI and Tailwind CSS.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn/UI
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router Dom
- **Icons:** Lucide React
- **Animations:** Framer Motion / Tailwind Animate

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** Firebase Auth (Google Sign-In)
- **API Styling:** RESTful

### Tools & Deployment
- **Bundler:** Vite
- **Package Manager:** NPM / Bun
- **Real-time Engine:** Firebase Realtime Database

---

## 📂 Project Structure

```text
.
├── server/                 # Express backend
│   ├── config/             # Database & other configurations
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API entry points
│   └── index.ts            # Server entry point
├── src/                    # React frontend
│   ├── components/         # Reusable UI components (Shadcn/UI)
│   ├── firebase/           # Firebase configuration & helpers
│   ├── pages/              # Main application views/pages
│   ├── lib/                # Utility functions & shared logic
│   ├── App.tsx             # Main App component & Routes
│   └── main.tsx            # Frontend entry point
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Firebase account](https://console.firebase.google.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourUsername/insafe-digital-shield.git
    cd insafe-digital-shield
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    PORT=5001
    # Firebase config (client side)
    VITE_FIREBASE_API_KEY=your_api_key
    ...
    ```

### Running the Project

InSafe uses a concurrent setup to run both the frontend and backend with a single command.

- **Full Project (Frontend + Backend):**
  ```bash
  npm run dev:full
  ```

- **Frontend Only:**
  ```bash
  npm run dev
  ```

- **Backend Only:**
  ```bash
  npm run server
  ```

---

## 🤝 Contributing

We welcome contributions! If you're new to the project, here's how you can help:
1.  **Fork** the project.
2.  **Create** your feature branch (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  **Open** a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Made with ❤️ for a safer community.*
