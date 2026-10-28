<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// AUTH CONTROLLERS
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerifyOtpController;

// TICKET CONTROLLERS
use App\Http\Controllers\Ticket\TicketController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Ticket\DashboardController;
use App\Http\Controllers\Ticket\WorkInstructionController;

// CATEGORY CONTROLLER
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SubCategoryController;




/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/', [LoginController::class, 'index'])->name('auth.login');
Route::post('/login', [LoginController::class, 'authenticate'])->name('auth.login.submit');
Route::post('/logout', [LoginController::class, 'logout'])->name('auth.logout');

// REGISTER
Route::get('/register', [RegisterController::class, 'index'])->name('auth.register');
Route::post('/register', [RegisterController::class, 'store'])->name('auth.register.submit');

// OTP VERIFY
Route::get('/verify-otp', [VerifyOtpController::class, 'index'])->name('auth.verifyOtpForm');
Route::post('/verify-otp', [VerifyOtpController::class, 'verify'])->name('auth.verifyOtp');
Route::post('/verify-otp/resend', [VerifyOtpController::class, 'resend'])->name('auth.verifyOtp.resend');

// FORGOT PASSWORD
Route::get('/forgot-password', [ForgotPasswordController::class, 'showForm'])->name('password.request');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');

// RESET PASSWORD
Route::get('/reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');



/*
|--------------------------------------------------------------------------
| TICKETING SYSTEM (PROTECTED)
|--------------------------------------------------------------------------
*/

Route::prefix('ticket')
    ->middleware('auth')
    ->name('ticket.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Open ticket
        // Open ticket
        Route::get('/open', [TicketController::class, 'open'])->name('open');
        Route::post('/open', [TicketController::class, 'store'])->name('store');

        // List ticket
        Route::get('/list', [TicketController::class, 'list'])->name('list');

        // ===========================
        // REPORT (BENAR)
        // ===========================
        // Report
        Route::get('/report', [TicketController::class, 'report'])->name('report');

        Route::get('/report/download', [TicketController::class, 'downloadReport'])->name('report.download');
        Route::get('/report/excel', [TicketController::class, 'exportExcel'])->name('report.excel');


        // Work Instruction
        Route::get('/wi', [WorkInstructionController::class, 'index'])->name('wi');
        Route::post('/wi/upload', [WorkInstructionController::class, 'store'])->name('wi.upload');
        // Route::delete('/wi/{id}', [WorkInstructionController::class, 'destroy'])->name('wi.destroy');

        // Update Ticket
        Route::get('/update/{ticket_number}', [TicketController::class, 'edit'])->name('update');
        Route::post('/update/{ticket_number}', [TicketController::class, 'update'])->name('update.submit');

        // View Ticket
        Route::get('/view/{ticket_number}', [TicketController::class, 'show'])
            ->where('ticket_number', '[A-Za-z0-9\-_]+')
            ->name('view');

        Route::post('/ticket/{ticket_number}/close', [TicketController::class, 'close'])
            ->name('ticket.close');




        /*
|--------------------------------------------------------------------------
| ACCOUNT PAGE (FOR ALL AUTHENTICATED USERS)
|--------------------------------------------------------------------------
*/
        Route::get('/account', function () {
            return Inertia::render('Profile', [
                'auth' => [
                    'user' => auth()->user()->load([
                        'position',
                        'department',
                        'subDepartment',
                        'gateway'
                    ])
                ]
            ]);
        })->name('account');


        Route::put('/account/update', [UserController::class, 'updateProfile'])
            ->name('account.update');


        /*
        |--------------------------------------------------------------------------
        | ADMIN ONLY
        |--------------------------------------------------------------------------
        */
        Route::middleware('admin')->group(function () {
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
            Route::post('/users/update-role', [UserController::class, 'updateRole'])->name('users.updateRole');
            Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
            Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
            Route::get('/users/json', [UserController::class, 'json']);

            // ===========================
            // CATEGORY MANAGEMENT
            // ===========================
            // Category

            Route::get('/categories', [CategoryController::class, 'index'])->name('admin.categories.index');
            Route::post('/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
            Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');


            // ===========================
            // SUB CATEGORY MANAGEMENT
            // ===========================
            // Sub Category
            Route::post('/categories/{id}/sub', [SubCategoryController::class, 'store'])->name('admin.subcategories.store');
            Route::delete('/subcategories/{id}', [SubCategoryController::class, 'destroy'])->name('admin.subcategories.destroy');

            Route::delete('/delete/{ticket_number}', [TicketController::class, 'destroy'])
                ->name('delete');

            Route::delete('/wi/{id}', [WorkInstructionController::class, 'destroy'])
                ->middleware('admin')
                ->name('wi.delete');
        });
    });
