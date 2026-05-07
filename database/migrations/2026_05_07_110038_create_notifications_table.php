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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // who receives notification
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // related leave request
            $table->foreignId('leave_request_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade');

            // notification type (leave_created|leave_approved|leave_rejected)
            $table->string('type');

            // message shown to user
            $table->text('message');

            // null = unread
            $table->timestamp('read_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
