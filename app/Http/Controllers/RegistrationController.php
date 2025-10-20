<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|unique:registrations,email|max:255',
            'birthday' => 'required|date_format:Y-m-d|before:today|after:120 years ago|before:12 years ago',
            'age' => 'required|integer|min:13|max:35',
            'invited_by' => 'nullable|string|min:2|max:255',
            'salvationist' => 'required|in:yes,no',
            'mobile_number' => 'nullable|string|max:15',
        ]);

        if ($validatedData['salvationist'] === 'no') {
            if (empty($validatedData['invited_by']) || strlen(trim($validatedData['invited_by'])) < 2) {
                throw ValidationException::withMessages([
                    'invited_by' => ['The invited by field is required when you are not a salvationist.']
                ]);
            }

            if (empty($validatedData['mobile_number'])) {
                throw ValidationException::withMessages([
                    'mobile_number' => ['Mobile number is required when you are not a salvationist.']
                ]);
            }

            if (!preg_match('/^(09\d{9}|\+639\d{9})$/', $validatedData['mobile_number'])) {
                throw ValidationException::withMessages([
                    'mobile_number' => ['Please enter a valid Philippine mobile number (e.g., 09123456789 or +639123456789).']
                ]);
            }
        }

        if (!empty($validatedData['birthday']) && !empty($validatedData['age'])) {
            $birthday = new \DateTime($validatedData['birthday']);
            $today = new \DateTime();
            $calculatedAge = $today->diff($birthday)->y;

            if (abs($calculatedAge - $validatedData['age']) > 1) {
                throw ValidationException::withMessages([
                    'age' => ["Age does not match your birthday."]
                ]);
            }
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

    public function getCount(): JsonResponse
    {
        $count = Registration::count();

        return response()->json([
            'count' => $count
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Registration::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('invited_by', 'like', "%{$search}%")
                  ->orWhere('salvationist', 'like', "%{$search}%");
            });
        }

        $query->orderBy('created_at', 'desc');
        
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
    
    public function generateUids(): JsonResponse
    {
        $registrations = Registration::whereNull('uid')->get();
        $count = 0;
        
        foreach ($registrations as $registration) {
            $registration->uid = Registration::generateUniqueUid();
            $registration->save();
            $count++;
        }
        
        $emptyUidRegistrations = Registration::where('uid', '')->get();
        foreach ($emptyUidRegistrations as $registration) {
            $registration->uid = Registration::generateUniqueUid();
            $registration->save();
            $count++;
        }
        
        return response()->json([
            'message' => "Successfully generated UIDs for {$count} registrations.",
            'count' => $count
        ]);
    }
    
    public function getByUid(string $uid): JsonResponse
    {
        $registration = Registration::where('uid', $uid)->first();
        
        if (!$registration) {
            return response()->json([
                'message' => 'Registration not found.'
            ], 404);
        }
        
        return response()->json([
            'data' => $registration
        ]);
    }
}
