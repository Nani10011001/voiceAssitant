import { success } from "zod";
import { FormdbSchema } from "./dbSchema/formSchema.js";
import { randomUUID } from "crypto";
interface formInterface {
    name:string;
    phoneNumber:string
}

export class FormService{

    async formDataFun(formData:formInterface): Promise<{ formShema: any }> {
try {
    
        const {name,phoneNumber} = formData
        
        if(!name || ! phoneNumber){
            throw new Error("all fields are required")
        }
      const phoneNumberAleardyExist = await FormdbSchema.findOne({phoneNumber})
      if(phoneNumberAleardyExist){
        throw new Error("phone Number already exist ")
      }
  const sessionId = randomUUID()
  console.log(sessionId)
    const formShema = await FormdbSchema.create({
    name:name,
    sessionId:sessionId,
    phoneNumber:phoneNumber

    })
    
    return {formShema}
} catch (error) {
    console.log(error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Unknown error in FormService")
}


        
    }
}