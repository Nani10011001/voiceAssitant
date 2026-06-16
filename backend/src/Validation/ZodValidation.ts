import {email, number, string, z} from "zod"

export const LoginSchema = z.object(
    {
        email: z.email(),
        password: z.string().min(6)
    
    }
).strict()

export const FormSchemaValidate = z.object({
    name:string(),
    phoneNumber:string()
}).strict()