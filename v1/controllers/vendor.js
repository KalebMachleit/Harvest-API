import VendorModel from '../models/vendor.js'
import Vendor from '../models/vendor.js'

export default {
    create: async (req, res) => {
        const { name, address, selling, bio, emails} = req.body
        try {
            const newVendor = new Vendor({
                name,
                address,
                selling,
                bio,
                emails
            })
            const existingVendor = await Vendor.findOne({address})
            if (existingVendor) {
                return res.status(400).json({
                    status: "failed",
                    message: "A vendor with this address already exists, either log into your account or contact customer services"
                })
            }

            const savedVendor = newVendor.save()

            return res.status(200).json({
                status: 'success',
                savedVendor
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                status: "error",
                code: 500,
                data: [],
                message: "Internal Server Error",
            });
        }
    }
}