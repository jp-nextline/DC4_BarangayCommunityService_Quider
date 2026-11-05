<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ServiceRequest extends Model
{
    use HasFactory;

    public const STATUSES = ['pending', 'approved', 'rejected', 'completed'];

    /** Status workflow: which statuses a request may move to next. */
    public const TRANSITIONS = [
        'pending' => ['approved', 'rejected'],
        'approved' => ['completed'],
        'rejected' => [],
        'completed' => [],
    ];

    protected $fillable = [
        'user_id', 'service_category_id', 'title', 'description', 'location',
        'status', 'reference_no', 'completed_at',
    ];

    protected function casts(): array
    {
        return ['completed_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::creating(function (ServiceRequest $request) {
            $request->reference_no ??= 'SR-'.now()->format('ymd').'-'.strtoupper(Str::random(4));
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function updates(): HasMany
    {
        return $this->hasMany(RequestUpdate::class)->latest();
    }

    public function canMoveTo(string $status): bool
    {
        return in_array($status, self::TRANSITIONS[$this->status] ?? [], true);
    }

    /** Keyword search + status/category filters. */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, function ($q, $term) {
                $q->where(fn ($q) => $q->where('title', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhere('reference_no', 'like', "%{$term}%"));
            })
            ->when($filters['status'] ?? null, fn ($q, $v) => $q->where('status', $v))
            ->when($filters['category_id'] ?? null, fn ($q, $v) => $q->where('service_category_id', $v));
    }
}
