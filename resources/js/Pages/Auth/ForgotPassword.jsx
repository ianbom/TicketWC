"use client";

import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import logo from "/public/img/psn.jpg";

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const [localErrors, setLocalErrors] = useState({});

    // ==============================
    // FRONTEND VALIDATION
    // ==============================
    const validate = () => {
        const newErrors = {};

        if (!data.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            newErrors.email = "Invalid email format";
        }

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ==============================
    // SUBMIT
    // ==============================
    const submit = (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please check your inputs");
            return;
        }

        post("/forgot-password", {
            preserveScroll: true,

            onSuccess: () => {
                toast.success("Email reset password berhasil dikirim");
                setData("email", "")
            },

            onError: (err) => {

                if (errors.email) {
                    toast.error(errors.email)   // Email tidak terdaftar
                }
                else if (errors.server) {
                    toast.error("Gagal mengirim email. Coba lagi nanti")
                }
                else {
                    toast.error("Terjadi kesalahan, coba lagi nanti")
                }

            },
        })

    };

    const getError = (field) => localErrors[field] || errors[field];

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

            {/* ================= LEFT IMAGE (DESKTOP) ================= */}
            <div className="hidden lg:block bg-gray-100">
                <img
                    src={logo}
                    alt="Forgot Password"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ================= RIGHT FORM ================= */}
            <div className="flex md:items-center justify-center p-6 sm:p-12">
                <div className="max-w-md w-full space-y-5">

                    {/* TITLE */}
                    <h1 className="text-3xl font-bold text-center">
                        Forgot Password
                    </h1>

                    <p className="text-sm text-muted-foreground text-center">
                        Enter your email and we’ll send you a link to reset your password.
                    </p>

                    {/* FORM TANPA BORDER / SHADOW */}
                    <form onSubmit={submit} className="space-y-4">

                        {/* EMAIL */}
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="your@email.com"
                                disabled={processing}
                                className={`${getError("email") ? "border-red-500" : ""}`}
                            />
                            {getError("email") && (
                                <p className="text-red-500 text-sm">{getError("email")}</p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <Button className="w-full h-11 text-sm" disabled={processing}>
                            {processing ? "Sending..." : "Send Reset Link"}
                        </Button>

                    </form>

                    {/* Back to login */}
                    <p className="text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <a href="/" className="text-primary underline">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
