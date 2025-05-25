# Bill Generation System

A full-stack web application for managing housing society bills, built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## 🚀 Features

- House registration and listing
- Bill management (create, edit, delete, download as PDF)
- Fine management
- Dashboard with statistics
- PDF bill generation with payment history

---

## 🖥️ Prerequisites

- [Node.js & npm](https://nodejs.org/) (v16 or higher recommended)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommended, but any editor will work)
- [MongoDB](https://www.mongodb.com/) (local or cloud, e.g. MongoDB Atlas)

---

## 📦 How to Clone and Run the Project

### 1. **Clone the Repository**

Open your terminal (or VS Code terminal) and run:

```bash
git clone https://github.com/aliahmad135/bill-generation-react.git
cd bill-generation-react
```

### 2. **Install Frontend Dependencies**

```bash
npm install
```

### 3. **Install Backend Dependencies**

```bash
cd server
npm install
cd ..
```

### 4. **Set Up Environment Variables**

- Go to the `server` folder.
- Create a file named `.env` (if it doesn't exist).
- Add your MongoDB connection string, for example:
  ```env
  MONGODB_URI=mongodb://localhost:27017/bill-generation
  PORT=5000
  ```
- If using MongoDB Atlas, use your provided connection string.

### 5. **Start the Backend Server**

```bash
cd server
npm run dev
```

- The backend will run on [http://localhost:5000](http://localhost:5000)

### 6. **Start the Frontend (React) App**

Open a new terminal (or split terminal in VS Code):

```bash
cd bill-generation-react # if not already in the root
npm start
```

- The frontend will run on [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Common Commands

- **Install dependencies:** `npm install` (in both root and `server`)
- **Start backend:** `cd server && npm run dev`
- **Start frontend:** `npm start` (from project root)
- **Build frontend for production:** `npm run build`

---

## 🐞 Troubleshooting

- **Port already in use?**
  - Change the `PORT` in `.env` or stop the process using that port.
- **MongoDB connection error?**
  - Make sure MongoDB is running and your connection string is correct.
- **CORS issues?**
  - The backend is set up for local development. If deploying, update CORS settings in `server/index.js`.
- **Missing .env?**
  - Create one in the `server` folder as shown above.

---

## 📄 Project Structure

```
bill-generation-react/
├── src/           # React frontend
│   ├── pages/
│   ├── components/
│   ├── api/
│   └── ...
├── server/        # Node.js/Express backend
│   ├── models/
│   ├── routes/
│   └── ...
├── package.json   # Frontend dependencies
├── server/package.json # Backend dependencies
└── README.md
```

---

## 👤 Author

- [aliahmad135](https://github.com/aliahmad135)

---

## 📬 Need Help?

- Open an issue on the [GitHub repo](https://github.com/aliahmad135/bill-generation-react)
- Or contact the author via GitHub

---

**Happy coding!** 🚀
