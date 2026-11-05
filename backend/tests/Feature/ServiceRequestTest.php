<?php

namespace Tests\Feature;

use App\Models\ServiceCategory;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ServiceRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_resident_creates_request_and_validation_errors_return_422(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $category = ServiceCategory::create(['name' => 'Document Requests']);

        $this->postJson('/api/service-requests', [])->assertStatus(422)
            ->assertJsonValidationErrors(['service_category_id', 'title', 'description']);

        $this->postJson('/api/service-requests', [
            'service_category_id' => $category->id,
            'title' => 'Barangay clearance',
            'description' => 'Needed for a job application.',
        ])->assertCreated()->assertJsonPath('data.status', 'pending');
    }

    public function test_resident_cannot_see_or_change_another_residents_request(): void
    {
        $other = ServiceRequest::factory()->create();
        Sanctum::actingAs(User::factory()->create());

        $this->getJson("/api/service-requests/{$other->id}")->assertForbidden();
        $this->patchJson("/api/service-requests/{$other->id}/status", ['status' => 'approved'])->assertForbidden();
    }

    public function test_admin_follows_status_workflow(): void
    {
        $request = ServiceRequest::factory()->create();
        Sanctum::actingAs(User::factory()->admin()->create());

        // pending -> completed is not allowed
        $this->patchJson("/api/service-requests/{$request->id}/status", ['status' => 'completed'])->assertStatus(422);

        $this->patchJson("/api/service-requests/{$request->id}/status", ['status' => 'approved'])
            ->assertOk()->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('notifications', ['user_id' => $request->user_id]);
    }

    public function test_admin_can_delete_any_request_and_gets_204(): void
    {
        $request = ServiceRequest::factory()->create();
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->deleteJson("/api/service-requests/{$request->id}")->assertNoContent();
    }
}
