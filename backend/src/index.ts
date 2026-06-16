import "./Config/ConfigEnv.js"

import express from "express"
import cors from "cors"
import { dbconnection } from "./Db/dbconnection.js"
import authrouter from "./Auth/authRouter.js"
import FormRouter from "./Form/Router/formRouter.js"

const app = express()
app.use(
    cors()
)
app.use(express.json())
app.use("/api",authrouter)
app.use("/api",FormRouter)
const PORT = process.env.PORT || 4000

const serverStart = ()=>{

    try {
        app.listen(PORT,()=>console.log(`server is running http://localhost:${PORT}`))
      dbconnection()

    } catch (error) {

        console.log("error at running the ",error)
        process.exit(1)
    }
}
serverStart()