<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestDocument extends Model
{
    use HasFactory;

    // Explicitly target the table layout from your diagram image_8dd1c9.png
    protected $table = 'requests_documents';

    protected $fillable = [
        'user_id',
        'document_id',
        'reason',
        'status',
        'rejection_reason'
    ];

    /**
     * Get the employee who created this document request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the specific document type requested.
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'document_id');
    }
}