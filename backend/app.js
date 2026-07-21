require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const couponRoutes = require("./src/routes/couponRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const userRoutes = require("./src/routes/userRoutes");
const reviewRoutes = require("./src/routes/reviewRouts");
const aiRoutes = require("./src/modules/ai/ai.routes");
const errorMiddleware = require("./src/middleware/errorMiddleware");

// Ensure required environment variables exist
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is not defined.");
  process.exit(1);
}

const app = express();

// Trust proxy for rate-limiting behind reverse proxies (Render, Cloudflare, Heroku)
app.set("trust proxy", 1);

// Security Headers
app.use(helmet());

// NoSQL Injection Prevention (Express 5 compatible in-place sanitization)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// CORS configuration
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://luxemarket-three.vercel.app",
  "https://luxemarkets.netlify.app",
];

const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim().replace(/\/$/, ""))
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins.map((url) => url.replace(/\/$/, "")), ...envOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      const cleanOrigin = origin ? origin.replace(/\/$/, "") : null;
      if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Access denied."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Payload size limiting (mitigate DoS)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login/register attempts from this IP, please try again after 15 minutes.",
  },
});

app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Routes
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api", reviewRoutes);
app.use("/api/ai", aiRoutes);

// Global Error Handler
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
  });
