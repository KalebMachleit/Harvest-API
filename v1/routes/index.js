import Auth from './auth.js';
import { Verify, VerifyRole } from "../middleware/verify.js";
import ChatRoomRouter from './chatroom.js'
import VendorRouter from './vendor.js'

const Router = (server) => {
    // home route with the get method and a handler
    server.get("/v1", (req, res) => {
        try {
            res.status(200).json({
                status: "success",
                data: [],
                message: "Welcome to our API homepage!",
            });
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    })
    server.use('/v1/auth', Auth);

    server.use('/v1/user/room', Verify, ChatRoomRouter)
    
    server.use('/v1/user/vendor', Verify, VendorRouter)

    server.get("/v1/user", Verify, (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Welcome to the your Dashboard!",
            email: req.user.email
        });
    });

    server.get("/v1/admin", Verify, VerifyRole, (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Welcome to the Admin portal!",
        });
    });
};
export default Router;