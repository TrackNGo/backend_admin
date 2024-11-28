import mongoose, { Schema, model } from "mongoose"
import { BusData, TimeTable } from "../interfaces/TimeTable"

const busDataSchema = new Schema<BusData>(
    {
        busRouteNumber: {
            type: String,
            required: true,
            trim: true,
        },
        busType: {
            type: String,
            required: true,
            enum: ['Normal', 'Semi-Luxury', 'Luxury'],
            default: 'Normal',
        },
        price: {
            type: Number,
            required: true,
        },
        startTime: {
            type: String, // string in "HH:mm" format
            required: true,
            validate: {
                validator: function (value: string) {
                    // validating "HH:mm" format
                    return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(value)
                },
                message: (props: { value: any }) => `${props.value} is not a valid time format (HH:mm)`,
            },
        },
        endTime: {
            type: String, // string in "HH:mm" format
            required: true,
            validate: {
                validator: function (value: string) {
                    // validating "HH:mm" format
                    return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(value)
                },
                message: (props: { value: any }) => `${props.value} is not a valid time format (HH:mm)`,
            },
        },
    },
    { _id: false }
)

const timeTableSchema = new Schema<TimeTable>(
    {
        startLocation: {
            type: String,
            required: true,
            trim: true,
        },
        endLocation: {
            type: String,
            required: true,
            trim: true,
        },
        bus: {
            type: [busDataSchema],
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const TimeTableModel = model<TimeTable>('TimeTable', timeTableSchema)

export default TimeTableModel
