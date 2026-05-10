<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HRLeaveContoller extends Controller
{
    public function hrReport() {
        $report = DB::table('leave_requests')
            ->join('users as employees', 'leave_requests.user_id', '=', 'employees.id')
            ->join('users as managers', 'leave_requests.manager_id', '=', 'managers.id')
            ->join('leave_types', 'leave_requests.leave_type_id', '=', 'leave_types.id')
            
            ->where('leave_requests.status', 'approved') 
            
            ->orderBy('leave_requests.start_date', 'desc') 
            
            ->select(
                'employees.name as employee_name',
                'leave_types.name as leave_type',
                'leave_requests.start_date',
                'leave_requests.end_date',
                'leave_requests.days_count',
                'managers.name as approved_by'
            )
            ->get();

        return response()->json(['hr_report' => $report]);
    } 
}
