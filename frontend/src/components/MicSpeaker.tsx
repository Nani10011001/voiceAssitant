import React,{useRef} from 'react'
import { Mic } from 'lucide-react';
type Props = {}

const MicSpeaker = () => {
   
  return (
    <div className='flex justify-center'>
  <div >
    <p className='bg-red-500 max-w-3xl max-h-4 '><Mic className='text-white ' size={26}/></p>
  </div>
    </div>
  )
}
export default MicSpeaker