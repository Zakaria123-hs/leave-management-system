<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::table('leave_requests', function (Blueprint $table) {
        // 1. drop the foreign key first
        $table->dropForeign(['manager_id']);
        
        // 2. rename
        $table->renameColumn('manager_id', 'supervisor_id');
    });

    Schema::table('leave_requests', function (Blueprint $table) {
        // 3. re-add the foreign key with new name
        $table->foreign('supervisor_id')->references('id')->on('users')->onDelete('set null');
    });
}

public function down(): void
{
    Schema::table('leave_requests', function (Blueprint $table) {
        $table->dropForeign(['supervisor_id']);
        $table->renameColumn('supervisor_id', 'manager_id');
    });

    Schema::table('leave_requests', function (Blueprint $table) {
        $table->foreign('manager_id')->references('id')->on('users')->onDelete('set null');
    });
}
};
