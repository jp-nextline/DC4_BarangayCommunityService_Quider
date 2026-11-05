<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceRequestResource;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /** Admin sees figures for all requests; a resident sees figures for their own. */
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $scope = fn () => ServiceRequest::query()->when(! $user->isAdmin(), fn ($q) => $q->where('user_id', $user->id));

        $counts = $scope()->selectRaw("
            COUNT(*) AS total,
            COALESCE(SUM(status = 'pending'), 0) AS pending,
            COALESCE(SUM(status = 'approved'), 0) AS approved,
            COALESCE(SUM(status = 'rejected'), 0) AS rejected,
            COALESCE(SUM(status = 'completed'), 0) AS completed
        ")->first();

        $byCategory = $scope()
            ->join('service_categories as c', 'c.id', '=', 'service_requests.service_category_id')
            ->selectRaw('c.name, COUNT(*) AS total')
            ->groupBy('c.name')
            ->orderByDesc('total')
            ->get();

        return response()->json(['data' => [
            'total' => (int) $counts->total,
            'pending' => (int) $counts->pending,
            'approved' => (int) $counts->approved,
            'rejected' => (int) $counts->rejected,
            'completed' => (int) $counts->completed,
            'this_month' => $scope()->whereYear('created_at', now()->year)->whereMonth('created_at', now()->month)->count(),
            'by_category' => $byCategory,
            'recent' => ServiceRequestResource::collection(
                $scope()->with(['category', 'user'])->latest()->limit(5)->get()
            )->resolve(),
        ]]);
    }
}
