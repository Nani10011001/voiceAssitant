import mongoose from "mongoose";
import { string } from "zod";
import { required } from "zod/mini";


const formSchema = new mongoose.Schema({

    name:{
        type:String,
     required:true
    },
    sessionId:{
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

