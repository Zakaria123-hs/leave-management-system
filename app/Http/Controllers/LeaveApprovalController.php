<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

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
                    ->lockForUpdate()
                    ->first();

                if (!$balance) {
                    abort(400, 'No balance found');
                }

                if ($balance->remaining_days < $leaveRequest->days_count) {
                    abort(400, 'Insufficient balance');
                }

                DB::table('leave_balances')
                    ->where('id', $balance->id)
                    ->update([
                        'remaining_days' => $balance->remaining_days - $leaveRequest->days_count
                    ]);
            }

            DB::table('leave_requests')->where('id', $id)->update([
                'status' => 'approved',
                'manager_id' => auth()->id(),
                'approved_at' => now(),
                'updated_at' => now()
            ]);

            $this->notification(
                $leaveRequest->user_id,
                $leaveRequest->id,
                'leave_approved',
                'Your leave request has been approved'
            );
            return response()->json(['message' => 'Approved']);
        });
    }

    public function reject($id)
    {
        return DB::transaction(function () use ($request, $id) {

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

            DB::table('leave_requests')->where('id', $id)->update([
                'status' => 'rejected',
                'manager_id' => auth()->id(),
                'rejected_at' => now(),
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


    public function pendingRequests() {
        $pending_req = DB::table('leave_requests')
            ->join('users', 'leave_requests.user_id', '=', 'users.id')
            ->join('leave_types', 'leave_requests.leave_type_id', '=', 'leave_types.id')
            ->where('leave_requests.status', 'pending') 
            ->orderBy('leave_requests.created_at', 'desc')
            ->select(
                'leave_requests.*', 
                'users.name as employee_name', 
                'leave_types.name as leave_type_label'
            )
            ->get();
        
        return response()->json(['pending_requests' => $pending_req]);
    }

}