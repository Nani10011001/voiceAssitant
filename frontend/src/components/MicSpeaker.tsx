import React, { useState } from 'react'
import { Mic, MicOff, Sparkles, X } from 'lucide-react'

type Props = {
  onClose: () => void
}

const MicSpeaker: React.FC<Props> = ({ onClose }: Props) => {
  const [listening, setListening] = useState(false)


  const toggleListening = () => setListening((s) => !s)



  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.24),_transparent_34%),linear-gradient(135deg,_#fdf2f8_0%,_#f8fafc_55%,_#eef2ff_100%)] px-4 py-8 pointer-events-none">
      <div className="pointer-events-auto z-80 relative w-full max-w-md rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.13)] backdrop-blur-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Remove voice assistant"
          className="absolute right-4 bg-red-500 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200  text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
        >
          <X size={18} className="cursor-pointer" />
        </button>
        
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-pink-500/10 via-transparent to-indigo-500/10" />
        <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute -right-8 bottom-8 h-28 w-28 rounded-full bg-indigo-300/40 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-200/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-pink-600 shadow-sm">
            <Sparkles size={14} />
            Voice Assistant
          </div>

          <div className="relative mb-6">
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                listening ? 'scale-110 bg-red-400/20 blur-xl' : 'scale-100 bg-slate-900/5'
              }`}
            />
            <button
              onClick={toggleListening}
              aria-pressed={listening}
              aria-label={listening ? 'Stop listening' : 'Start listening'}
              className={`relative flex h-32 w-32 items-center justify-center rounded-full border border-white/70 shadow-[0_20px_45px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.22)] focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 active:scale-95 sm:h-36 sm:w-36 ${
                listening
                  ? 'bg-gradient-to-br from-red-500 via-rose-500 to-pink-500'
                  : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900'
              }`}
            >
              {listening && (
                <span className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
              )}

              <span
                className={`absolute h-24 w-24 rounded-full border border-white/20 transition-all duration-300 sm:h-28 sm:w-28 ${
                  listening ? 'bg-white/15' : 'bg-white/10'
                }`}
              />

              <span className="relative z-10 text-white">
                {listening ? <Mic size={34} /> : <MicOff size={34} />}
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-lg font-semibold text-slate-800">
              {listening ? 'Listening now' : 'Tap to speak'}
            </div>
            <div className="text-sm text-slate-500">
              {listening
                ? 'Your voice is being captured for the assistant.'
                : 'Press the mic to start a conversation with your AI guide.'}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-2 text-xs font-medium text-slate-600">
            <span className={`h-2.5 w-2.5 rounded-full ${listening ? 'animate-pulse bg-red-500' : 'bg-emerald-500'}`} />
            {listening ? 'Live voice capture' : 'Ready when you are'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MicSpeaker