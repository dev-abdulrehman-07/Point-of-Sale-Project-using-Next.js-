'use client'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/store/store'

function UserprofileComp() {
  const { role, name } = useAppSelector((state) => state.userInfo)
  const [localUser, setLocalUser] = useState<{ name: string | null; role: string | null }>({
    name: null,
    role: null,
  })

  useEffect(() => {
    if (!name) {
      const savedUser = localStorage.getItem("velvetUser")
      if (savedUser) {
        setLocalUser(JSON.parse(savedUser))
      }
    }
  }, [name])

  const displayName = name || localUser.name
  const displayRole = role || localUser.role

  if (!displayName) {
    return (
      <div className="flex justify-center flex-col relative opacity-50 animate-pulse">
        <h1 className="text-[14px] text-slate-500">Loading profile...</h1>
      </div>
    )
  }

  return (
    <div className="sm:flex justify-center flex-col relative">
      <h1 className="xs:text-[10px] text-[14px] font-medium  text-slate-500">{displayName}</h1>
      <div className="flex items-center gap-x-1">
        <p className="text-[10px] xs:text-[8px] text-slate-400 uppercase tracking-wider">{displayRole}</p>
        <div className="h-2 w-2 bg-[#ccff66] animate-pulse rounded-full"></div>
      </div>
    </div>
  )
}

export default UserprofileComp