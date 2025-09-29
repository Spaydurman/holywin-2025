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
        Log::info('Registration attempt', $request->all());
        $validatedData = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|unique:registrations,email|max:255',
            'birthday' => 'required|date|date_format:Y-m-d|before:today',
            'age' => 'required|integer|min:1|max:120',
            'invited_by' => 'nullable|string|min:2|max:255',
            'salvationist' => 'required|in:yes,no',
        ]);

        // Additional validation: if salvationist is 'no', invited_by is required
        if ($validatedData['salvationist'] === 'no' && (empty($validatedData['invited_by']) || strlen(trim($validatedData['invited_by'])) < 2)) {
            throw ValidationException::withMessages([
                'invited_by' => ['The invited by field is required when you are not a salvationist.']
            ]);
        }

        // If salvationist is 'yes', ensure invited_by is not required but clear it if empty
        if ($validatedData['salvationist'] === 'yes') {
            $validatedData['invited_by'] = $validatedData['invited_by'] ?? null;
        }

        $registration = Registration::create($validatedData);

        return response()->json([
            'message' => 'Registration successful',
            'data' => $registration
        ], 201);
    }
}
