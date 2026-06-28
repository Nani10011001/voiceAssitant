import axios from "axios"
import { useState,  type SyntheticEvent } from "react"
import { Mail } from 'lucide-react';
import { KeyRound } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
 const navigator = useNavigate()
  const submitHandlerLogin = async(event: SyntheticEvent<HTMLFormElement>) => {
   try {
     event.preventDefault()
    const {data} = await axios.post("http://localhost:4000/api/auth/login",{email,password})
    if(data.success){

toast.success("login successfull")
    }
   } catch (error) {
    console.error(error)
   }
  }

  return (
    <section className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.24),_transparent_35%),linear-gradient(135deg,_#fff7fb_0%,_#fdf2f8_50%,_#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex flex-col justify-between bg-gradient-to-br from-pink-600 via-rose-500 to-fuchsia-500 p-8 text-white sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.24),_transparent_35%)]" />
            <div className="relative z-10">
              <div className="mb-5 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm font-medium tracking-wide backdrop-blur-sm">
                Premium Admin Portal
              </div>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Manage your AI business with clarity.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-pink-50 sm:text-base">
                Review customer conversations, track assistant performance, and oversee property inquiries from one beautifully organized workspace.
              </p>
            </div>

            <div className="relative z-10 mt-8 space-y-3 text-sm text-pink-50">
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="text-lg">✓</span>
                <span>End-to-end encryption and secure access</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="text-lg">✓</span>
                <span>Protected admin portal with live monitoring</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="text-lg">✓</span>
                <span>Available whenever your team needs it</span>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8">
              <div className="mb-4 inline-flex rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm font-medium text-pink-600">
                Secure sign in
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Access your dashboard with your admin credentials and continue where you left off.
              </p>
            </div>

            <form onSubmit={submitHandlerLogin} className="space-y-4">
              <label className="group relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-pink-500">
                 <Mail/>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 py-3 pl-12 pr-4 text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus-visible:ring-2 focus-visible:ring-pink-500/50"
                />
              </label>

              <label className="group relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-pink-500">
                <KeyRound/>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event:React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 py-3 pl-12 pr-4 text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus-visible:ring-2 focus-visible:ring-pink-500/50"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-200 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl hover:shadow-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              >
                Access Dashboard
              </button>
            </form>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-700">Why teams love this portal</p>
              <div className="mt-3 space-y-2">
                <p>• Unified customer and assistant insights</p>
                <p>• Faster decision-making with a polished workspace</p>
                <p>• Built for secure, modern operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
