<?php

namespace App\Http\Controllers;

use App\Models\SideQuestHeader;
use App\Models\SideQuestLine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SideQuestController extends Controller
{
    public function index()
    {
        $headers = SideQuestHeader::with('lines')->get();
        
        return Inertia::render('SideQuest', [
            'headers' => $headers,
        ]);
    }
    
    public function show(SideQuestHeader $sideQuestHeader)
    {
        $header = SideQuestHeader::with('lines')->findOrFail($sideQuestHeader->id);
        
        return response()->json($header);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'headers' => 'required|array',
            'headers.*.question' => 'required|string|max:255',
            'headers.*.lines' => 'array',
        ]);

        Log::info('Storing side quests', $data);
        foreach ($data['headers'] as $headerData) {
            $header = SideQuestHeader::create([
                'question' => $headerData['question'],
            ]);

            foreach ($headerData['lines'] as $line) {
                SideQuestLine::create([
                    'header_id' => $header->id,
                    'input_type' => $line['input_type'],
                    'placeholder' => $line['placeholder'],
                    'is_question' => $line['is_question'],
                    'validation_rule' => $line['validation_rule'],
                ]);
            }
        }

        return response()->json(['message' => 'Side quests saved successfully!'], 201);
    }

    public function storeHeader(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:255',
        ]);

        $header = SideQuestHeader::create([
            'question' => $request->question,
        ]);

        return response()->json($header, 201);
    }

    public function updateHeader(Request $request, SideQuestHeader $header)
    {
        $request->validate([
            'question' => 'required|string|max:255',
        ]);

        $header->update([
            'question' => $request->question,
        ]);

        return response()->json($header);
    }

    public function destroyHeader(SideQuestHeader $header)
    {
        $header->delete();

        return response()->json(['message' => 'Header deleted successfully']);
    }

    public function storeLine(Request $request)
    {
        $request->validate([
            'header_id' => 'required|exists:side_quest_headers,id',
            'input' => 'required|string|max:255',
            'placeholder' => 'nullable|string|max:255',
            'is_question' => 'boolean',
            'validation_rule' => 'nullable|string|max:255',
            'order' => 'integer',
        ]);

        $line = SideQuestLine::create([
            'header_id' => $request->header_id,
            'input' => $request->input,
            'placeholder' => $request->placeholder,
            'is_question' => $request->is_question ?? false,
            'validation_rule' => $request->validation_rule,
            'order' => $request->order ?? 0,
        ]);

        return response()->json($line, 201);
    }

    public function updateLine(Request $request, SideQuestLine $line)
    {
        $request->validate([
            'header_id' => 'required|exists:side_quest_headers,id',
            'input' => 'required|string|max:255',
            'placeholder' => 'nullable|string|max:255',
            'is_question' => 'boolean',
            'validation_rule' => 'nullable|string|max:255',
            'order' => 'integer',
        ]);

        $line->update([
            'header_id' => $request->header_id,
            'input' => $request->input,
            'placeholder' => $request->placeholder,
            'is_question' => $request->is_question ?? false,
            'validation_rule' => $request->validation_rule,
            'order' => $request->order ?? 0,
        ]);

        return response()->json($line);
    }

    public function destroyLine(SideQuestLine $line)
    {
        $line->delete();

        return response()->json(['message' => 'Line deleted successfully']);
    }

    public function validateSideQuest(Request $request)
    {
        $request->validate([
            'header_id' => 'required|exists:side_quest_headers,id',
            'inputs' => 'required|array',
            'inputs.*' => 'required|string'
        ]);

        $header = SideQuestHeader::with('lines')->findOrFail($request->header_id);
        $inputs = $request->inputs;
        $gameUser = session('game_user');

        if (!$gameUser) {
            return response()->json(['error' => 'Game user not authenticated'], 401);
        }

        $results = [];
        $validationErrors = [];

        foreach ($header->lines as $index => $line) {
            $inputValue = $inputs[$index] ?? null;
            $validationRule = $line->validation_rule;
            $isValid = true;
            $errorMessage = null;

            if ($validationRule === 'required' && empty($inputValue)) {
                $isValid = false;
                $errorMessage = 'This field is required';
            } elseif ($validationRule === 'validate_if_same_invited_by') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'This field is required';
                } else {
                    // Check if the input name is the same as invited_by using uid
                    $isValid = $inputValue === $gameUser['invited_by'];
                    if (!$isValid) {
                        $errorMessage = 'The name must match your invited by field';
                    }
                }
            } elseif ($validationRule === 'validate_code') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'This field is required';
                } else {
                    // Check if the input is a valid UID or existing UID
                    $isValid = \App\Models\Registration::where('uid', $inputValue)->exists();
                    if (!$isValid) {
                        $errorMessage = 'Invalid UID code';
                    }
                }
            } elseif ($validationRule === 'validate_if_name_exist') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'This field is required';
                } else {
                    // Check if the name exists in the registration table and invited_by is not the same as user
                    $registration = \App\Models\Registration::where('name', $inputValue)->first();
                    if (!$registration) {
                        $isValid = false;
                        $errorMessage = 'Name does not exist in the registration table';
                    } elseif ($registration->name === $gameUser['name']) {
                        $isValid = false;
                        $errorMessage = 'You cannot use your own name';
                    } elseif ($registration->invited_by === $gameUser['invited_by']) {
                        $isValid = false;
                        $errorMessage = 'The invited by field is the same as yours';
                    }
                }
            } elseif ($validationRule === 'validate_if_bday_is_correct') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'This field is required';
                } else {
                    // Check if the inputted birthday is correct based on other input
                    // This validation would typically require a reference to another input field
                    // For now, we'll assume it's validated against the registration table
                    $nameIndex = $header->lines->search($line) - 1; // Previous input should be name
                    if ($nameIndex >= 0) {
                        $nameValue = $inputs[$nameIndex] ?? null;
                        if ($nameValue) {
                            $registration = \App\Models\Registration::where('name', $nameValue)->first();
                            if ($registration && $registration->birthday) {
                                $isValid = $inputValue === $registration->birthday->format('Y-m-d');
                                if (!$isValid) {
                                    $errorMessage = 'Birthday does not match the registered birthday';
                                }
                            } else {
                                $isValid = false;
                                $errorMessage = 'Could not find birthday for the given name';
                            }
                        } else {
                            $isValid = false;
                            $errorMessage = 'No name provided to validate birthday against';
                        }
                    } else {
                        $isValid = false;
                        $errorMessage = 'Cannot validate birthday without a name';
                    }
                }
            } elseif ($validationRule === 'validate_same_bday') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'This field is required';
                } else {
                    // Check if the user has the same birthday month as the name inputted
                    $nameIndex = $header->lines->search($line) - 1; // Previous input should be name
                    if ($nameIndex >= 0) {
                        $nameValue = $inputs[$nameIndex] ?? null;
                        if ($nameValue) {
                            $registration = \App\Models\Registration::where('name', $nameValue)->first();
                            if ($registration && $registration->birthday) {
                                $inputBirthday = \Carbon\Carbon::parse($inputValue);
                                $userBirthday = \Carbon\Carbon::parse($gameUser['birthday']);
                                $isValid = $inputBirthday->month === $userBirthday->month;
                                if (!$isValid) {
                                    $errorMessage = 'The birthday month does not match your birthday month';
                                }
                            } else {
                                $isValid = false;
                                $errorMessage = 'Could not find birthday for the given name';
                            }
                        } else {
                            $isValid = false;
                            $errorMessage = 'No name provided to validate birthday month against';
                        }
                    } else {
                        // If there's no previous name field, check if the input matches the user's birthday month
                        $userBirthday = \Carbon\Carbon::parse($gameUser['birthday']);
                        $inputBirthday = \Carbon\Carbon::parse($inputValue);
                        $isValid = $inputBirthday->month === $userBirthday->month;
                        if (!$isValid) {
                            $errorMessage = 'The birthday month does not match your birthday month';
                        }
                    }
                }
            }

            $results[] = [
                'line_id' => $line->id,
                'is_valid' => $isValid,
                'error_message' => $errorMessage,
                'validation_rule' => $validationRule
            ];

            if (!$isValid) {
                $validationErrors[] = $errorMessage;
            }
        }

        $allValid = count($validationErrors) === 0;

        return response()->json([
            'success' => $allValid,
            'results' => $results,
            'errors' => $validationErrors
        ], $allValid ? 200 : 422);
    }
}