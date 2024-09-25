import express from 'express';
// controllers
import vendor from '../controllers/vendor.js';
import { check } from "express-validator";

const router = express.Router()

router
    .post('/register', 
        check('name')
        .notEmpty()
        .isLength({ max: 40 }),
        check("address")
        .notEmpty()
        .withMessage('please input an address'),
        vendor.create
    )
    .get('/get-in-range', vendor.findLocal)
export default router