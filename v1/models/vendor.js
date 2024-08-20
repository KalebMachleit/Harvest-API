import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';


const VendorProfileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: "Please create a name for your store",
            max: 40
        },
        location: {
            type: String,
            required: "Please set your location"
        },
        selling: {
            type: Array,
        },
        bio: {
            type: String,
            max: 350
        },
        emails: {
            type: Array,
            required: "Please connect an email."
        }
    }
)

VendorProfileSchema.pre("save", function (next) {
    const vendor = this;

    if (!vendor.isModified("location")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.location, salt, (err, hash) => {
            if (err) return next(err);

            user.location = hash;
            next();
        });
    });
});