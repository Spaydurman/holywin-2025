<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class GameAuthController extends Controller
{
    public function showLoginForm()
    {
        // If user is already authenticated for game, redirect to side-quest
        if (session()->has('game_user')) {
            return redirect()->route('game.side-quest');
        }
        
        return Inertia::render('game/login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'uid' => 'required|string|exists:registrations,uid'
        ]);

        // Find the registration by UID
        $registration = Registration::where('uid', $request->uid)->first();

        if ($registration) {
            // Store user information in session for game authentication
            // We'll use a custom session key to differentiate from regular auth
            session(['game_user' => $registration]);
            
            return Redirect::route('game.side-quest');
        }

        return back()->withErrors([
            'uid' => 'Invalid UID. Please try again.'
        ]);
    }

    public function logout(Request $request)
    {
        // Clear game user session
        $request->session()->forget('game_user');
        
        return Redirect::route('game.login');
    }

    public function showSideQuest()
    {
        // Check if user is authenticated for game
        if (!session()->has('game_user')) {
            return redirect()->route('game.login');
        }

        $gameUser = session('game_user');
        
        return inertia('game/side-quest', [
            'game_user' => $gameUser
        ]);
    }

    public function isAuthenticated()
    {
        return session()->has('game_user');
    }
}