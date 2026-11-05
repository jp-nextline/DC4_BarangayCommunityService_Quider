<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequestRequest;
use App\Http\Requests\UpdateStatusRequest;
use App\Http\Resources\ServiceRequestResource;
use App\Models\AppNotification;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ServiceRequestController extends Controller
{
    /** GET /service-requests?search=&status=&category_id=&page= */
    public function index(Request $request)
    {
        $user = $request->user();

        $requests = ServiceRequest::with(['category', 'user']) // eager loading: no N+1
            ->when(! $user->isAdmin(), fn ($q) => $q->where('user_id', $user->id))
            ->filter($request->only('search', 'status', 'category_id'))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return ServiceRequestResource::collection($requests);
    }

    public function store(StoreServiceRequestRequest $request): JsonResponse
    {
        $serviceRequest = $request->user()->serviceRequests()->create($request->validated());

        return (new ServiceRequestResource($serviceRequest->load(['category', 'user'])))
            ->response()->setStatusCode(201);
    }

    public function show(ServiceRequest $serviceRequest): ServiceRequestResource
    {
        Gate::authorize('view', $serviceRequest);

        return new ServiceRequestResource($serviceRequest->load(['category', 'user', 'updates.user']));
    }

    public function update(StoreServiceRequestRequest $request, ServiceRequest $serviceRequest): ServiceRequestResource
    {
        Gate::authorize('update', $serviceRequest);

        $serviceRequest->update($request->validated());

        return new ServiceRequestResource($serviceRequest->load(['category', 'user']));
    }

    public function destroy(ServiceRequest $serviceRequest): Response
    {
        Gate::authorize('delete', $serviceRequest);

        $serviceRequest->delete();

        return response()->noContent(); // 204
    }

    /** PATCH /service-requests/{id}/status  (admin only, route-level middleware) */
    public function updateStatus(UpdateStatusRequest $request, ServiceRequest $serviceRequest): JsonResponse|ServiceRequestResource
    {
        $newStatus = $request->validated('status');

        if (! $serviceRequest->canMoveTo($newStatus)) {
            return response()->json([
                'message' => "A {$serviceRequest->status} request cannot be changed to {$newStatus}.",
                'errors' => ['status' => ["A {$serviceRequest->status} request cannot be changed to {$newStatus}."]],
            ], 422);
        }

        DB::transaction(function () use ($request, $serviceRequest, $newStatus) {
            $oldStatus = $serviceRequest->status;

            $serviceRequest->update([
                'status' => $newStatus,
                'completed_at' => $newStatus === 'completed' ? now() : null,
            ]);

            $serviceRequest->updates()->create([
                'user_id' => $request->user()->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'remarks' => $request->validated('remarks'),
            ]);

            AppNotification::create([
                'user_id' => $serviceRequest->user_id,
                'service_request_id' => $serviceRequest->id,
                'message' => "Your request {$serviceRequest->reference_no} is now ".ucfirst($newStatus).'.',
            ]);
        });

        return new ServiceRequestResource($serviceRequest->load(['category', 'user', 'updates.user']));
    }
}
