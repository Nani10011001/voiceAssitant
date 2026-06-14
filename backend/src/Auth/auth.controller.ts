
import { success } from "zod";
import { LoginSchema } from "../Validation/ZodValidation.js";
import { Authservice } from "./login.js";
import {type Request,type Response } from "express";


export class AuthController{

    constructor(private Auth:Authservice){

    }

 loginServicesController(req:Request,res:Response){

try {
    const parseData = LoginSchema.safeParse(req.body)

if(!parseData.success){
    return res.status(400).json({
        success:false,
        message:"Validation failed"
    })
}

const {jwtToken} =  this.Auth.login(parseData.data)

const token = res.cookie("token",jwtToken,{
httpOnly:true,
secure:process.env.PRODUTIONDEV === "dev",
maxAge:7*60*60*1000

})
return res.status(200).json({
    success:true,
    messages:"login successfully"
})
} catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"error at the Login"
    })
}

}


}