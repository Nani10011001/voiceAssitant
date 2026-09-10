import { useRef, useState } from "react";
import { Mic, MicOff, Sparkles, X } from "lucide-react";

import { motion } from "framer-motion";

/* import { type Variants } from "framer-motion"; */
type Props = {
  onClose: () => void;
};
/* const micSpeakerAnimation: Variants = {

  offsrceen:{
    scale:0.70
  },
  onscreen:{
    scale:1.2,
    transition:{
      duration:0.8,
      ease:"easeInOut",
    repeat:Infinity
    }
  }
} */
const MicSpeaker = ({ onClose }: Props) => {
  const [listening, setListening] = useState(false);
  const wsRef = useRef<WebSocket | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
 const MediaRecorderRef = useRef<MediaRecorder | null>(null)
 const [buttonListening,setButtonListening] = useState(true)
const audioRef = useRef<HTMLAudioElement | null>(null);
const startConversation = async () => {
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    console.log("websocket is already connected");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    streamRef.current = stream;

    console.log("stream data:", stream);

    const ws = new WebSocket("ws://localhost:8000/ws");

    wsRef.current = ws;

    ws.binaryType = "arraybuffer";

    setListening(true);
    setButtonListening(false);



    ws.onopen = () => {
      console.log("connected websocket");
      //sending the user information
       ws.send(JSON.stringify({
        type:"user_info",
        sessionId:sessionStorage.getItem("sessionId"),
        name: sessionStorage.getItem("user_name"),
        phoneNumber: sessionStorage.getItem("phone_number")

        
      })) 
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      MediaRecorderRef.current = recorder;

      recorder.ondataavailable = async (event) => {
        if (
          event.data.size > 0 &&
          ws.readyState === WebSocket.OPEN
        ) {
          const arraybuffer =
            await event.data.arrayBuffer();

          console.log(
            "Sending microphone:",
            arraybuffer.byteLength,
            "bytes"
          );

          ws.send(arraybuffer);
        }
      };

      recorder.start(1000);
    };




    ws.onmessage = async (event) => {


  
      if (typeof event.data === "string") {
        try {
          const message = JSON.parse(event.data);

          console.log("Control message:", message);

          if (message.type === "stop_audio") {
            console.log(" Stop audio");

            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              audioRef.current = null;
            }
          }

        } catch (error) {
          console.error(
            "Invalid websocket message:",
            error
          );
        }

        return;
      }
      // MP3 AUDIO
     

      if (event.data instanceof ArrayBuffer) {

        console.log(
          " Received MP3:",
          event.data.byteLength,
          "bytes"
        );

        const blob = new Blob(
          [event.data],
          {
            type: "audio/mpeg",
          }
        );

        console.log("Blob size:", blob.size);
        console.log("Blob type:", blob.type);

        const url = URL.createObjectURL(blob);


        // Stop previous audio

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }


        // Create audio
        const audio = new Audio();

        audioRef.current = audio;

        audio.src = url;
        audio.preload = "auto";


        audio.onloadedmetadata = () => {
          console.log(
            " Duration:",
            audio.duration,
            "seconds"
          );
        };

        audio.oncanplay = () => {
          console.log(
            "Browser decoded MP3"
          );
        };

        audio.onplay = () => {
          console.log(
            " Agent speaking"
          );
        };

        audio.onended = () => {
          console.log(
            " Agent finished"
          );

          if (audioRef.current === audio) {
            audioRef.current = null;
          }

          URL.revokeObjectURL(url);
        };

        audio.onerror = () => {
          console.error(
            "Browser audio error"
          );

          console.error(audio.error);

          URL.revokeObjectURL(url);
        };


      

        try {
          await audio.play();

          console.log(
            " audio.play() successful"
          );

        } catch (error) {
          console.error(
            " audio.play() failed:",
            error
          );
        }
      }
    };


    ws.onerror = (error) => {
      console.error(
        "WebSocket error:",
        error
      );
    };



    ws.onclose = () => {
      console.log(
        "WebSocket closed"
      );
    };

  } catch (error) {
    console.error(
      "Error at start button:",
      error
    );
  }
};


const stopConversation = () => {
  try {

    // Stop agent audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    // Stop microphone recorder
    MediaRecorderRef.current?.stop();
    // Clse WebSocket
    wsRef.current?.close();

    // Stop microphone
    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    // Clear refs
    MediaRecorderRef.current = null;
    wsRef.current = null;
    streamRef.current = null;

    setListening(false);
    setButtonListening(true);

    console.log("button stopped");

  } catch (error) {
    console.log(
      "error at stop button:",
      error
    );
  }
};
 
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
    <Sparkles size={10} className="text-pink-400"/><span className="font-semibold text-xl">voice Assitance</span>
</p>
</div>
<div className="w-full  flex justify-center mt-15 ">
  {
    listening ? (
      <p 
 

  className="px-7 py-7 text-white rounded-full animate-ping  bg-red-500 transform ">
    <Mic size={30} /></p>

    ):(
 <p 
 

  className="px-10 py-10 text-white rounded-full  bg-slate-800 transform ">
    <MicOff size={30} /></p>
    )
  }
 
</div>
{
 <div className="flex justify-center">
  {
     listening ? <p className="font-semibold text-md">Listening</p>:<p className="text-md font-semibold  ">Ready</p>
  }
 </div>
}
<div className="flex gap-7 justify-center ">
 {
  buttonListening ?( <motion.button

  whileHover={{
    y: -3,
    scale:1.03,
 

  }}
  whileTap={{

    scale:0.98

  }}
  onClick={startConversation} className="bg-pink-500 px-20 py-2 rounded-2xl cursor-pointer  text-white font-medium">Start</motion.button>
  ):(<motion.button 
  whileHover={{y:-3,
    scale:1.03
  }}
  whileTap={{scale:0.98}}
  onClick={stopConversation} className="bg-red-500 rounded-2xl px-20 py-2 cursor-pointer  text-white font-medium">Stop</motion.button>)
 }
  
  
</div>
</div>
    </div>
  );
}

export default MicSpeaker;