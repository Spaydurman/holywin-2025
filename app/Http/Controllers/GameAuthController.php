<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\SideQuestHeader;
use App\Models\UserSideQuestPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Cache;

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
        
        // Get all side quest headers with their lines
        $headers = SideQuestHeader::with('lines')->get();
        
        // Calculate total points for the user
        $totalPoints = UserSideQuestPoint::where('uid', $gameUser['uid'])->sum('points');
        
        // Get completed side quest IDs with caching
        $cacheKey = 'completed_side_quests_' . $gameUser['uid'];
        $completedSideQuestIds = Cache::remember($cacheKey, 3600, function () use ($gameUser) {
            return UserSideQuestPoint::where('uid', $gameUser['uid'])
                ->pluck('side_quest_header_id')
                ->toArray();
        });
        
        return inertia('game/side-quest', [
            'game_user' => $gameUser,
            'headers' => $headers,
            'total_points' => $totalPoints,
            'completed_side_quest_ids' => $completedSideQuestIds
        ]);
    }

    public function showSideQuestForm($headerId)
    {
        // Check if user is authenticated for game
        if (!session()->has('game_user')) {
            return redirect()->route('game.login');
        }
        
        $gameUser = session('game_user');
        
        // Check if the side quest is already completed
        $completedSideQuest = UserSideQuestPoint::where('uid', $gameUser['uid'])
            ->where('side_quest_header_id', $headerId)
            ->first();
            
        if ($completedSideQuest) {
            return redirect()->route('game.side-quest')->with('error', 'This side quest has already been completed.');
        }
        
        // Get the specific side quest header with its lines
        $header = SideQuestHeader::with('lines')->findOrFail($headerId);
        
        return inertia('game/side-quest-form', [
            'header' => $header,
            'game_user' => $gameUser
        ]);
    }

    public function showLeaderboard()
    {
        // Check if user is authenticated for game
        if (!session()->has('game_user')) {
            return redirect()->route('game.login');
        }
        
        $gameUser = session('game_user');
        
        return inertia('game/leaderboard', [
            'game_user' => $gameUser
        ]);
    }

    public function isAuthenticated()
    {
        return session()->has('game_user');
    }
}