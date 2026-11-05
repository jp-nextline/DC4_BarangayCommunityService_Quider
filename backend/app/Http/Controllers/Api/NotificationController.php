<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\AppNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->appNotifications();

        return NotificationResource::collection($query->latest()->paginate(10))
            ->additional(['unread_count' => (clone $query)->whereNull('read_at')->count()]);
    }

    public function markRead(Request $request, AppNotification $notification): NotificationResource
    {
        abort_unless($notification->user_id === $request->user()->id, 403, 'You do not have permission to do this.');

        $notification->update(['read_at' => $notification->read_at ?? now()]);

        return new NotificationResource($notification);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->appNotifications()->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }
}
