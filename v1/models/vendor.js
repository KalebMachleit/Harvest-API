import mongoose, { Mongoose, SchemaType } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';
import axios from "axios";
import bcrypt from "bcrypt"

const VendorProfileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: "Please create a name for your store",
            max: 40
        },
        address: {
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
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    }
)

VendorProfileSchema.statics.getNearbyVendors = async function (d, latitude, longitude) {
    try {
        const lat = latitude * Math.PI / 180
        const long = longitude * Math.PI / 180
        //calculate for search paramaters given range and current location using the Havsersine Formula
        let latRange = [(lat + (d / R)), (lat - (d / R))]
        let longRange = [(2 * (Math.asin((1 / Math.cos(lat)) * Math.sin(d / (2 * R)))) + long), (2 * (Math.asin((-1 / Math.cos(lat)) * Math.sin(d / (2 * R)))) + long)]
        let results = await this.find({
            latitude: { $gte: latRange[0], $lt: latRange[1] },
            longitude: { $gte: longRange[0], $lt: longRange[1] }
        })
        return results
    } catch (err) {
        throw err
    }
}

VendorProfileSchema.pre("save", async function (next) {
    const vendor = this;

    if (!vendor.latitude && !vendor.longitude) {
        //break address into parts
        const spl = vendor.address.split("_")
        //combine address back together in url friendly formal
        let thing = ''
        for (let i = 0; i < spl.length; i++) {
            thing += spl[i]
            if (i != spl.length - 1) {
                thing += '+'
            }
        }
        try {
            // console.log(`https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=` + thing + '&benchmark=4&format=json')
            const response = await axios.get(`https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=` + thing + '&benchmark=4&format=json')
                .then((response) => {
                    const coords = response.data.result.addressMatches[0].coordinates
                    vendor.latitude = coords.x
                    vendor.longitude = coords.y
                })
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    if (!vendor.isModified("address")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(vendor.address, salt, (err, hash) => {
            if (err) return next(err);

            vendor.address = hash;
            next();
        });
    });
});

export default mongoose.model("Vendor", VendorProfileSchema)