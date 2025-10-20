<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegistrationController;


Route::post('/register', [RegistrationController::class, 'store'])->name('api.register');
Route::get('/check-email', [RegistrationController::class, 'checkEmail'])->name('api.check-email');
Route::get('/registrations/count', [RegistrationController::class, 'getCount'])->name('api.registrations.count');
Route::get('/registrations', [RegistrationController::class, 'index'])->name('api.registrations.index');
Route::get('/registrations/export', [RegistrationController::class, 'exportExcel'])->name('api.registrations.export');
Route::post('/registrations/generate-uids', [RegistrationController::class, 'generateUids'])->name('api.registrations.generate-uids');
Route::get('/registrations/uid/{uid}', [RegistrationController::class, 'getByUid'])->name('api.registrations.get-by-uid');
