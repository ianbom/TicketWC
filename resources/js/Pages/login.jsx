"use client"

import bglogo from "/public/img/login.jpg"
import logo from "/public/img/psn.jpg" 
import  LoginForm  from "@/components/login-form"

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bglogo})`,
      }}
    >
      {/* LEFT TOP LOGO */}
      <div className="absolute top-6 left-6 z-50 bg-white backdrop-blur-md p-3 rounded-xl shadow-lg">
        <img
          src={logo}
          alt="App Logo"
          className="w-16 h-auto"
        />
      </div>

      {/* LOGIN FORM */}
      <LoginForm />
    </div>
  )
}
