<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSideQuestPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'side_quest_header_id',
        'points',
    ];

    protected $casts = [
        'side_quest_header_id' => 'integer',
        'points' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(Registration::class, 'uid', 'uid');
    }

    public function sideQuestHeader()
    {
        return $this->belongsTo(SideQuestHeader::class, 'side_quest_header_id');
    }
}