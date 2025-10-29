<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegistrationController;
use \App\Http\Controllers\SideQuestController;

    Route::post('/register', [RegistrationController::class, 'store'])->name('api.register');
    Route::get('/check-email', [RegistrationController::class, 'checkEmail'])->name('api.check-email');
    Route::get('/registrations/count', [RegistrationController::class, 'getCount'])->name('api.registrations.count');
    Route::get('/registrations', [RegistrationController::class, 'index'])->name('api.registrations.index');
    Route::get('/registrations/export', [RegistrationController::class, 'exportExcel'])->name('api.registrations.export');
    Route::post('/registrations/generate-uids', [RegistrationController::class, 'generateUids'])->name('api.registrations.generate-uids');
    Route::get('/registrations/uid/{uid}', [RegistrationController::class, 'getByUid'])->name('api.registrations.get-by-uid');

Route::prefix('v1')->group(function () {
    Route::prefix('admin')->group(function () {
        Route::get('side-quest-headers', [SideQuestController::class, 'indexHeaders']);
        Route::post('side-quest-headers', [SideQuestController::class, 'storeHeader']);
        Route::put('side-quest-headers/{header}', [SideQuestController::class, 'updateHeader']);
        Route::delete('side-quest-headers/{header}', [SideQuestController::class, 'destroyHeader']);
        
        Route::post('side-quest-lines', [SideQuestController::class, 'storeLine']);
        Route::put('side-quest-lines/{line}', [SideQuestController::class, 'updateLine']);
        Route::delete('side-quest-lines/{line}', [SideQuestController::class, 'destroyLine']);

        Route::post('side-quest', [SideQuestController::class, 'store']);
    });
    
    // Leaderboard route (outside admin group)
    Route::get('leaderboard', [SideQuestController::class, 'getLeaderboard']);
});
