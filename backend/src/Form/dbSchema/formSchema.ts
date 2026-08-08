import mongoose, { Types,Schema } from "mongoose";
import { string } from "zod";
import { required } from "zod/mini";


interface formSchemaInterface {
    _id?: Types.ObjectId, 
    name:string,
    sessionId: string,
    phoneNumber: string
}

const formSchema = new mongoose.Schema<formSchemaInterface>({

    name:{
        type: Schema.Types.String,
     required:true
    },

    sessionId:{
type:Schema.Types.String,
required:true


    },
    phoneNumber:{
        type:Schema.Types.String,
        required:true,
        unique:true
    }
})
export const FormdbSchema = mongoose.model<formSchemaInterface>("formshema",formSchema)

