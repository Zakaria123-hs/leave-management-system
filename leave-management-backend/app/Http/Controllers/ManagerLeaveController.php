<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request; // 💡 Included for safety

class ManagerLeaveController extends Controller
{
    public function notification($userId, $leaveRequestId, $type, $message)
    {
        DB::table('notifications')->insert([
            'user_id' => $userId,
            'leave_request_id' => $leaveRequestId,
            'type' => $type,
            'message' => $message,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function approve($id)
    {
        return DB::transaction(function () use ($id) {
            $leaveRequest = DB::table('leave_requests')
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            if (!$leaveRequest) {
                abort(404, 'Request not found');
            }

            if ($leaveRequest->status !== 'pending') {
                abort(400, 'Already processed');
            }

            $leaveType = DB::table('leave_types')
                ->where('id', $leaveRequest->leave_type_id)
                ->first();

            if ($leaveType && $leaveType->is_balance_based) {
                $balance = DB::table('leave_balances')
                    ->where('user_id', $leaveRequest->user_id)
                    ->where('leave_type_id', $leaveRequest->leave_type_id)
                    ->first();

                if (!$balance) {
                    abort(400, 'No balance found');
                }

                if ($balance->remaining_days < $leaveRequest->days_count) {
                    abort(400, 'Insufficient balance');
                }
            }

            // Update status to pending_hr
            DB::table('leave_requests')->where('id', $id)->update([
                'status' => 'pending_hr',
                'supervisor_id' => auth()->id(),
                'updated_at' => now()
            ]);

            $employee = DB::table('users')->where('id', $leaveRequest->user_id)->first();

            $this->notification(
                $leaveRequest->user_id,
                $leaveRequest->id,
                'leave_approved_by_supervisor',
                'Your leave request has been approved by your manager and is awaiting final HR validation.'
            );

            $hrManagers = DB::table('users')
                ->where('id_service', $employee->id_service)
                ->where('role', 'hr')
                ->get();

            foreach ($hrManagers as $hr) {
                DB::table('notifications')->insert([
                    'user_id' => $hr->id,
                    'leave_request_id' => $id,
                    'type' => 'pending_hr_validation',
                    'message' => "A new leave request from {$employee->name} requires your final approval.",
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            return response()->json(['message' => 'Approved by supervisor, HR notified.']);
        });
    }

    public function reject($id)
    {
        // 💡 FIXED: Removed undefined $request reference from the transaction closure closure
        return DB::transaction(function () use ($id) {

            $leaveRequest = DB::table('leave_requests')
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            if (!$leaveRequest) {
                return response()->json(['error' => 'Request not found'], 404);
            }

            if ($leaveRequest->status !== 'pending') {
                return response()->json(['error' => 'Already processed'], 400);
            }

            // 💡 FIXED: Updated target key to 'supervisor_id' to prevent MariaDB column mismatch errors
            DB::table('leave_requests')->where('id', $id)->update([
                'status' => 'rejected',
                'supervisor_id' => auth()->id(), 
                'updated_at' => now(),
            ]);

            $this->notification(
                $leaveRequest->user_id,
                $leaveRequest->id,
                'leave_rejected',
                'Your leave request has been rejected'
            );

            return response()->json(['message' => 'Rejected successfully']);
        });
    }

    public function pendingRequests() 
    {
        // 💡 FIXED: Rewritten entirely using DB::table and Joins to clear model reference crashes
        $pending_req = DB::table('leave_requests')
            ->join('users', 'leave_requests.user_id', '=', 'users.id')
            ->join('leave_types', 'leave_requests.leave_type_id', '=', 'leave_types.id')
            ->where('leave_requests.status', 'pending')
            ->where('leave_requests.supervisor_id', auth()->id())
            ->select(
                'leave_requests.*',
                'users.name as employee_name',
                'leave_types.name as leave_type_label'
            )
            ->orderBy('leave_requests.created_at', 'desc')
            ->get();
            
        // 💡 Returns structure directly to keep mapping intact with SupervisorPendingTable.jsx
        return response()->json(['pending_req'=>$pending_req]);
    }
}