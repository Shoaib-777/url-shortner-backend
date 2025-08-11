import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import CreateShortCodeRoute from './routes/createshortcode.js';
import UserRoute from './routes/user.js';
import ConnectDB from './DB/ConnectDB.js';
import cookieParser from 'cookie-parser';
import UrlShortner from './models/UrlShortner.js';

dotenv.config();


const PORT = process.env.PORT || 8001;
const app = express();

app.use(express.json());

// ✅ Allow both local dev & production
app.use(cors({
    origin: "https://url-short-ner.vercel.app",
    credentials: true
}));

app.use(cookieParser());

// API routes
app.use("/api/shorten", CreateShortCodeRoute);
app.use("/api/user", UserRoute);

// Handle redirects
app.get("/:shortcode", async (req, res) => {
    const { shortcode } = req.params;
    try {
        const record = await UrlShortner.findOne({ short_code: shortcode });
        if (!record) {
            return res.status(404).json({ message: "short_code not found" });
        }
        record.visits += 1;
        await record.save();
        return res.redirect(record.original_url);
    } catch (error) {
        console.error("Error redirecting short code:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT, async () => {
    console.log(`App is running on PORT ${PORT}`);
    await ConnectDB();
});
