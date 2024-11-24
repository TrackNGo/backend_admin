import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcrypt from 'bcryptjs';

// Check mongoDB id
const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

// Filter object
const generateFilter = (param: string) => {
    if (isValidObjectId(param)) {
        return { _id: param }; // Filter by MongoDB ObjectID
    } else {
        return { $or: [{ nic: param }, { username: param }] }; // NIC or Username
    }
};
