<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\LeaveBalance;  
use App\Models\LeaveRequest;

class leaveType extends Model
{
    protected $fillable = ['name','is_balance_based'];

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function leaveBalances()
    {
        return $this->hasMany(LeaveBalance::class);
    }
}
