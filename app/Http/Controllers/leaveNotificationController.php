<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class leaveNotificationController extends Controller
{
    public function myNotifications() {
    $notifications = DB::table('notifications')
        ->where('user_id', auth()->id()) // Filter for the logged-in user
        ->orderBy('created_at', 'desc')   // Newest notifications at the top
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
}
