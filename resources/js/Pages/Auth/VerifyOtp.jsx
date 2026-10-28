import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyOtp({ email }) {
  const [otp, setOtp] = useState("");

  const submitOtp = (e) => {
    e.preventDefault();
    router.post("/verify-otp", { email, otp });
  };

  const resendOtp = () => {
    router.post("/verify-otp/resend", { email });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-md">
        <h1 className="text-xl font-bold mb-2">Verifikasi Email</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Masukkan kode OTP yang dikirim ke <strong>{email}</strong>
        </p>

        <form className="space-y-4" onSubmit={submitOtp}>
          <Input
            type="number"
            maxLength="6"
            placeholder="Masukkan kode OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button type="submit" className="w-full">
            Verifikasi
          </Button>
        </form>

        <button onClick={resendOtp} className="text-blue-600 text-sm mt-4">
          Kirim ulang OTP
        </button>
      </div>
    </div>
  );
}
