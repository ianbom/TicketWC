<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\EmailOtp;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendOtpMail;

use Inertia\Inertia;

class VerifyOtpController extends Controller
{
    /**
     * Halaman input OTP
     */
    public function index(Request $request)
    {
        $email = $request->email;

        if (!$email) {
            return redirect()->route('auth.login')
                ->withErrors(['email' => 'Email tidak ditemukan.']);
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $email
        ]);
    }

    /**
     * Verifikasi OTP
     */
    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|digits:6'
        ]);

        $otpRecord = EmailOtp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('used', false)
            ->first();

        if (!$otpRecord) {
            return back()->withErrors(['otp' => 'Kode OTP salah.']);
        }

        if ($otpRecord->expires_at < now()) {
            return back()->withErrors(['otp' => 'OTP sudah kedaluwarsa.']);
        }

        // Tandai OTP sudah digunakan
        $otpRecord->update(['used' => true]);

        // Verifikasi user
        User::where('email', $request->email)
            ->update(['email_verified_at' => now()]);

        return redirect()->route('auth.login')
            ->with('success', 'Email berhasil diverifikasi! Silakan login.');
    }

    /**
     * Resend OTP
     */
    public function resend(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $otp = rand(100000, 999999);

        EmailOtp::create([
            'email' => $request->email,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(5),
            'used' => false,
        ]);

        Mail::to($request->email)->queue(new SendOtpMail($otp));

        return back()->with('success', 'OTP baru telah dikirim.');
    }
}
