
import React, { useRef, useState, type SyntheticEvent } from "react"
import landpageImage from "./assets/coffeDesign.webp"
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { User, Phone} from 'lucide-react';
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
    audio: true})
  setIsConv(true)
  let ws = new WebSocket("ws://localhost:8000/ws")
  ws.binaryType = "arraybuffer"
  const sessionId = sessionStorage.getItem("sessionId")
  if(!sessionId) return 
  let recorder = new MediaRecorder(stream)
  ws.onopen = ()=>{
    console.log("websocket is connted")
    ws.send(
      JSON.stringify({
        type:"start",
        sessionId
      })
    )
    recorder.start(250) //records in 250ms chunks
  }
  ws.onclose = () => {
    console.log("WebSocket Closed");
};
  ws.onerror = (e) => {
    console.log(e);
};
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
 ws.onmessage = async (event) => {

    if (typeof event.data === "string") {
        console.log(event.data);
        return;
    }

    const audioBlob = new Blob(
        [event.data],
        {
            type: "audio/mpeg"
        }
    );

    const url = URL.createObjectURL(audioBlob);

    const audio = new Audio(url);

    await audio.play();

    audio.onended = () => {
        URL.revokeObjectURL(url);
    };
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
Find Your <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent px-4 py-3" > Perfect Property</span>
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
            className='w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-200 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl hover:shadow-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30'
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
  <label htmlFor="" className="relative group">
    <span className="absolute  left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-400" >
      <User size={20} className=""/>
    </span>
      <input type="text" 

  value={info.name}
  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setInfo({

   ...info, name:e.target.value
  })}
            
className=' rounded-2xl border border-slate-200 bg-white/90 py-3 pl-12 pr-4 text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus-visible:ring-2 focus-visible:ring-pink-500/50' placeholder='Your Name'  />
  </label>

<label className="relative group">
  <span className="absolute text-slate-400 left-4 top-1/2 -translate-y-1/2 group-focus-within:text-pink-400">
<Phone className="" size={20}/>
  </span>
  <input
 type="text" 
 value={info.phoneNumber}
 onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setInfo({
  ...info, phoneNumber:e.target.value
 })}
  className=" rounded-2xl border border-slate-200 bg-white/90 py-3 pl-12 pr-4 text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus-visible:ring-2 focus-visible:ring-pink-500/50" placeholder="phoneNumber"
 />
</label>

</div>
<div className='flex flex-col gap-2'>
  {
    isLoading ?(<button 
  type="submit"
  className='w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-200 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl hover:shadow-pink-300 flex gap-2 justify-center cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500/30'> <span className="border-t-0 border-2 border-white p-3 py-1  animate-spin rounded-full "></span>  Consultationing... </button>):(<button 
  type="submit"
  className='w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-200 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl hover:shadow-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30'> Get Consultation </button>)
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
