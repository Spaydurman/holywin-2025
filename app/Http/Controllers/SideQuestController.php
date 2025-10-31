<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\SideQuestHeader;
use App\Models\SideQuestLine;
use App\Models\UserSideQuestPoint;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class SideQuestController extends Controller
{
    public function index()
    {
        $headers = SideQuestHeader::with('lines')->get();

        return Inertia::render('SideQuest', [
            'headers' => $headers,
        ]);
    }

    public function indexHeaders()
    {
        $page = request()->get('page', 1);
        $perPage = request()->get('per_page', 10);
        $search = request()->get('search', '');

        $query = SideQuestHeader::with('lines');

        if (!empty($search)) {
            $query->where('question', 'like', '%' . $search . '%');
        }

        $headers = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($headers);
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
                    'answer' => $line['answer'] ?? null,
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
        Log::info('Validating side quest', $request->all());
        $request->validate([
            'header_id' => 'required|exists:side_quest_headers,id',
            'inputs' => 'required|array',
            'inputs.*.value' => 'required|string',
            'inputs.*.validation_rule' => 'required|string',
            'inputs.*.input_type' => 'required|string',
            'inputs.*.placeholder' => 'required|string',
            'inputs.*.is_question' => 'required|boolean',
            'inputs.*.points' => 'required|integer'
        ]);

        $header = SideQuestHeader::with('lines')->findOrFail($request->header_id);
        $inputObjects = $request->inputs;
        $gameUser = session('game_user');

        if (!$gameUser) {
            return response()->json(['error' => 'Game user not authenticated'], 401);
        }

        $results = [];
        $validationErrors = [];

        foreach ($header->lines as $index => $line) {
            $inputObject = $inputObjects[$index] ?? null;
            $inputValue = $inputObject ? $inputObject['value'] : null;
            $validationRule = $inputObject ? $inputObject['validation_rule'] : $line->validation_rule;
            $isValid = true;
            $errorMessage = null;

            if ($validationRule === 'required') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'Oops! You forgot to fill this one. Don\'t leave me hanging!';
                } else if($inputValue === $line->answer) {
                    $isValid = true;
                } else if ($line->is_question === false ) {
                    $isValid = true;
                } else {
                    $isValid = false;
                    $errorMessage = 'Hmm, that doesn\'t seem quite right. Try again!';
                }
            } elseif ($validationRule === 'validate_if_same_invited_by') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'Oops! You forgot to fill this one. Don\'t leave me hanging!';
                } else {
                    // Check if the input name is the same as invited_by using uid
                    $isValid = $inputValue === $gameUser['invited_by'];
                    if (!$isValid) {
                        $errorMessage = 'This name doesn\'t match who invited you!';
                    }
                }
            } elseif ($validationRule === 'validate_code') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'Oops! You forgot to fill this one. Don\'t leave me hanging!';
                } else {
                    // Check if the input is a valid UID or existing UID
                    $isValid = Registration::where('uid', $inputValue)->exists();
                    if (!$isValid) {
                        $errorMessage = 'That UID doesn\'t ring a bell. Are you sure it\'s correct?';
                    }
                }
            } elseif ($validationRule === 'validate_if_name_exist') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'Oops! You forgot to fill this one. Don\'t leave me hanging!';
                } else {
                    // Check if the name exists in the registration table and invited_by is not the same as user
                    $registration = Registration::where('name', $inputValue)->first();
                    if (!$registration) {
                        $isValid = false;
                        $errorMessage = 'Hmm, I can\'t find that name. Maybe check the spelling?';
                    } elseif ($registration->name === $gameUser['name']) {
                        $isValid = false;
                        $errorMessage = 'Nice try! But you can\'t use your own name here.';
                    }
                }
            } elseif ($validationRule === 'validate_if_name_exist_same_inviter') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'Oops! You forgot to fill this one. Don\'t leave me hanging!';
                } else {
                    // Check if the name exists in the registration table and invited_by is not the same as user
                    $registration = Registration::where('name', $inputValue)->first();
                    if (!$registration) {
                        $isValid = false;
                        $errorMessage = 'Hmm, I can\'t find that name. Maybe check the spelling?';
                    } elseif ($registration->name === $gameUser['name']) {
                        $isValid = false;
                        $errorMessage = 'Nice try! But you can\'t use your own name here.';
                    } elseif ($registration->invited_by === $gameUser['invited_by']) {
                        $isValid = false;
                        $errorMessage = 'That person was invited by the same person as you';
                    }
                }
            } elseif ($validationRule === 'validate_if_bday_is_correct') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'Oops! You forgot to fill this one. Don\'t leave me hanging!';
                } else {
                    // Check if the inputted birthday is correct based on other input
                    // This validation would typically require a reference to another input field
                    // For now, we'll assume it's validated against the registration table
                    $nameIndex = $index - 1; // Previous input should be name
                    if ($nameIndex >= 0) {
                        $nameInputObject = $inputObjects[$nameIndex] ?? null;
                        $nameValue = $nameInputObject ? $nameInputObject['value'] : null;
                        if ($nameValue) {
                            $registration = Registration::where('name', $nameValue)->first();
                            if ($registration && $registration->birthday) {
                                $isValid = $inputValue === $registration->birthday->format('Y-m-d');
                                if (!$isValid) {
                                    $errorMessage = 'That birthday doesn\'t match what we have on file!';
                                }
                            } else {
                                $isValid = false;
                                $errorMessage = 'Sorry, couldn\'t find a birthday for that name!';
                            }
                        } else {
                            $isValid = false;
                            $errorMessage = 'I need a name first before I can check the birthday!';
                        }
                    } else {
                        $isValid = false;
                        $errorMessage = 'A name is needed to validate the birthday, my friend!';
                    }
                }
            } elseif ($validationRule === 'validate_same_bday') {
                if (empty($inputValue)) {
                    $isValid = false;
                    $errorMessage = 'Oops! You forgot to fill this one. Don\'t leave me hanging!';
                } else {
                    // Check if the user has the same birthday month as the name inputted
                    $nameIndex = $index - 1; // Previous input should be name
                    if ($nameIndex >= 0) {
                        $nameInputObject = $inputObjects[$nameIndex] ?? null;
                        $nameValue = $nameInputObject ? $nameInputObject['value'] : null;
                        if ($nameValue) {
                            $registration = Registration::where('name', $nameValue)->first();
                            if ($registration && $registration->birthday) {
                                $inputBirthday = Carbon::parse($inputValue);
                                $userBirthday = Carbon::parse($gameUser['birthday']);
                                $isValid = $inputBirthday->month === $userBirthday->month;
                                if (!$isValid) {
                                    $errorMessage = 'This person doesn\'t share your birthday month!';
                                }
                            } else {
                                $isValid = false;
                                $errorMessage = 'Sorry, couldn\'t find a birthday for that name!';
                            }
                        } else {
                            $isValid = false;
                            $errorMessage = 'I need a name first before I can check the birthday month!';
                        }
                    } else {
                        // If there's no previous name field, check if the input matches the user's birthday month
                        $userBirthday = Carbon::parse($gameUser['birthday']);
                        $inputBirthday = Carbon::parse($inputValue);
                        $isValid = $inputBirthday->month === $userBirthday->month;
                        if (!$isValid) {
                            $errorMessage = 'This birthday month doesn\'t match yours!';
                        }
                    }
                }
            }

            $results[] = [
                'line_id' => $line->id,
                'is_valid' => $isValid,
                'error_message' => $errorMessage,
                'validation_rule' => $validationRule,
                'input_value' => $inputValue
            ];
            if (!$isValid) {
                $validationErrors[] = $errorMessage;
            } else {
                $validationErrors[] = null;
            }
        }

        $allValid = count(array_filter($validationErrors, fn($v) => !is_null($v))) === 0;

        // If all validations pass, save the points to the user's account
        if ($allValid) {
            // Calculate total points for this side quest
            $totalPoints = 0;
            foreach ($header->lines as $index => $line) {
                $inputObject = $inputObjects[$index] ?? null;
                if ($inputObject) {
                    $totalPoints += (int) $inputObject['points'];
                }
            }

            // Save the points to the user's account
            UserSideQuestPoint::updateOrCreate(
                [
                    'uid' => $gameUser['uid'],
                    'side_quest_header_id' => $header->id,
                ],
                [
                    'points' => $totalPoints,
                ]
            );

            // Clear the cache for this user's completed side quests so it refreshes on the next visit
            $cacheKey = 'completed_side_quests_' . $gameUser['uid'];
            Cache::forget($cacheKey);
        }

        return response()->json([
            'success' => $allValid,
            'results' => $results,
            'errors' => $validationErrors,
            'total_points' => $allValid ? $totalPoints : 0
        ], $allValid ? 200 : 422);
    }

    public function getLeaderboard()
    {
        // Get total points for each user by summing their points from UserSideQuestPoint
        $leaderboard = UserSideQuestPoint::join('registrations', 'user_side_quest_points.uid', '=', 'registrations.uid')
            ->select(
                'registrations.name',
                \DB::raw('SUM(user_side_quest_points.points) as total_points')
            )
            ->groupBy('registrations.uid', 'registrations.name')
            ->orderBy('total_points', 'DESC')
            ->get();

        return response()->json($leaderboard);
    }
}
