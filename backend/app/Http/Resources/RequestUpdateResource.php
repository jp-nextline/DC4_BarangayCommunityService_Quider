<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestUpdateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'old_status' => $this->old_status,
            'new_status' => $this->new_status,
            'remarks' => $this->remarks,
            'updated_by' => $this->whenLoaded('user', fn () => $this->user->name),
            'created_at' => $this->created_at,
        ];
    }
}
