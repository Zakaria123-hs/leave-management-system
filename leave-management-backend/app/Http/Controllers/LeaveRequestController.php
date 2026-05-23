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
        $user = auth()->user(); // Fetches currently logged in employee profile metadata

        // 1. Get the min_active_staff configuration limit for this specific service
        $service = DB::table('services')
            ->where('id', $user->id_service)
            ->first();

        if ($service) {
            // 2. Count how many total employees are registered in this service department
            $totalServiceStaff = DB::table('users')
                ->where('id_service', $user->id_service)
                ->count();

            // 3. Count how many distinct colleagues are already away OR holding a spot on these dates
            $activeOnLeave = DB::table('leave_requests')
                ->join('users', 'leave_requests.user_id', '=', 'users.id')
                ->where('users.id_service', $user->id_service)
                ->whereIn('leave_requests.status', ['approved', 'pending'])
                ->where('leave_requests.start_date', '<=', $request->end_date)
                ->where('leave_requests.end_date', '>=', $request->start_date)
                ->count(DB::raw('DISTINCT leave_requests.user_id')); // Counts unique staff members

            // 4. Calculate if adding THIS request drops the team layout below the minimum threshold
            $currentAvailableStaff = $totalServiceStaff - $activeOnLeave;

            if (($currentAvailableStaff - 1) < $service->min_active_staff) {
                return response()->json([
                    'error' => "Cannot submit request. Your service requires a minimum of {$service->min_active_staff} active employees on duty. Too many staff members have overlapping requests during this timeframe."
                ], 422);
            }
        }

        $user = auth()->user();

        $leave_request_id = DB::table('leave_requests')->insertGetId([
            'user_id'       => $user->id,
            'leave_type_id' => $request->leave_type_id,
            'start_date'    => $request->start_date,
            'end_date'      => $request->end_date,
            'days_count'    => $days_count,
            'reason'        => $request->reason,
            'status'        => 'pending',
            'supervisor_id' => $user->supervisor_id, // ← directly from user column
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        DB::table('notifications')->insert([
            'user_id' => $user->supervisor_id,
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
            // 1. FIXED: Join using supervisor_id instead of manager_id
            ->leftJoin('users', 'users.id', '=', 'leave_requests.supervisor_id')
            ->join('leave_types', 'leave_requests.leave_type_id', '=', 'leave_types.id')
            ->where('leave_requests.user_id', auth()->id())
            ->select(
                'leave_types.name as leave_type',
                'leave_requests.created_at',
                'leave_requests.status',
                'leave_requests.start_date', // Added for range display
                'leave_requests.end_date',
                'leave_requests.reason',
                'users.name as approved_by' // This will now correctly return the supervisor's name!
            )
            ->orderBy('leave_requests.created_at', 'desc')
            ->get();

        // Keeping your standard structural json wrap layout response
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
    public function employeeData() {
        // 1. Automatically grab the logged-in user's ID
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // 2. Fetch General Information & Service details (Removed the sites join)
        $employeeInfo = DB::table('users')
            ->leftJoin('services', 'users.id_service', '=', 'services.id')
            ->where('users.id', $userId)
            ->select(
                'users.name as employee_name',
                'users.role', 
                'users.email',
                'services.name as service_name'
            )
            ->first();

        if (!$employeeInfo) {
            return response()->json(['error' => 'Employee details not found'], 404);
        }

        // 3. Calculate Time Off Statistics for this authenticated user
        $leaveStats = DB::table('leave_requests')
            ->where('user_id', $userId)
            ->select(
                // Sum of days for fully validated/completed requests
                DB::raw("SUM(CASE WHEN status = 'approved' THEN days_count ELSE 0 END) as days_approved"),
                
                // Sum of days for ALL pending phases (awaiting manager OR awaiting HR validation)
                DB::raw("SUM(CASE WHEN status IN ('pending', 'pending_hr') THEN days_count ELSE 0 END) as days_awaiting_approval")
            )
            ->first();

        // 4. Get total remaining days across balances
        $totalRemainingDays = DB::table('leave_balances')
            ->where('user_id', $userId)
            ->sum('remaining_days');

        // 5. Build the final clean dataset for your frontend card element
        return response()->json([
            'general_info' => [
                'name'    => $employeeInfo->employee_name,
                'role'    => $employeeInfo->role,
                'email'   => $employeeInfo->email,
                'service' => $employeeInfo->service_name ?? 'N/A',
            ],
            'time_off' => [
                'days_approved'          => floatval($leaveStats->days_approved ?? 0),
                'days_awaiting_approval' => floatval($leaveStats->days_awaiting_approval ?? 0),
                'days_remaining'         => floatval($totalRemainingDays ?? 0),
            ]
        ]);
    }
}
