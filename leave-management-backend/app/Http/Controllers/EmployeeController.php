<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = DB::table('users')
            ->leftJoin('services', 'users.service_id', '=', 'services.id')
            ->leftJoin('users as supervisors', 'users.supervisor_id', '=', 'supervisors.id')
            ->select(
                'users.id', 'users.name', 'users.email', 'users.role',
                'users.hired_at', 'users.level',
                'services.name as service',
                'supervisors.name as supervisor',
            )
            ->orderBy('users.name')
            ->get();

        return response()->json(['employees' => $employees]);
    }
}
