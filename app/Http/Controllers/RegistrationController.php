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
    
    public function exportExcel()
    {
        // Get all registrations
        $registrations = Registration::orderBy('created_at', 'desc')->get();
        
        // Create a temporary file
        $fileName = 'registrations_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        // Convert the collection to an array with proper headers
        $data = [];
        $data[] = [
            'UID',
            'Name',
            'Email',
            'Birthday',
            'Age',
            'Invited By',
            'Salvationist',
            'Mobile Number',
            'Created At'
        ];
        
        foreach ($registrations as $registration) {
            $data[] = [
                $registration->uid,
                $registration->name,
                $registration->email,
                $registration->birthday ? $registration->birthday->format('Y-m-d') : '',
                $registration->age,
                $registration->invited_by,
                $registration->salvationist,
                $registration->mobile_number,
                $registration->created_at ? $registration->created_at->format('Y-m-d H:i:s') : ''
            ];
        }
        
        // Create the Excel file using PHP Spreadsheet directly
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Add the data to the sheet
        $sheet->fromArray($data, null, 'A1');
        
        // Set column widths
        $sheet->getColumnDimension('A')->setWidth(20); // ID
        $sheet->getColumnDimension('B')->setWidth(25); // Name
        $sheet->getColumnDimension('C')->setWidth(30); // Email
        $sheet->getColumnDimension('D')->setWidth(15); // Birthday
        $sheet->getColumnDimension('E')->setWidth(10); // Age
        $sheet->getColumnDimension('F')->setWidth(20); // Invited By
        $sheet->getColumnDimension('G')->setWidth(15); // Salvationist
        $sheet->getColumnDimension('H')->setWidth(15); // Mobile Number
        $sheet->getColumnDimension('I')->setWidth(15); // UID
        $sheet->getColumnDimension('J')->setWidth(20); // Created At
        
        // Set header row style
        $headerStyle = [
            'font' => [
                'bold' => true,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => [
                    'rgb' => 'E6E6E6',
                ],
            ],
        ];
        
        $sheet->getStyle('A1:J1')->applyFromArray($headerStyle);
        
        // Create the writer
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        
        // Save to temporary file
        $tempFile = tempnam(sys_get_temp_dir(), 'registration_export_');
        $writer->save($tempFile);
        
        // Return the file as a download response
        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }
    
    public function updateAttendance(Request $request, int $id): JsonResponse
    {
        $registration = Registration::findOrFail($id);
        
        // Update the attendance status
        $registration->is_attended = true;
        $registration->save();
        
        // Add 100 points with header id 0 to the user_side_quest_points table
        \App\Models\UserSideQuestPoint::create([
            'uid' => $registration->uid,
            'side_quest_header_id' => 0,
            'points' => 100,
        ]);
        
        return response()->json([
            'message' => 'Attendance updated and points awarded successfully',
            'data' => $registration
        ]);
    }
}
