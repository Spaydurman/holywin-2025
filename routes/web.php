<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('home');

Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('registrations', function () {
        return Inertia::render('registrations');
    })->name('registrations');
});


Route::get('/keep-alive', function () {
    try {
        DB::select('SELECT 1');
        return response()->json(['status' => 'alive'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
