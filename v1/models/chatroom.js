import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
    {
        customer: {
            type: String,
            require: true
        },
        vendor: {
            type: String,
            require: true
        },
    }
)