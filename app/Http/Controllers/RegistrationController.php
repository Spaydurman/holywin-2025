<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|unique:registrations,email|max:255',
            'birthday' => 'required|date|date_format:Y-m-d|before:today',
            'age' => 'required|integer|min:1|max:120',
            'invited_by' => 'nullable|string|min:2|max:255',
            'salvationist' => 'required|in:yes,no',
        ]);

        if ($validatedData['salvationist'] === 'no' && (empty($validatedData['invited_by']) || strlen(trim($validatedData['invited_by'])) < 2)) {
            throw ValidationException::withMessages([
                'invited_by' => ['The invited by field is required when you are not a salvationist.']
            ]);
        }

        if ($validatedData['salvationist'] === 'yes') {
            $validatedData['invited_by'] = $validatedData['invited_by'] ?? null;
        }

        $registration = Registration::create($validatedData);

        return response()->json([
            'message' => 'Registration successful',
            'data' => $registration
        ], 201);
    }

    /**
     * Check if an email already exists.
     */
    public function checkEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->input('email');
        $exists = Registration::where('email', $email)->exists();

        return response()->json([
            'exists' => $exists
        ]);
    }

    /**
     * Get the total number of registrations.
     */
    public function getCount(): JsonResponse
    {
        $count = Registration::count();

        return response()->json([
            'count' => $count
        ]);
    }

    /**
     * Display a listing of the resource with search, pagination and per page options.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Registration::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('invited_by', 'like', "%{$search}%")
                  ->orWhere('salvationist', 'like', "%{$search}%");
            });
        }

        // Sort by created_at descending by default
        $query->orderBy('created_at', 'desc');

        // Pagination with per page option
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $registrations = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $registrations->items(),
            'pagination' => [
                'current_page' => $registrations->currentPage(),
                'last_page' => $registrations->lastPage(),
                'per_page' => $registrations->perPage(),
                'total' => $registrations->total(),
                'from' => $registrations->firstItem(),
                'to' => $registrations->lastItem(),
            ]
        ]);
    }
}
