import UrlShortner from "../models/UrlShortner.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


export const UserSignup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const newUser = new User({
            username,
            email,
            password
        });
        await newUser.save();

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// LOGIN
export const UserLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        // console.log(token)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });
        res.cookie("user_id", user._id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        })

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const UserLogout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    return res.status(200).json({ message: "Logged out successfully" });
};

export const Verifyuser = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ isAuth: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ isAuth: true, userId: decoded.id });
    } catch {
        res.status(401).json({ isAuth: false });
    }
}

export const GetUserUrls = async (req, res) => {
    const { id } = req.params; // This is the user_id

    try {
        if (!id) {
            return res.status(400).json({ message: "User Id is required" });
        }

        // Find all short URLs for the user, sorted from newest to oldest
        const urls = await UrlShortner.find({ user_id: id }).sort({ createdAt: -1 }); // -1 = descending, 1 = ascending

        if (!urls || urls.length === 0) {
            return res.status(404).json({ message: "No URLs found for this user", data: [] });
        }

        return res.status(200).json({
            message: "URLs fetched successfully",
            count: urls.length,
            data: urls
        });

    } catch (error) {
        console.error("Error fetching user URLs:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
