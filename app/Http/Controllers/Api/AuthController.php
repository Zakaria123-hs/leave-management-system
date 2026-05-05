<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // STEP 1: Validation
        // We ensure the user actually sent an email and password string.
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // STEP 2: Find the User
        // We look for the user record in the database.
        $user = User::where('email', $request->email)->first();
        

        // STEP 3: Verification
        // Check if user exists AND if the password matches the hashed version in DB.
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401); // 401 means Unauthorized
        }

        // STEP 4: Create Token
        // This is where the 'HasApiTokens' trait works its magic.
        $token = $user->createToken('auth_token')->plainTextToken;

        // STEP 5: Return Response
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 200);
    }
}
