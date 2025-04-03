const mongoose = require('mongoose');

const BusLocationSchema = new mongoose.Schema({

    busNumber: {
        type : String,
        required: true
    },
    latitude: {
        type : Number,
        default: 0
    },
    longitude: {
        type : Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}); 


const BusLocation = mongoose.model('buslocation', BusLocationSchema);

export default BusLocation