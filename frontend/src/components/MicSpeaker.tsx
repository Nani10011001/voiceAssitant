import { useRef, useState } from "react";
import { Mic, MicOff, Sparkles, X } from "lucide-react";
// WebSocket is available in the browser environment; remove Node import

type Props = {
  onClose: () => void;
};

const MicSpeaker = ({ onClose }: Props) => {
  const [listening, setListening] = useState(false);

  
  const startConversation = async() =>{
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio:{
          echoCancellation:true,
          noiseSuppression:true,
          
        }
      })
      console.log("stream data: ", stream)
      const ws = new WebSocket("ws://localhost:8000/ws")
      setListening(true)
      ws.onopen = (

      ) =>{
        console.log("connected websocket")
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
  <p className="px-7 py-7 text-white rounded-full border-4 border-red-500  bg-red-500 transform "><Mic size={50} /></p>
</div>
{
 <div className="flex justify-center">
  {
     listening ? <p>Listening</p>:<p>Ready</p>
  }
 </div>
}
<div className="flex gap-7 justify-center ">
  <button onClick={startConversation} className="bg-pink-500 px-10 py-2 rounded-2xl cursor-pointer hover:scale-104 transition-all text-white font-medium">Start</button>
  <button className="bg-red-500 rounded-2xl px-10 py-2 cursor-pointer hover:scale-104 transi text-white font-medium">Stop</button>
</div>
</div>
    </div>
  );
};

export default MicSpeaker;