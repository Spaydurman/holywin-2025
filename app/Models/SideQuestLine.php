<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SideQuestLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'header_id',
        'input_type',
        'placeholder',
        'is_question',
        'answer',
        'validation_rule',
        'points',
    ];

    protected $casts = [
        'header_id' => 'integer',
        'is_question' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function header()
    {
        return $this->belongsTo(SideQuestHeader::class, 'header_id');
    }
}