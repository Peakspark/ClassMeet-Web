import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import auth from "./middleware/auth.js";

dotenv.config();

const app = express();
connectDB();

app.use(helmet());


app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);


app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));


app.use(cookieParser());

app.get("/api/auth/me", auth, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});