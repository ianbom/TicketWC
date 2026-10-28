<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            return redirect()->route('ticket.dashboard');
        }

        return Inertia::render('Login', [
            'recaptcha_site_key' => env('RECAPTCHA_SITE_KEY')
        ]);
    }

    public function authenticate(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
            'g-recaptcha-response' => 'required',
        ]);

        // ============================
        // 1. VALIDASI reCAPTCHA v2
        // ============================
        $captcha = $this->validateRecaptcha($request->input('g-recaptcha-response'));

        if (!$captcha['success']) {
            return back()->withErrors([
                'captcha' => 'Verifikasi CAPTCHA gagal. Silakan coba lagi.'
            ]);
        }

        // ============================
        // 2. RATE LIMIT (5x salah / 60 detik)
        // ============================
        $key = 'login:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return back()->withErrors([
                'rate' => "Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik."
            ]);
        }

        RateLimiter::hit($key, 60);

        // ============================
        // 3. PROSES LOGIN
        // ============================
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            Log::warning("Login gagal", [
                'email' => $request->email,
                'ip'    => $request->ip(),
            ]);

            return back()->withErrors([
                'email' => 'Email atau password salah.'
            ]);
        }

        // ============================
        // 4. CEK EMAIL VERIFIED
        // ============================
        if (Auth::user()->email_verified_at === null) {
            Auth::logout();
            return back()->withErrors([
                'email' => 'Email belum diverifikasi. Silakan cek OTP Anda.'
            ]);
        }

        // ============================
        // 5. LOGIN SUKSES
        // ============================
        $request->session()->regenerate();

        Log::info("Login sukses", [
            'user_id' => Auth::id(),
            'email'   => Auth::user()->email,
            'ip'      => $request->ip(),
        ]);

        return redirect()->route('ticket.dashboard');
    }

    private function validateRecaptcha($token)
    {
        $secret = env("RECAPTCHA_SECRET_KEY");

        $http = Http::asForm();

        // Bypass SSL verification di local development (XAMPP tidak punya CA bundle)
        if (app()->environment('local')) {
            $http = $http->withoutVerifying();
        }

        $response = $http->post(
            "https://www.google.com/recaptcha/api/siteverify",
            [
                'secret'   => $secret,
                'response' => $token
            ]
        );

        return $response->json();
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('auth.login');
    }
}
