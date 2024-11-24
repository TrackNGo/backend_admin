import { Document } from "mongoose";

interface lostNfound extends Document {
    description: string;
    location: string;
    date: Date;
    busRoute: string; // Refers to the route where the item was lost/found
    contactDetails: string; // Contact info for follow-up
    status: "lost" | "found"; // Flag indicating whether the item is lost or found
}

export default lostNfound;
