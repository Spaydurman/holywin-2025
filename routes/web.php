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

    Route::get('side-quest', function () {
        return Inertia::render('side-quest');
    })->name('side-quest');
    
    // Side Quest API routes
    Route::prefix('admin')->group(function () {
        Route::get('side-quest-headers', [\App\Http\Controllers\SideQuestController::class, 'index']);
        Route::post('side-quest-headers', [\App\Http\Controllers\SideQuestController::class, 'storeHeader']);
        Route::put('side-quest-headers/{header}', [\App\Http\Controllers\SideQuestController::class, 'updateHeader']);
        Route::delete('side-quest-headers/{header}', [\App\Http\Controllers\SideQuestController::class, 'destroyHeader']);
        
        Route::post('side-quest-lines', [\App\Http\Controllers\SideQuestController::class, 'storeLine']);
        Route::put('side-quest-lines/{line}', [\App\Http\Controllers\SideQuestController::class, 'updateLine']);
        Route::delete('side-quest-lines/{line}', [\App\Http\Controllers\SideQuestController::class, 'destroyLine']);
    });
});


Route::get('/keep-alive', function () {
    try {
        DB::select('SELECT 1');
        return response()->json(['status' => 'alive'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Game routes
Route::prefix('game')->group(function () {
    Route::get('login', [\App\Http\Controllers\GameAuthController::class, 'showLoginForm'])->name('game.login');
    Route::post('login', [\App\Http\Controllers\GameAuthController::class, 'login']);
    Route::post('logout', [\App\Http\Controllers\GameAuthController::class, 'logout'])->name('game.logout');
    
    Route::get('side-quest', [\App\Http\Controllers\GameAuthController::class, 'showSideQuest'])->name('game.side-quest')->middleware('game.auth');
    Route::get('side-quest/form/{header}', [\App\Http\Controllers\GameAuthController::class, 'showSideQuestForm'])->name('game.side-quest-form')->middleware('game.auth');
    
    // Side quest validation endpoint
    Route::post('side-quest/validate', [\App\Http\Controllers\SideQuestController::class, 'validateSideQuest'])->middleware('game.auth');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
