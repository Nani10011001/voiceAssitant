import { useRef, useState } from "react";
import { Mic, MicOff, Sparkles, X } from "lucide-react";

import { motion } from "framer-motion";
import { type Variants } from "framer-motion";
type Props = {
  onClose: () => void;
};
const micSpeakerAnimation: Variants = {

  offsrceen:{
    scale:0.70
  },
  onscreen:{
    scale:1.03,
    transition:{
      duration:0.8,
      ease:"easeInOut",
  /*     animationIterationCount: */
    }
  }
}
const MicSpeaker = ({ onClose }: Props) => {
  const [listening, setListening] = useState(false);
  const wsRef = useRef<WebSocket | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
 const MediaRecorderRef = useRef<MediaRecorder | null>(null)
  
  const startConversation = async() =>{
    if(wsRef.current?.readyState === WebSocket.OPEN){
      console.log("websocket is aleardy connected")
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio:{
          echoCancellation:true,
          noiseSuppression:true,
          
        }
      })
      streamRef.current = stream
      console.log("stream data: ", stream)
      const ws = new WebSocket("ws://localhost:8000/ws")
      wsRef.current = ws
      // frist i want make the type is array buffer things
      ws.binaryType = "arraybuffer"

      setListening(true)
      ws.onopen = (

      ) =>{
        const recorder = new MediaRecorder(stream,{
          mimeType:"audio/webm"
        })
        MediaRecorderRef.current = recorder
        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN){
            const arraybuffer = await event.data.arrayBuffer()
            console.log(arraybuffer)
            ws.send(arraybuffer)
          }
        }
        recorder.start(500) // every 250 ms
        
        console.log("connected websocket")
      }

      
      ws.onmessage = async (event) =>{
  console.log("recieving audio of it: ",event.data)

  const audioBlob = new Blob(
    [event.data],
    {
      type: "audio/mpeg"
    }
  );


  console.log(
    "audio size:",
    audioBlob.size
  );


  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  await audio.play();
      }
      ws.onerror = (error)=>{
         console.log("websocket error: ",error)
      }
      ws.onclose = () =>{
        console.log("closed the connections")
      }
    } catch (error) {
      console.log("error at startConversation: ", error)
    }
  }
  const stopConversation = () =>{
    MediaRecorderRef.current?.stop()
    wsRef.current?.close()
    streamRef.current?.getTracks().forEach(track => track.stop())
    MediaRecorderRef.current = null
    wsRef.current = null
    streamRef.current = null
    setListening(false)
    console.log("button stoped")
  }
 
  return (
    <div className="absolute z-120 top-[20%] shadow-sm bg-white shadow-black/20  left-[40%] w-[400px] h-[400px] rounded-2xl ">

      <div className="absolute right-4 top-2.5">
        <button 
        onClick={onClose}
        className="rounded-full px-2 py-2 cursor-pointer shadow-sm shadow-black/20 ">
          <X size={20} className="  "/>
        </button>
      </div>
<div className="flex flex-col gap-7">
<div className=" flex justify-center max-h-fit  ">
  <p className="flex gap-2 items-center mt-6" > 
    <Sparkles size={10} className="text-pink-400"/><span className="font-semibold text-sm">voice Assitance</span>
</p>
</div>
<div className="w-full  flex justify-center mt-15 ">
  {
    listening ? (
      <motion.p 
 initial="offscreen"
 whileInView="onscreen"
 variants={micSpeakerAnimation}

  className="px-7 py-7 text-white rounded-full   bg-red-500 transform ">
    <Mic size={30} /></motion.p>

    ):(
 <motion.p 
 initial="offscreen"
 whileInView="onscreen"
 variants={micSpeakerAnimation}

  className="px-7 py-7 text-white rounded-full   bg-slate-800 transform ">
    <Mic size={30} /></motion.p>
    )
  }
 
</div>
{
 <div className="flex justify-center">
  {
     listening ? <p>Listening</p>:<p>Ready</p>
  }
 </div>
}
<div className="flex gap-7 justify-center ">
  <motion.button

  whileHover={{
    y: -3,
    scale:1.03,
 

  }}
  whileTap={{

    scale:0.98

  }}
  onClick={startConversation} className="bg-pink-500 px-10 py-2 rounded-2xl cursor-pointer  text-white font-medium">Start</motion.button>
  <motion.button 
  whileHover={{y:-3,
    scale:1.03
  }}
  whileTap={{scale:0.98}}
  onClick={stopConversation} className="bg-red-500 rounded-2xl px-10 py-2 cursor-pointer  text-white font-medium">Stop</motion.button>
</div>
</div>
    </div>
  );
};

export default MicSpeaker;