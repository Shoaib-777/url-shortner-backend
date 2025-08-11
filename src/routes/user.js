import express from 'express'
import { GetUserUrls, UserLogin, UserLogout, UserSignup, Verifyuser } from '../controllers/user.js'

const router = express.Router()

router.post("/signup",UserSignup)
router.post("/login",UserLogin)
router.delete("/logout",UserLogout)
router.get("/verify",Verifyuser)
router.get("/:id",GetUserUrls)


export default router