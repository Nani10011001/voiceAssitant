import jwt from "jsonwebtoken"
import { email } from "zod";

interface LoginSchema {
email:string;
password:string

}

export class Authservice{

    login(userInfo:LoginSchema){
const {email,password} = userInfo
if(!email || ! password){


    throw new Error("all fields are required")


}
if(email !== process.env.ADMIN_EMAIL || password !== process.env.PASSWORD){


throw new Error("unAuthorized")
    }

    const jwtToken = jwt.sign({email},process.env.JWTSERECT!,{expiresIn:"7d"})
    
    return {
        jwtToken
    }
}

}