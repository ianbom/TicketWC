"use client";

import { RegisterForm } from "@/Components/regesister-form";
import registerImage from "/public/img/register.jpg";
import logo from "/public/img/psn.jpg"; // ← tambahkan logo di sini

export default function Register() {
  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LOGO TOP-LEFT */}
      <div className="absolute top-6 left-6 z-50 bg-white backdrop-blur-md p-3 rounded-xl shadow-lg">
        <img
          src={logo}
          alt="Logo"
          className="w-20 h-auto"
        />
      </div>

      {/* LEFT IMAGE SECTION */}
      <div className="hidden lg:flex items-center justify-center bg-[#0A1A2F]">
        <img
          src={registerImage}
          alt="Register Illustration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>

    </div>
  );
}
