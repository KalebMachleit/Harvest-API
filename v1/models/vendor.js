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
        ownerEmail: {
            type: String
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
        let R = 3958.8
        const lat = latitude * Math.PI / 180
        const long = longitude * Math.PI / 180
        let latRange = [(lat + (d / R)) * (180/Math.PI), (lat - (d / R)) * (180/Math.PI)]
        let longRange = [(2 * (Math.asin((1/Math.cos(lat)) * Math.sin(d / (2 * R)))) + long) * (180/Math.PI), (2 * (Math.asin((-1/Math.cos(lat)) * Math.sin(d / (2 * R)))) + long) * (180/Math.PI)]
        // Using Haversine formula to calculate search range
        let results = await this.find({
            latitude: { $gte: latRange[1], $lt: latRange[0] },
            longitude: { $gte: longRange[1], $lt: longRange[0] }
        })
        return results
    } catch (err) {
        throw err
    }
}

VendorProfileSchema.statics.getById = async function (id) {
    const vendor = this
    try {
        const response = await this.findOne({_id: id})
        return response
    } catch (err) {
        throw err
    }
}

VendorProfileSchema.pre("save", async function (next) {
    const vendor = this;

    if (!vendor.latitude && !vendor.longitude) {
        //break address into parts
        const spl = vendor.address.split("_")
        //combine address back together in url friendly format
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
                    vendor.latitude = coords.y
                    vendor.longitude = coords.x
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