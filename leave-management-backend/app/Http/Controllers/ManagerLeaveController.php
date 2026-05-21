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

            // 1. Check if it's awaiting supervisor review
            if ($leaveRequest->status !== 'pending') {
                abort(400, 'Already processed');
            }

            $leaveType = DB::table('leave_types')
                ->where('id', $leaveRequest->leave_type_id)
                ->first();

            // 💡 OPTIONAL SAFETYSIGNAL: We keep the balance read-check here 
            // just to warn the supervisor if the balance is insufficient,
            // BUT we remove the code that actually UPDATES and updates the table!
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

            // 2. Simply push the status to 'pending_hr' (Handing off to HR)
            DB::table('leave_requests')->where('id', $id)->update([
                'status' => 'pending_hr',
                'supervisor_id' => auth()->id(), // Saved from your MLD column schema
                'updated_at' => now()
                // 💡 Notice 'approved_at' is removed here because HR marks the final approval time!
            ]);

            // 3. Notify the employee that it passed step 1
            $this->notification(
                $leaveRequest->user_id,
                $leaveRequest->id,
                'leave_approved_by_supervisor',
                'Your leave request has been approved by your manager and is awaiting final HR validation.'
            );

            return response()->json(['message' => 'Approved by supervisor, sent to HR.']);
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
                'supervisor' => auth()->id(),
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
        $pending_req = LeaveRequest::with(['user', 'leaveType'])
        ->where('status', 'pending')
        ->where('supervisor_id', auth()->id())
        ->orderBy('created_at', 'desc')
        ->get();
        
        return response()->json($pending_req->map(function ($req) {
            return [
                'id'               => $req->id,
                'employee_name'    => $req->user->name,
                'leave_type_label' => $req->leaveType->name,
                'start_date'       => $req->start_date,
                'end_date'         => $req->end_date,
                'days_count'       => $req->days_count,
                'status'           => $req->status,
                'reason'           => $req->reason,
                'created_at'       => $req->created_at,
            ];
        }));
    }

}