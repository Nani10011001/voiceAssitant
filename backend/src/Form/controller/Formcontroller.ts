import { type Request,type Response } from "express";
import { FormSchemaValidate } from "../../Validation/ZodValidation.js";
import type { FormService } from "../form.js";
import { AgentService } from "../../Agent/AgentService.js";
export class FormControllerService {
   
   constructor(private FormServeData: FormService){


   }

    async formController(req:Request,res:Response){
       

        
        try {
       
            const parseData = FormSchemaValidate.safeParse(req.body)
            if(!parseData.success){

                return res.status(400).json({
                    success:false,
                    message:"Validation error",
                    errors: parseData.error.format()
                })
            }
            const {formShema} = await this.FormServeData.formDataFun(parseData.data)
            
            return res.status(200).json({
                success:true,
                message:"form is created successfully",
                formInfo:{
                    formDetails:formShema
                }
            })

        } catch (error) {
            console.log(error)
            const message = error instanceof Error ? error.message : "form server error"
            return res.status(500).json({
      success:false,
      message
            })
        }
    }

}