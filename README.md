# NxT DataBase 🚀

A modern, full-stack internal management web application built for seamless tracking of Discord service sales and game account sales. Designed with a vibrant neon (cyan/magenta) aesthetic and a completely custom vanilla frontend, this system features dynamic profit calculations, secure access, data analytics, and integrated Discord webhook logging.

## ✨ Features

- **Secure Authentication**: Protected admin dashboard using JSON Web Tokens (JWT).
- **Dual Sales Tracking**: Dedicated management tables for both **Discord services** and **Game accounts**.
- **Automated Profit Calculation**: Dynamic, real-time calculation of profit (`Sell Price` - `Dealer Cost`).
- **File Uploads (Multer)**: Easily attach and view transaction proof screenshots for both sale types.
- **Full CRUD Capabilities**: Add, view, edit (quick-edit modal), and delete sales effortlessly.
- **Discord Webhook Integration**: Automatically logs new sales to a specified Discord channel.
- **Analytics Dashboard**: Interactive charts (powered by Chart.js) mapping revenue vs profit, top dealers, and payment method distributions.
- **Password Protection**: Built-in "peek" modal to hide sensitive game credentials by default.
- **Modern UI/UX**: Responsive glassmorphism design with a neo-cyan and magenta color theme, sidebar navigation, and smooth transitions.

## 🛠️ Technology Stack

**Frontend:**
- HTML5
- CSS3 (Custom responsive styling, no CSS frameworks)
- Vanilla JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) for data visualization

**Backend:**
- Node.js
- Express.js
- [MongoDB](https://www.mongodb.com/) & Mongoose (Database & ODM)
- Multer (Multipart/form-data handling for image uploads)
- JSON Web Token (JWT) + bcryptjs (Authentication)

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas cluster)

### 1. Clone the repository
```bash
git clone https://github.com/karthixn/nxt-database.git
cd nxt-database
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root backend directory (`backend/.env`) and configure the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nxt_database
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
ADMIN_PASSWORD=nxt123
JWT_SECRET=your_super_secret_jwt_key
```
*(Note: Replace the Webhook URL and Secret strings with your actual sensitive data).*

### 4. Run the Application
Start the Node.js Express server:
```bash
npm start
# or 
node backend/server.js
```

### 5. Access the Platform
Open your browser and navigate to:
`http://localhost:5000`
- **Default password:** `nxt123` (or whatever you set your `ADMIN_PASSWORD` to in the `.env` file).

## 📂 Project Structure
```text
nxt-database/
├── backend/
│   ├── controllers/      # Route controllers (gameController, discordController)
│   ├── models/           # Mongoose schemas (GameSale, DiscordSale)
│   ├── routes/           # Express API routes
│   ├── uploads/          # Directory for Multer image uploads
│   ├── database.js       # MongoDB connection setup
│   ├── server.js         # Entry point for the Express app
│   └── webhookLogger.js  # Discord Webhook utility
├── frontend/
│   ├── css/              # Custom styling (style.css)
│   ├── js/               # Vanilla JS modules (api.js, auth.js, dashboard.js, etc.)
│   ├── img/              # Branding assets (logo.png)
│   ├── index.html        # Main Overview Dashboard
│   ├── discord-dashboard.html 
│   ├── games-dashboard.html
│   ├── add-discord-sale.html
│   ├── add-game-sale.html
│   ├── analytics.html    # Data charts
│   └── login.html        # Secure gateway
├── package.json
└── README.md
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/karthixn/nxt-database/issues).

## 📝 License
This project is licensed under the [MIT License](LICENSE).
