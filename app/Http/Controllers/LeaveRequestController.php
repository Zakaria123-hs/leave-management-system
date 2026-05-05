<?php

namespace App\Http\Controllers;
// 2 | 2 | 03.02.2026 | 09.02.2026 | 6
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LeaveRequestController extends Controller
{
    public function count_days($start_day, $end_day){
        $start = Carbon::parse($start_day);
        $end = Carbon::parse($end_day);

        $workingDays = $start->diffInDaysFiltered(function (Carbon $date) {
            return !$date->isWeekend(); 
        }, $end) + 1;

        $holidayCount = DB::table('holidays')
            ->whereBetween('date', [$start_day, $end_day])
            ->whereRaw('DAYOFWEEK(date) NOT IN (1, 7)') // 1 = Sunday, 7 = Saturday
            ->count();

        $days_count = $workingDays - $holidayCount;
        return $days_count;
    }

    public function store(Request $request) {
        $validate = validator::make($request->all(),[
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date'    => 'required|date|after_or_equal:today',
            'end_date'      => 'required|date|after_or_equal:start_date',
            'reason'        => 'nullable|string|max:500',
        ]);

        $days_count = this->count_days($request->start_day, $request->end_day);
        
    }
}
