import express from 'express'
import { CreateShortCode } from '../controllers/createshortcode.js'

const router = express.Router()

router.post("/",CreateShortCode)


export default router