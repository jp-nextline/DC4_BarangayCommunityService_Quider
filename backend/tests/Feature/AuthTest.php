<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_resident_can_register_and_gets_resident_role(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Ana Reyes', 'email' => 'ana@example.com',
            'password' => 'secret123', 'password_confirmation' => 'secret123',
            'role' => 'admin', // must be ignored
        ])->assertCreated()->assertJsonPath('user.role', 'resident')->assertJsonStructure(['token']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'wrong'])
            ->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_protected_route_requires_token(): void
    {
        $this->getJson('/api/user')->assertUnauthorized();
    }
}
