import express from "express"
import { AuthController } from "./auth.controller.js"
import { Authservice } from "./login.js"

const authrouter = express.Router()
const authservice = new Authservice()
const authcontroller  = new AuthController(authservice)

authrouter.post("/auth/login",authcontroller.loginServicesController.bind(authcontroller))

export default authrouter