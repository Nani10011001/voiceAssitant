
import React, { useRef, useState, type SyntheticEvent } from "react"
import landpageImage from "./assets/coffeDesign.webp"
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const App = () => {
interface infoSchema {
  name:string;
  phoneNumber:string
}

  const [info,setInfo] = useState<infoSchema>({
name:"",
phoneNumber:""

  })
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const [showSuccess,setShowSuccess] = useState<boolean>(false)
  const [isConv, setIsConv] = useState<boolean>(false)
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)



const startConversation = async ()=>{
try {


    let stream = await navigator.mediaDevices.getUserMedia({
    audio: true
  })
  setIsConv(true)
  let ws = new WebSocket("ws://localhost:8000/ws")
  const sessionId = sessionStorage.getItem("sessionId")
  if(!sessionId) return 
  let recorder = new MediaRecorder(stream)
  ws.onopen = ()=>{
    ws.send(
      JSON.stringify({
        type:"start",
        sessionId
      })
    )
    recorder.start(250) //records in 250ms chunks
  }
  wsRef.current = ws
  recorderRef.current = recorder;
  streamRef.current = stream
  recorder.ondataavailable = async (events) => {
    if(events.data.size > 0 && ws.readyState === WebSocket.OPEN)
    {
      console.log("Chunk:", events.data.size);
      const buffer = await events.data.arrayBuffer()
      ws.send(buffer)
    }
  }
  ws.onmessage = (event) => {
console.log(event.data)
};
  console.log(stream)
} catch (error) {
  console.error("error starConversation: ",error)
}
}
const stopConversation = async () =>{
  try {
    recorderRef.current?.stop(); // stop recording
   setIsConv(false)
    //stip microphone
    streamRef.current?.getTracks().forEach((track)=>{
 track.stop()
    })
    wsRef.current?.close(1000, "Conversation ended");
    // clear refs
    recorderRef.current = null;
    streamRef.current = null;
    wsRef.current = null
  } catch (error) {
    console.error("error at stopConversation: ",error)
  }
}
  const submitHandler = async(e:SyntheticEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const {name,phoneNumber} = info
    if(!name || !phoneNumber){
return toast.error("all fields are requried")
    }
    setIsLoading(true)

const {data} = await axios.post("http://localhost:4000/api/form/v1",info)
if(data.success){
  toast.success("data create info successfully")
  setInfo({
    name:"",
    phoneNumber:""
  })
  const seesionIdData = data.formInfo.formSessionId
 
   sessionStorage.setItem("sessionId",seesionIdData)


setIsLoading(false)
setShowSuccess(true)

}
  }
  return (
 
    <main className='h-screen w-full relative'>
      <ToastContainer/>
 <img src={landpageImage} alt="" className='w-full h-screen object-cover' />
    
 <section className='z-40 px-20 absolute inset-0 flex flex-col justify-center  items-start'>
 <div className='flex flex-col max-w-2xl '>
   <h1 className='text-3xl font-bold my-3 text-[#000] '>
Find Your <span className='text-pink-400'> Perfect Property</span>
  </h1>
  <p className='max-w-[60%] text-sm font-semibold text-slate-500'>Submit your details and our AI Real Estate
     Assistant will contact you to understand your property requirements.</p>
 </div>

  {
    showSuccess ? (
      <div className='flex flex-col gap-4 mt-3'>
        <p className='text-lg font-semibold text-slate-700'>Submission successful. Ready to start audio conversation.</p>
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={startConversation}
            className='bg-pink-400 px-4 py-2 cursor-pointer text-white font-semibold rounded-2xl shadow-2xs'
          >
            Start Conversation
          </button>
          {isConv && (
            <button
              type='button'
              onClick={stopConversation}
              className='bg-red-400 px-4 py-2 text-white font-semibold rounded-2xl shadow-2xs'
            >
              Stop Conversation
            </button>
          )}
        </div>
      </div>
    ) : (
      <form action="" onSubmit={submitHandler} className='flex flex-col gap-3 mt-3 '>

<div className='flex gap-3'>
  <input type="text" 
  value={info.name}
  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setInfo({

   ...info, name:e.target.value
  })}
className=' border-2 border-slate-400 rounded-2xl focus:outline-none placeholder:px-2 py-2 px-5' placeholder='Your Name'  />
<input
 type="text" 
 value={info.phoneNumber}
 onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setInfo({
  ...info, phoneNumber:e.target.value
 })}
className=' border-2 border-slate-400 rounded-2xl focus:outline-none placeholder:px-2 py-2 px-5' placeholder='Phone Number' />
</div>
<div className='flex flex-col gap-2'>
  {
    isLoading ?(<button 
  type="submit"
  className='bg-pink-400 px-4 py-2 cursor-not-allowed max-w-[50%] hover:scale-102  transition-all text-white font-semibold rounded-2xl shadow-2xs flex gap-2 shadow-slate-400'> <span className="border-t-0 border-2 border-white p-3 animate-spin rounded-full "></span>  Consultationing... </button>):(<button 
  type="submit"
  className='bg-pink-400 px-4 py-2 max-w-[40%] hover:scale-102 cursor-pointer transition-all text-white font-semibold rounded-2xl shadow-2xs shadow-slate-400'> Get Consultation </button>)
  }
  <div className='flex flex-col gap-2'>
    <p className='text-slate-500 text-sm font-bold'> 

✓ Free Consultation </p>
<p className='text-slate-500 text-sm font-bold' >
✓ No Spam Calls
</p>
<p className='text-slate-500 text-sm font-bold'>
  ✓ AI Assistant Available 24/7
</p>
  </div>
</div>

</form>
    )
  }

 </section>
    </main>
  )
}

export default App
