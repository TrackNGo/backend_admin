import { Document } from "mongoose";

interface UserDetails extends Document {
    busNumber: string,
    nic: string;
    username: string;
    firstName: string;
    lastName: string;
    mobile: string;
    password: string;
    accType: string;
}

export default UserDetails;
