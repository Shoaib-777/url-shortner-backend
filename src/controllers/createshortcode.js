import jwt from "jsonwebtoken";
import UrlShortner from "../models/UrlShortner.js";

export const CreateShortCode = async (req, res) => {
    const { OrgUrl: original_url, ShortCode: short_code } = req.body;

    try {
        // 1️⃣ Get token from cookie (optional)
        const token = req.cookies?.token;
        let user_id = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user_id = decoded.id || null;
            } catch (err) {
                // Invalid token, just continue without user_id
                user_id = null;
            }
        }

        // 2️⃣ Validate inputs
        if (!original_url || !short_code) {
            return res.status(400).json({
                message: "original_url and short_code are required"
            });
        }

        // 3️⃣ Check if short_code already exists
        const existing = await UrlShortner.findOne({ short_code });
        if (existing) {
            return res.status(400).json({ message: "short_code already exists" });
        }

        // 4️⃣ Save to DB with or without user reference
        const newShort = new UrlShortner({
            original_url,
            short_code,
            visits: 0,
            user_id // will be null if no valid token
        });

        await newShort.save();

        return res.status(201).json({
            message: "Short code created successfully",
            data: newShort
        });

    } catch (error) {
        console.error("Error creating short code:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
