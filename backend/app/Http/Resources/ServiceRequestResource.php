<?php

namespace App\Http\Resources;

use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'reference_no' => $this->reference_no,
            'title' => $this->title,
            'description' => $this->description,
            'location' => $this->location,
            'status' => $this->status,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'requester' => new UserResource($this->whenLoaded('user')),
            'updates' => RequestUpdateResource::collection($this->whenLoaded('updates')),
            // Tells React what the current user may do, so the UI never has to guess the rules.
            'permissions' => [
                'update' => $user?->can('update', $this->resource) ?? false,
                'delete' => $user?->can('delete', $this->resource) ?? false,
            ],
            'allowed_transitions' => $this->when(
                $user?->isAdmin(),
                fn () => ServiceRequest::TRANSITIONS[$this->status]
            ),
            'completed_at' => $this->completed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
