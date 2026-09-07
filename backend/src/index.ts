import "./Config/ConfigEnv.js"

import express from "express"
import cors from "cors"
import mongodbSerive from "./Db/dbconnection.js"
import authrouter from "./Auth/authRouter.js"
import FormRouter from "./Form/Router/formRouter.js"
import { DbManager } from "./Db/dbmanager.js"

const app = express()
app.use(
    cors()
)
app.use(express.json())
app.use("/api",authrouter)
app.use("/api",FormRouter)
const PORT = process.env.PORT || 4000

const mongodb = new mongodbSerive()
const dbManager = new DbManager({
    mongodb
})
const serverStart = async()=>{

    try {
         await dbManager.connect()    
        app.listen(PORT,()=>console.log(`server is running http://localhost:${PORT}`))
       

    } catch (error) {

        console.log("error at running the ",error)
        process.exit(1)
    }
}
serverStart()