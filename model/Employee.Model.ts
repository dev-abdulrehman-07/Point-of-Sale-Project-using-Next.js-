import mongoose, { InferSchemaType } from "mongoose";

const employeeSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    },

    password : {
        type : String,
        default : "123456789",
    },

    salary :{
        type : Number,
        required : true
    },
    status :{
        type : String,
    }
},{
    timestamps : true ,
}
)

export type iEmployee = InferSchemaType<typeof employeeSchema>

export const Employee = mongoose.models.Employee || mongoose.model("Employee",employeeSchema);