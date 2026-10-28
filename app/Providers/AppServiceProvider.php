<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([

            // ============================
            // 🔐 SHARE AUTH DATA KE FE
            // ============================
            'auth' => [
                'user' => fn () => Auth::user()
                    ? [
                        'id'    => Auth::user()->id,
                        'name'  => Auth::user()->name,
                        'email' => Auth::user()->email,
                        'role'  => Auth::user()->role,
                    ]
                    : null,
            ],

            // ============================
            // ✔ SHARE RECAPTCHA KE FE
            // ============================
            'recaptcha_site_key' => env('RECAPTCHA_SITE_KEY'),

        ]);
    }
}
