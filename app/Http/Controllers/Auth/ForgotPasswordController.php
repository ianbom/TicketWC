<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Exception;

class ForgotPasswordController extends Controller
{
    public function showForm()
    {
        return Inertia::render("Auth/ForgotPassword");
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            "email" => "required|email"
        ]);

        try {

            $status = Password::sendResetLink(
                $request->only("email")
            );

            return $status === Password::RESET_LINK_SENT
                ? back()->with("success", "Email reset berhasil dikirim.")
                : back()->withErrors(["email" => "Email tidak ditemukan."]);
        } catch (\Exception $e) {
            return back()->withErrors([
                "server" => "Gagal mengirim email. Silakan coba lagi."
            ]);
        }
    }
}