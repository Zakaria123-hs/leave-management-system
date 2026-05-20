<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class service extends Model
{
    protected $fillable = ['name', 'min_ctive_staff'];
    public function users()
    {
        return $this->hasMany(User::class, 'id_service');
    }
}
