<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegistrationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [RegistrationController::class, 'store'])->name('api.register');
Route::get('/check-email', [RegistrationController::class, 'checkEmail'])->name('api.check-email');
Route::get('/registrations/count', [RegistrationController::class, 'getCount'])->name('api.registrations.count');
Route::get('/registrations', [RegistrationController::class, 'index'])->name('api.registrations.index');
