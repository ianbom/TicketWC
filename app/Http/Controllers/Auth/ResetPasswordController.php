<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ResetPasswordController extends Controller
{
    public function showResetForm($token)
    {
        return Inertia::render("Auth/ResetPassword", [
            "token" => $token,
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required|min:8|confirmed",
            "token" => "required"
        ]);

        $status = Password::reset(
            $request->only("email","password","password_confirmation","token"),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route("auth.login")->with("success", __($status))
            : back()->withErrors(["email" => [__($status)]]);
    }
}
