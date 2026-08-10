import { useRef, useState } from "react";
import { Mic, MicOff, Sparkles, X } from "lucide-react";

type Props = {
  onClose: () => void;
};

const MicSpeaker = ({ onClose }: Props) => {
  const [listening, setListening] = useState(false);

  const toggleListening = () => {
    setListening((prev) => !prev);
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
<div className=" flex justify-center mt-10">
  <p className="flex gap-2 items-center" > 
    <Sparkles size={10} className="text-pink-400"/><span className="font-semibold text-sm">voice Assitance</span>
</p>
</div>

    </div>
  );
};

export default MicSpeaker;