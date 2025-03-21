import express from "express"
import { createUser, getUser, getAllUsers, updateUser, deleteUser, } from "../controllers/UserController"

const router = express.Router()

// Create a new user
router.post("/create", createUser)

// Get all users
router.get("/users", getAllUsers)

// Get a specific user by ID, NIC, or username
router.get("/user/:param", getUser)

// Update a specific user by ID, NIC, or username
router.put("/update/:param", updateUser)

// Delete a specific user by ID, NIC, or username
router.delete("/delete/:param", deleteUser)

export default router
