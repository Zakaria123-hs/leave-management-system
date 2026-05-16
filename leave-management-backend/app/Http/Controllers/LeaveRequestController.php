<?php

namespace App\Http\Controllers;
// 2 | 2 | 03.02.2026 | 09.02.2026 | 6
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LeaveRequestController extends Controller
{
    public function count_days($start_day, $end_day) {
        $start = \Carbon\Carbon::parse($start_day);
        $end = \Carbon\Carbon::parse($end_day);

        $period = \Carbon\CarbonPeriod::create($start, $end);
        $days_count = 0;

        foreach ($period as $date) {
            // 1. Skip weekends
            if ($date->isWeekend()) {
                continue;
            }

            // 2. Check holiday (ensure format is exactly YYYY-MM-DD)
            $formattedDate = $date->toDateString(); 
            
            $isHoliday = DB::table('holidays')
                ->whereDate('date', $formattedDate)
                ->exists();

            if ($isHoliday) {
                continue; // Skip this day if it's a holiday
            }

            $days_count++;
        }

        return $days_count;
    }

    public function store(Request $request) {
        $manager= DB::table('users')
            ->where('role','manager')
            ->first();
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

        $leave_request_id = DB::table('leave_requests')->insertGetId([
            'user_id'       => auth()->id(),
            'leave_type_id' => $request->leave_type_id,
            'start_date'    => $request->start_date,
            'end_date'      => $request->end_date,
            'days_count'    => $days_count,
            'reason'        => $request->reason,
            'status'        => 'pending',
            'manager_id'    => $manager->id,
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        DB::table('notifications')->insert([
            'user_id' => $manager->id,
            'leave_request_id' => $leave_request_id,
            'type' => 'leave_created',
            'message' => 'Employee submitted a new leave request',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Leave request submitted successfully!'], 201);

    }

    public function leaveRequests() {
        $requests = DB::table('leave_requests')
            ->leftJoin('users', 'users.id', '=', 'leave_requests.manager_id')
            ->join('leave_types', 'leave_requests.leave_type_id', '=', 'leave_types.id')
            ->where('leave_requests.user_id', auth()->id())
            ->select(
                'leave_types.name as leave_type',
                'leave_requests.created_at',
                'leave_requests.status',
                'leave_requests.reason',
                'users.name as approved_by'
            )
            ->orderBy('leave_requests.created_at', 'desc')
            ->get();

        return response()->json(['my_requests' => $requests]);
    }

    public function myBalances() {
        $balance = DB::table('leave_balances')
            ->join('leave_types', 'leave_balances.leave_type_id', '=', 'leave_types.id')
            ->where('leave_balances.user_id', auth()->id())
            ->select(
                'leave_types.name as leave_type',
                'leave_balances.remaining_days',
                'leave_balances.used_days'
            )
            ->get();
        return response()->json(['myBalance' => $balance]);
    }
}
