"use client";

import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginForm({ className, ...props }) {
  const { recaptcha_site_key, errors } = usePage().props;

  const { data, setData, post, processing } = useForm({
    email: "",
    password: "",
    "g-recaptcha-response": "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState({});

  // ======================================
  //  LOAD RECAPTCHA (Explicit Render)
  // ======================================
  useEffect(() => {
    window.onloadCallback = function () {
      const box = document.getElementById("recaptcha-box");
      if (box && window.grecaptcha) {
        window.grecaptcha.render("recaptcha-box", {
          sitekey: recaptcha_site_key,
          callback: (token) => {
            setData("g-recaptcha-response", token);
          },
        });
      }
    };

    const script = document.createElement("script");
    script.src =
      "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ======================================
  //  VALIDATION FE
  // ======================================
  const validate = () => {
    const newErrors = {};

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!data["g-recaptcha-response"]) {
      newErrors.captcha = "Please complete the CAPTCHA";
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ======================================
  //  SUBMIT LOGIN
  // ======================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please check the form again");
      return;
    }

    post("/login", {
      preserveScroll: true,

      onError: () => {
        toast.error("Login failed");
        if (typeof grecaptcha !== "undefined") grecaptcha.reset();
      },

      onSuccess: () => {
        toast.success("Login successful");
        setLocalErrors({});
        if (typeof grecaptcha !== "undefined") grecaptcha.reset();
      },
    });
  };

  const getError = (field) => localErrors[field] || errors[field];

  // ======================================
  //  UI
  // ======================================
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/login-bg.png')" }}
    >
      <div
        className={cn(
          "flex flex-col gap-6 px-4 py-6 sm:px-6 w-full max-w-sm mx-auto bg-white backdrop-blur-lg rounded-xl shadow-lg",
          className
        )}
        {...props}
      >
        {(errors.server || errors.rate) && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-2 rounded text-sm">
            {errors.server || errors.rate}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#0A1A2F]">
              Welcome to Ticketing System
            </h1>
            <p className="text-sm text-muted-foreground">
              Please login to continue
            </p>
          </div>

          {/* EMAIL */}
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              disabled={processing}
            />
            {getError("email") && (
              <p className="text-sm text-red-500">{getError("email")}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="grid gap-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                disabled={processing}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {getError("password") && (
              <p className="text-sm text-red-500">{getError("password")}</p>
            )}
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-primary underline">
              Forgot Password?
            </a>
          </div>

          {/* CAPTCHA */}
          <div className="mt-4">
            <div id="recaptcha-box"></div>

            {getError("captcha") && (
              <p className="text-sm text-red-500 mt-1">{getError("captcha")}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11" disabled={processing}>
            {processing ? "Processing..." : "Login"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <a href="/register" className="text-primary underline">
              Register now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
