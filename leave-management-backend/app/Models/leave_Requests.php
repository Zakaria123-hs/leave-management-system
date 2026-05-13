<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model {
    protected $fillable = ['user_id', 'leave_type_id', 'start_date', 'end_date', 'days_count', 'status', 'manager_id', 'reason'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function leaveType() {
        return $this->belongsTo(LeaveType::class);
    }

    // Relationship to see who the manager is for this specific request
    public function manager() {
        return $this->belongsTo(User::class, 'manager_id');
    }
}