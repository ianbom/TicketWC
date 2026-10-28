"use client";

import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function RegisterForm({ className, ...props }) {
  const { departments, sub_departments, gateways, positions } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    department_id: "",
    sub_department_id: "",
    gateway_id: "",
    position_id: "",
    password: "",
    password_confirmation: "",
  });

  const [localErrors, setLocalErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // ===========================
  // FRONTEND VALIDATION
  // ===========================
  const validate = () => {
    const newErrors = {};

    // Name
    if (!data.name.trim()) newErrors.name = "Full name is required";

    // Email
    if (!data.email.trim())
      newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Invalid email format";

    // Dropdowns
    if (!data.department_id) newErrors.department_id = "Department is required";
    if (!data.sub_department_id)
      newErrors.sub_department_id = "Sub Department is required";
    if (!data.gateway_id) newErrors.gateway_id = "Gateway is required";
    if (!data.position_id) newErrors.position_id = "Position is required";

    // Password
    if (!data.password)
      newErrors.password = "Password is required";
    else if (data.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(data.password))
      newErrors.password =
        "Password must contain at least 1 uppercase letter (A-Z)";
    else if (!/[0-9]/.test(data.password))
      newErrors.password =
        "Password must contain at least 1 number (0-9)";

    // Confirm Password
    if (!data.password_confirmation)
      newErrors.password_confirmation = "Please confirm your password";
    else if (data.password !== data.password_confirmation)
      newErrors.password_confirmation = "Password confirmation does not match";

    setLocalErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ===========================
  // SUBMIT FORM
  // ===========================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please check the form again");
      return;
    }

    post("/register", {
      preserveScroll: true,
      onError: () => {
        toast.error("Registration failed");
      },
      onSuccess: () => {
        toast.success("Registration successful");
      },
    });
  };

  // ===========================
  // MERGE LOCAL ERROR + BACKEND ERROR
  // ===========================
  const getError = (field) => {
    if (localErrors[field]) return localErrors[field];
    if (errors[field]) return errors[field];
    return null;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 px-4 py-6 sm:px-6 w-full max-w-md mx-auto",
        className
      )}
      {...props}
    >
      <div className="text-center mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-[#0A1A2F]">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Register to access Ticketing System
        </p>
      </div>

      {/* Global error (server / rate limit) */}
      {(errors.server || errors.rate) && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-2">
          {errors.server || errors.rate}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}
        <div className="grid gap-2">
          <Label>Full Name</Label>
          <Input
            placeholder="Your full name"
            value={data.name}
            disabled={processing}
            onChange={(e) => setData("name", e.target.value)}
          />
          {getError("name") && (
            <p className="text-red-500 text-sm">{getError("name")}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Your email address"
            value={data.email}
            disabled={processing}
            onChange={(e) => setData("email", e.target.value)}
          />
          {getError("email") && (
            <p className="text-red-500 text-sm">{getError("email")}</p>
          )}
        </div>

        {/* DEPARTMENT */}
        <div className="grid gap-2">
          <Label>Department</Label>
          <Select
            value={data.department_id}
            onValueChange={(v) => setData("department_id", v)}
            disabled={processing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getError("department_id") && (
            <p className="text-red-500 text-sm">{getError("department_id")}</p>
          )}
        </div>

        {/* SUB DEPARTMENT */}
        <div className="grid gap-2">
          <Label>Sub Department</Label>
          <Select
            value={data.sub_department_id}
            onValueChange={(v) => setData("sub_department_id", v)}
            disabled={processing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Sub Department" />
            </SelectTrigger>
            <SelectContent>
              {sub_departments.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getError("sub_department_id") && (
            <p className="text-red-500 text-sm">
              {getError("sub_department_id")}
            </p>
          )}
        </div>

        {/* GATEWAY */}
        <div className="grid gap-2">
          <Label>Gateway</Label>
          <Select
            value={data.gateway_id}
            onValueChange={(v) => setData("gateway_id", v)}
            disabled={processing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gateway" />
            </SelectTrigger>
            <SelectContent>
              {gateways.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getError("gateway_id") && (
            <p className="text-red-500 text-sm">{getError("gateway_id")}</p>
          )}
        </div>

        {/* POSITION */}
        <div className="grid gap-2">
          <Label>Position</Label>
          <Select
            value={data.position_id}
            onValueChange={(v) => setData("position_id", v)}
            disabled={processing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getError("position_id") && (
            <p className="text-red-500 text-sm">{getError("position_id")}</p>
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
              disabled={processing}
              onChange={(e) => setData("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {getError("password") && (
            <p className="text-red-500 text-sm">{getError("password")}</p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="grid gap-2">
          <Label>Re-type Password</Label>
          <div className="relative">
            <Input
              type={showPassword2 ? "text" : "password"}
              placeholder="••••••••"
              value={data.password_confirmation}
              disabled={processing}
              onChange={(e) =>
                setData("password_confirmation", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute right-3 top-2.5"
            >
              {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {getError("password_confirmation") && (
            <p className="text-red-500 text-sm">
              {getError("password_confirmation")}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <Button className="w-full" disabled={processing}>
          {processing ? "Processing..." : "Create Account"}
        </Button>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-2">
          Already have an account?{" "}
          <a href="/" className="underline hover:text-primary">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
