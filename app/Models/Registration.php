<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Registration extends Model
{
    use HasFactory;
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($registration) {
            $registration->uid = static::generateUniqueUid();
        });
    }
    
    public static function generateUniqueUid()
    {
        do {
            $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $uid = 'LVLUP';
            
            for ($i = 0; $i < 4; $i++) {
                $uid .= $characters[rand(0, strlen($characters) - 1)];
            }
        } while (static::where('uid', $uid)->exists());
        
        return $uid;
    }

    protected $fillable = [
        'name',
        'email',
        'birthday',
        'age',
        'invited_by',
        'salvationist',
        'mobile_number',
        'uid',
    ];

    protected $casts = [
        'birthday' => 'date',
        'salvationist' => 'string',
    ];
}
