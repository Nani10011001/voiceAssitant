
import type { NextFunction,Request,Response} from "express"
import jwt,{type JwtPayload} from "jsonwebtoken"

declare global {
    namespace Express{
        interface Request{
            userId?: string
        }
    }
}

export const authMiddleware = (req: Request,res: Response,next:NextFunction)=>{
    try {
        const token = req.headers.cookie
    if(!token){
        return res.status(404).json({
            success:false,
            message:"verification token expired"
        })
    }

    const decode = jwt.verify(token,process.env.JWTSERECT!) as JwtPayload
    console.log("user json webtoken: ",req.userId)
  req.userId = decode.userId
next()
    } catch (error) {
        console.error("error at middleware: ",error)
        res.status(500).json({
            success:false,
            message:"server error "
        })
    }
}