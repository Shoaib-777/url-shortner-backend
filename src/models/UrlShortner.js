import mongoose, { Schema } from 'mongoose'

const UrlShortnerSchema = new Schema({
    original_url: { type: String, required: true },
    short_code: { type: String, required: true, unique: true },
    visits: { type: Number, default: 0 },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })


const UrlShortner = mongoose.models.UrlShortner || mongoose.model("UrlShortner", UrlShortnerSchema)

export default UrlShortner