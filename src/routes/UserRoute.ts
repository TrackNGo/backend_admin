import express from "express"
import { createUser, getUser, getAllUsers, updateUser, deleteUser, } from "../controllers/UserController"

const router = express.Router()

// Create a new user
router.post("/createUser", createUser)

// Get all users
router.get("/getallUser", getAllUsers)

// Get a specific user by ID, NIC, or username
router.get("/getUser/:param", getUser)

// Update a specific user by ID, NIC, or username
router.put("/updateUser/:param", updateUser)

// Delete a specific user by ID, NIC, or username
router.delete("/deleteUser/:param", deleteUser)

export default router
