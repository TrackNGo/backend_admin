import express from "express"
import { createUser, getUser, getAllUsers, updateUser, deleteUser, getUserByBusNumber, changeConductorPassword, changeAdminPassword } from "../controllers/UserController"

const router = express.Router()

// Create a new user
router.post("/create", createUser)

// Get all users
router.get("/users", getAllUsers)

// Get a specific user by ID, NIC, or username
router.get("/user/:param", getUser)

// Get a specific user by busNumber
router.get("/user-by-busnumber/:busNumber", getUserByBusNumber)

// Update a specific user by ID, NIC, or username
router.put("/update/:param", updateUser)

// Delete a specific user by ID, NIC, or username
router.delete("/delete/:param", deleteUser)

//change conductor password
router.put("/change-password", changeConductorPassword)

//change admin password 
router.put("/change-admin-password", changeAdminPassword)

export default router
