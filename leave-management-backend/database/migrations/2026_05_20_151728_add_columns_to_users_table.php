<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('level')->nullable()->after('role');
            $table->date('hired_at')->after('password');
            
            $table->unsignedBigInteger('id_service')->nullable()->after('level');
            $table->foreign('id_service')->references('id')->on('services')->onDelete('set null');

            $table->unsignedBigInteger('supervisor_id')->nullable()->after('id_service');
            $table->foreign('supervisor_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['id_service']);
            $table->dropForeign(['supervisor_id']);
            $table->dropColumn(['level', 'id_service', 'supervisor_id']);
        });
    }
};