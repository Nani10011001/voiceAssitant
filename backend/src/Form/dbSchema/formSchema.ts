import mongoose from "mongoose";


const formSchema = new mongoose.Schema({

    name:{
        type:String,
     required:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    }
})
export const FormdbSchema = mongoose.model("formshema",formSchema)

