import axios from "axios"

interface AgentData {
    id:string;
    name:string;
    phoneNumber:string
}


export const AgentService = async({id,
    name,
    phoneNumber
}:AgentData)=>{
if(!name || ! phoneNumber){
    throw new Error("all fields are required")
}

try {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
  const { data } = await axios.post(
    "https://api.vapi.ai/call",
    {
      assistantId: process.env.VAPI_ASSISTANT_ID,
    phoneNumberId:
      process.env.VAPI_PHONE_NUMBER_ID,
      customer: {
         number: `+91${cleanedPhoneNumber}`,
        name,
      },
      metadata: {
        leadId: id,
        name,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      },
    }
  );
console.log("PHONE ID:", process.env.VAPI_PHONE_NUMBER_ID);
  console.log(data);

} catch (error: any) {
  console.log(
    JSON.stringify(error.response?.data, null, 2)
  );
}
}