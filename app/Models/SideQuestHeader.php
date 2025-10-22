<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SideQuestHeader extends Model
{
    use HasFactory;

    protected $fillable = [
        'question',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function lines()
    {
        return $this->hasMany(SideQuestLine::class, 'header_id');
    }
}