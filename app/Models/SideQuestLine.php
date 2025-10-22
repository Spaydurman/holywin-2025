<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SideQuestLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'header_id',
        'input',
        'placeholder',
        'is_question',
        'answer',
        'validation_rule',
        'order',
    ];

    protected $casts = [
        'header_id' => 'integer',
        'is_question' => 'boolean',
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function header()
    {
        return $this->belongsTo(SideQuestHeader::class, 'header_id');
    }
}