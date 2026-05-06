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
            'end_date'      => 'required|date|after:start_date',
            'reason'        => 'nullable|string|max:500',
        ]);

        if ($validate->fails()) {
            return response()->json(['errors' => $validate->errors()], 422);
        }

        // check if imployee have request during these dates
        $isOverlap = DB::table('leave_requests')
            ->where('user_id', auth()->id()) 
            ->whereIn('status', ['pending', 'approved']) 
            ->where('start_date', '<=', $request->end_date) 
            ->where('end_date', '>=', $request->start_date) 
            ->exists(); // Returns true or false

        if ($isOverlap) {
            return response()->json(["error" => "You already have a request during these dates" ], 400);
        }

        //this function to count days exclude holidays and weekend
        $days_count = $this->count_days($request->start_date, $request->end_date);

        // 1. Use value() to get the actual boolean/number
        $is_balance_based = DB::table('leave_types')
            ->where('id', $request->leave_type_id)
            ->value('is_balance_based');

        if($is_balance_based) {

            $user_balance = DB::table('leave_balances') 
                ->where('user_id', auth()->id())
                ->where('leave_type_id', $request->leave_type_id)
                ->value('remaining_days');

            if (is_null($user_balance)) {
                return response()->json(['error' => 'No balance found for this leave type'], 400);
            }

            $pending_days = DB::table('leave_requests')
                ->where('user_id', auth()->id())
                ->where('leave_type_id', $request->leave_type_id)
                ->where('status', 'pending')
                ->sum('days_count');

            if (($days_count + $pending_days) > $user_balance) {
                return response()->json(['error' => 'Your balance is insufficient'], 400);
            }
        }

        DB::table('leave_requests')->insert([
            'user_id'       => auth()->id(),
            'leave_type_id' => $request->leave_type_id,
            'start_date'    => $request->start_date,
            'end_date'      => $request->end_date,
            'days_count'    => $days_count,
            'reason'        => $request->reason,
            'status'        => 'pending',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        return response()->json(['message' => 'Leave request submitted successfully!'], 201);

    }
}
