"use client";

import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logo from "/public/img/psn.jpg";

export default function ResetPassword({ token }) {
  const { data, setData, post, processing, errors } = useForm({
    token,
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [localErrors, setLocalErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  // ===========================
  // VALIDATION FE
  // ===========================
  const validate = () => {
    const newErrors = {};

    if (!data.email.trim()) newErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Format email tidak valid";

    if (!data.password) newErrors.password = "Password wajib diisi";
    else if (data.password.length < 8)
      newErrors.password = "Minimal 8 karakter";
    else if (!/[A-Z]/.test(data.password))
      newErrors.password = "Harus ada huruf besar (A-Z)";
    else if (!/[0-9]/.test(data.password))
      newErrors.password = "Harus ada angka (0-9)";

    if (!data.password_confirmation)
      newErrors.password_confirmation = "Konfirmasi wajib diisi";
    else if (data.password !== data.password_confirmation)
      newErrors.password_confirmation = "Konfirmasi tidak cocok";

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===========================
  // SUBMIT
  // ===========================
  const submit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Periksa kembali form anda");
      return;
    }

    post("/reset-password", {
      onSuccess: () => toast.success("Password berhasil direset"),
      onError: () => toast.error("Token kadaluarsa atau gagal reset"),
    });
  };

  const getError = (field) => localErrors[field] || errors[field];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* =============== LEFT IMAGE (Desktop Only) =============== */}
      <div className="hidden lg:block bg-gray-100">
        <img
          src={logo}
          alt="Reset Password"
          className="w-full h-full object-cover"
        />
      </div>

      {/* =============== RIGHT FORM =============== */}
      <div className="flex md:items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-sm text-gray-500">Masukkan email & password baru</p>
          </div>

          <form onSubmit={submit} className="space-y-5">

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="Your email"
                disabled={processing}
                className={getError("email") ? "border-red-500" : ""}
              />
              {getError("email") && (
                <p className="text-red-500 text-sm">{getError("email")}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>Password Baru</Label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  disabled={processing}
                  placeholder="New password"
                  className={getError("password") ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {getError("password") && (
                <p className="text-red-500 text-sm">{getError("password")}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  type={showPass2 ? "text" : "password"}
                  value={data.password_confirmation}
                  placeholder="Confirm new password"
                  onChange={(e) =>
                    setData("password_confirmation", e.target.value)
                  }
                  disabled={processing}
                  className={
                    getError("password_confirmation") ? "border-red-500" : ""
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass2(!showPass2)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {getError("password_confirmation") && (
                <p className="text-red-500 text-sm">
                  {getError("password_confirmation")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button className="w-full h-11" disabled={processing}>
              {processing ? "Memproses..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
