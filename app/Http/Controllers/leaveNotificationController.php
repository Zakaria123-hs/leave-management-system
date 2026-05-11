<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class leaveNotificationController extends Controller
{
    public function myNotifications() {
        $notifications = DB::table('notifications')
            ->where('user_id', auth()->id()) 
            ->orderBy('created_at', 'desc')   
            ->select(
                'message',
                'type',
                'read_at',
                'created_at'
            )
            ->get();

        return response()->json([
            'status' => 'success',
            'notifications' => $notifications
        ]);
    }
    public function readNotification($id) 
        {
            DB::table('notifications') 
                ->where('id', $id)
                ->where('user_id', auth()->id())
                ->update(['read_at' => now()]);
            return response()->json(['message' => 'Notification marked as read']);
        }
}
