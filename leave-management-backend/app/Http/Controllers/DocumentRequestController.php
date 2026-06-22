<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DocumentRequestController extends Controller
{
     public function store(Request $request)
    {
        $data = $request->validate([
            'document_id' => 'required|exists:documents,id',
            'reason'      => 'nullable|string|max:500',
        ]);

        $user = auth()->user();

        $id = DB::table('document_requests')->insertGetId([
            'user_id'     => $user->id,
            'document_id' => $data['document_id'],
            'reason'      => $data['reason'] ?? null,
            'status'      => 'pending',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        $hr = DB::table('users')->where('role', 'hr')->first();
        if ($hr) {
            $document = DB::table('documents')->where('id', $data['document_id'])->value('name');
            DB::table('notifications')->insert([
                'user_id'             => $hr->id,
                'document_request_id' => $id,
                'type'                => 'leave_submitted', // reuse as generic "submitted"
                'message'             => "{$user->name} requested a document: {$document}.",
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);
        }

        return response()->json(['message' => 'Document request submitted.'], 201);
    }
}
