import axios from "axios"

interface AgentData {
    name:string,
    phoneNumber:string
}


export const AgentService = async({
    name,
    phoneNumber
}:AgentData)=>{
if(!name || ! phoneNumber){
    throw new Error("all fields are required")
}

const {data} =  await axios.post("")
console.log(data)
}