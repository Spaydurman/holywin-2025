<?php

namespace Database\Seeders;

use App\Models\SideQuestHeader;
use App\Models\SideQuestLine;
use Illuminate\Database\Seeder;

class SideQuestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define all the side quests with their questions and input requirements
        $sideQuests = [
            [
                'question' => 'Meet someone you dont know',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_name_exist',
                        'points' => 10
                    ],
                    [
                        'input_type' => 'date',
                        'placeholder' => 'Enter Birthday',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_bday_is_correct',
                        'points' => 10
                    ]
                ]
            ],
            [
                'question' => 'Find Ate Sweet',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Ate Sweet Code',
                        'is_question' => 'true',
                        'validation_rule' => 'required',
                        'answer' => 'SWEET2025',
                        'points' => 30
                    ]
                ]
            ],
            [
                'question' => 'Find Kuya Jigs',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Kuya Jigs Code',
                        'is_question' => true,
                        'validation_rule' => 'required',
                        'answer' => 'JIGGER',
                        'points' => 30
                    ]
                ]
            ],
            [
                'question' => 'Find Kuya Jabin',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Kuya Jabin Code',
                        'is_question' => true,
                        'validation_rule' => 'required',
                        'answer' => 'JABIN',
                        'points' => 30
                    ]
                ]
            ],
            [
                'question' => 'Find Kuya JC',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Kuya JC Code',
                        'is_question' => true,
                        'validation_rule' => 'required',
                        'answer' => 'SPAYDURMAN',
                        'points' => 30
                    ]
                ]
            ],
            [
                'question' => 'Find someone whose costume is from a game you know',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_name_exist',
                        'points' => 15
                    ]
                ]
            ],
            [
                'question' => 'Find the person wearing the brightest outfit',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name (Registered Name)',
                        'is_question' => false,
                        'validation_rule' => 'validate_same_bday',
                        'points' => 15
                    ]
                ]
            ],
            [
                'question' => 'Find someone whose birthday month is the same as yours',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_name_exist',
                        'points' => 15
                    ],
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Month',
                        'is_question' => false,
                        'validation_rule' => 'validate_same_bday',
                        'points' => 10
                    ]
                ]
            ],
            [
                'question' => 'Find someone who can quote a Bible verse from memory',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_name_exist',
                        'points' => 15
                    ],
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Verse',
                        'is_question' => false,
                        'validation_rule' => 'required',
                        'points' => 10
                    ]
                ]
            ],
            [
                'question' => 'Find someone with a costume that matches your color',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_name_exist',
                        'points' => 15
                    ],
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Color',
                        'is_question' => false,
                        'validation_rule' => 'required',
                        'points' => 10
                    ]
                ]
            ],
            [
                'question' => 'Find someone who attended last year’s Holywin',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_name_exist',
                        'points' => 20
                    ]
                ]
            ],
            [
                'question' => 'Find someone who can make you laugh',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_name_exist',
                        'points' => 10
                    ]
                ]
            ],
            [
                'question' => 'Meet someone whose name starts with the same letter as yours',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_name_exist',
                        'points' => 15
                    ]
                ]
            ],
            [
                'question' => 'Find someone who plays a musical instrument',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Name',
                        'is_question' => false,
                        'validation_rule' => 'validate_if_name_exist',
                        'points' => 15
                    ]
                ]
            ],
            [
                'question' => 'What is the theme verse of the event?',
                'lines' => [
                    [
                        'input_type' => 'text',
                        'placeholder' => 'Enter Bible Verse Reference',
                        'is_question' => true,
                        'answer' => 'Philippians 3:14',
                        'validation_rule' => 'required',
                        'points' => 50
                    ]
                ]
            ]
        ];

        foreach ($sideQuests as $questData) {
            $header = SideQuestHeader::create([
                'question' => $questData['question']
            ]);

            foreach ($questData['lines'] as $lineData) {
                SideQuestLine::create([
                    'header_id' => $header->id,
                    'input_type' => $lineData['input_type'],
                    'placeholder' => $lineData['placeholder'],
                    'is_question' => $lineData['is_question'],
                    'validation_rule' => $lineData['validation_rule'],
                    'answer' => $lineData['answer'] ?? null,
                    'points' => $lineData['points']
                ]);
            }
        }
    }
}