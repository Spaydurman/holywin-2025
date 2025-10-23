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
}