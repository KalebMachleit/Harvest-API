import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            require: true,
        },
        message: {
            type: String,
            require: true,
            max: 360
        }
    },
    {timestamps: true}
)

export default mongoose.model("message", ChatMessageSchema)