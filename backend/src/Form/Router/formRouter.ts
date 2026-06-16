import express from "express"
import { FormService } from "../form.js"
import { FormControllerService } from "../controller/Formcontroller.js"

const FormRouter = express.Router()
 const formServiceData = new FormService()
const formControllerData= new FormControllerService(formServiceData)

FormRouter.post("/form/v1",formControllerData.formController.bind(formControllerData))

export default FormRouter