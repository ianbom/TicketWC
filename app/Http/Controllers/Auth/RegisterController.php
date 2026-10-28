<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\EmailOtp;
use App\Models\Department;
use App\Models\SubDepartment;
use App\Models\Gateway;
use App\Models\Position;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

use App\Mail\SendOtpMail;

use Inertia\Inertia;
use Exception;

class RegisterController extends Controller
{
    /**
     * Halaman register + dropdown
     */
    public function index()
    {
        return Inertia::render('Auth/Register', [
            'departments'       => Department::select('id', 'name')->get(),
            'sub_departments'   => SubDepartment::select('id', 'name')->get(),
            'gateways'          => Gateway::select('id', 'name')->get(),
            'positions'         => Position::select('id', 'name')->get(),
        ]);
    }

    /**
     * Proses register dengan OTP
     */
    public function store(Request $request)
    {
        try {

            // ===================================================
            // ⛔ RATE LIMIT (Anti spam)
            // ===================================================
            $key = "register:" . $request->ip();

            if (RateLimiter::tooManyAttempts($key, 5)) {
                $sec = RateLimiter::availableIn($key);
                return back()->withErrors([
                    'rate' => "Terlalu banyak permintaan. Coba lagi dalam {$sec} detik."
                ]);
            }

            RateLimiter::hit($key, 60);


            // ===================================================
            // 🧼 SANITASI INPUT
            // ===================================================
            $request->merge([
                'name'  => trim(strip_tags($request->name)),
                'email' => strtolower(trim($request->email)),
            ]);


            // ===================================================
            // 📌 VALIDASI
            // ===================================================
            $validator = Validator::make($request->all(), [
                'name'  => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email',

                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/',
                    'confirmed',
                ],

                'department_id'      => 'required|exists:departments,id',
                'sub_department_id'  => 'required|exists:sub_departments,id',
                'gateway_id'         => 'required|exists:gateways,id',
                'position_id'        => 'required|exists:positions,id',

            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }


            // ===================================================
            // ❌ CEK PASSWORD MUDAH
            // ===================================================
            $weak = ['password', '12345678', 'qwerty', 'admin123'];
            if (in_array(strtolower($request->password), $weak)) {
                return back()->withErrors([
                    'password' => 'Password terlalu mudah.'
                ]);
            }


            // ===================================================
            // 🧩 SIMPAN USER (belum aktif)
            // ===================================================
            $user = User::create([
                'name'               => $request->name,
                'email'              => $request->email,
                'password'           => Hash::make($request->password),

                'department_id'      => $request->department_id,
                'sub_department_id'  => $request->sub_department_id,
                'gateway_id'         => $request->gateway_id,
                'position_id'        => $request->position_id,

                'role'               => 'user',
                'email_verified_at'  => null,
            ]);


            // ===================================================
            // 🔢 GENERATE OTP
            // ===================================================
            $otp = rand(100000, 999999);

            EmailOtp::create([
                'email'      => $user->email,
                'otp'        => $otp,
                'expires_at' => now()->addMinutes(5),
                'used'       => false,
            ]);


            // ===================================================
            // 📩 KIRIM EMAIL OTP
            // ===================================================
            Mail::to($user->email)->send(new SendOtpMail($otp));


            // ===================================================
            // 📝 LOG
            // ===================================================
            Log::info("User registered (waiting OTP)", [
                'email' => $user->email,
                'ip'    => $request->ip(),
            ]);


            // ===================================================
            // REDIRECT KE FORM OTP
            // ===================================================
            return redirect()
                ->route('auth.verifyOtpForm', ['email' => $user->email])
                ->with('success', 'OTP telah dikirim ke email Anda.');

        } catch (Exception $e) {

            Log::error("Register Error", [
                'msg' => $e->getMessage(),
            ]);

            return back()->withErrors([
                'server' => 'Terjadi kesalahan server.'
            ]);
        }
    }
}
