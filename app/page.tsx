'use client'

import Link from 'next/link'
import { redirect } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form'
import Image from 'next/image'
import { AppRoles, useLoginMutation } from '@/lib/store/Api-Hooks/main.api'
import { useTransitionRouter } from 'next-transition-router';
import { useAppDispatch } from '@/lib/store/store';
import { loginSet } from '@/lib/store/Slices/userInfo';
import { useState } from 'react';

const BRAND_COLOR = '#ccff66' 

interface Inputs {
  email: string
  password: string
}

export default function LoginPage() {


  const [ServerMessage, setServerMessage] = useState(``)
  const [positveresponse, setpositveresponse] = useState(false)
  const dispatch = useAppDispatch();
  const router = useTransitionRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
  const [loginData,{isError,isLoading,isSuccess}]= useLoginMutation()
  const onSubmit: SubmitHandler<Inputs> =async (data) => {
    const res = await loginData(data).unwrap();
    setServerMessage(`${res.message}`)
    setpositveresponse(res.success)
    if(res.message === "/newplayer"){
      return router.replace('/newplayer');
      
    }
    if(res.success){


      const userData = {
        name: res.user?.name ?? null,
        email: res.user?.email ?? null,
        role: res.user?.role ?? null,
      };
      



      localStorage.setItem("velvetUser", JSON.stringify(userData)); 
  dispatch(loginSet(userData));

  if (res.user?.role === AppRoles.BRANCH_MANAGER) {
    router.replace("/branchmanager");
  } else if (res.user?.role === AppRoles.CASHIER) {
    router.replace("/point-of-sale");
  } else if (res.user?.role === AppRoles.INVENTORY_MANAGER) {
    router.replace("/martinventory");
  }


    
      
  }
  }


  return (
    <main className="w-full min-h-screen flex flex-row bg-neutral-100 select-none">
      

      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-neutral-900 flex-col justify-between p-14">
        <Image
          src="/image1.jpg" 
          alt="Operations Visual"
          fill
          sizes="45vw"
          className="object-cover scale-105 transition-transform duration-[10s] hover:scale-110"
          priority 
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
          
        <div className="relative z-20">
          <Link href="/" className="text-white text-lg font-sans font-bold tracking-[0.3em] uppercase">
            V E L V E T <span className="text-amber-400">.</span>
          </Link>
          <div className="w-12 h-px bg-white/40 mt-2" />
        </div>

        <div className="relative z-20 my-auto max-w-sm">
          <span className="text-[10px] tracking-[0.3em] font-mono text-amber-400 uppercase block mb-3">
            Internal Operations Portal
          </span>
          <h1 className="text-3xl xl:text-4xl font-light tracking-widest text-white leading-relaxed uppercase mb-4">
            Crafting <br />
            <span className="font-medium">Exceptional Dining.</span>
          </h1>
          <p className="text-xs text-neutral-300/80  font-sans font-light tracking-wide leading-relaxed">
            Access your dashboard to manage floor plans, view real-time table statuses, track active kitchen orders, and coordinate shifts seamlessly.
          </p>
        </div>

        <div className="relative z-20 flex items-center justify-between border-t border-white/10 pt-4 w-full">
          <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
            © 2026 VELVET
          </span>
          <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase">
            PRIVACY SECURED ✦
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12 relative">
        
        <div 
          className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full filter blur-[100px] opacity-[0.05] pointer-events-none"
          style={{ backgroundColor: BRAND_COLOR }}
        />
        
        <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 sm:p-10 border border-neutral-100 shadow-xl shadow-neutral-200/40 relative z-10">
          
          <div className=" text-center lg:text-left mb-5">
            <div className="lg:hidden mb-4">
              <span className="text-base font-bold tracking-[0.25em] uppercase text-neutral-900">
                VELVET<span className="text-amber-400">.</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-neutral-800 uppercase">
              Welcome Back
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-1 tracking-wide">

              Enter your credentials to access your premium portal.
            </p>

              {!positveresponse?
            ServerMessage&&(
            <p className="text-xs text-red-500 font-semibold mt-3 text-center  tracking-wide">
{ServerMessage}
            </p>
            )
            :
            (<p className="text-xs text-green-500 font-semibold mt-3 text-center  tracking-wide">
Login Sucessfull
            </p>)
            }
              
          
          </div>
          

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            
            <div className="flex flex-col w-full">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">
                Email Address
              </label>
              <input
                type="text"
                placeholder="name@restaurant.com"
                {...register("email", {
                  required: { value: true, message: "Please Enter Email" },
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 
                    message: "Please Enter Correct Email",
                  }
                })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3.5 font-sans text-xs tracking-wide transition-all outline-none focus:bg-white focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
              />

              {errors.email && (
                <span className="text-xs font-medium text-red-500 mt-2 px-1">
                  {errors.email.message}
                </span>
              )}
            </div>
            
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Password
                </label>
                <Link 
                  href="/comingsoon"
                  className="text-[10px] font-sans font-semibold tracking-wider text-neutral-400 hover:text-neutral-800 transition-colors uppercase underline underline-offset-2"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: { value: true, message: "Password is Required" },
                  minLength: { value: 8, message: "At least 8 characters required" },
                  maxLength: { value: 50, message: "Max length is 20" }
                })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3.5 font-sans text-xs tracking-wide transition-all outline-none focus:bg-white focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
              />
              {errors.password && (
                <span className="text-xs font-medium text-red-500 mt-2 px-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {!isLoading&&(<button
              type="submit"
              className="w-full text-neutral-900 font-sans text-xs font-bold tracking-[0.2em] py-4 rounded-2xl uppercase transition-all shadow-md hover:brightness-95 active:scale-[0.99] mt-2"
              style={{ backgroundColor: BRAND_COLOR }}
            >
              Sign In to Account
            </button>)}
          </form>
       
          <div className="text-center mt-8 pt-6 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 font-sans tracking-wide">
              New to Velvet?{' '}
              <Link 
                href="/signup" 
                className="font-bold underline underline-offset-4 hover:text-neutral-900 transition-colors uppercase text-[11px] tracking-wider ml-1 text-neutral-700"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>

    </main>
  )
}