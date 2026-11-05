<?php

namespace App\Policies;

use App\Models\ServiceRequest;
use App\Models\User;

class ServiceRequestPolicy
{
    public function view(User $user, ServiceRequest $request): bool
    {
        return $user->isAdmin() || $request->user_id === $user->id;
    }

    /** Admin: any request. Resident: own request, only while still pending. */
    public function update(User $user, ServiceRequest $request): bool
    {
        return $user->isAdmin() || ($request->user_id === $user->id && $request->status === 'pending');
    }

    /** Admin: any request. Resident: may cancel (delete) own pending request. */
    public function delete(User $user, ServiceRequest $request): bool
    {
        return $this->update($user, $request);
    }
}
