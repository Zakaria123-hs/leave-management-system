<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    use HasFactory;

    protected $fillable = ['label_doc'];

    /**
     * Get all requests made for this specific type of document.
     */
    public function requests(): HasMany
    {
        return $this->hasMany(RequestDocument::class, 'document_id');
    }
}