<?php

namespace Database\Seeders;

use App\Models\AppNotification;
use App\Models\RequestUpdate;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    private const REMARKS = [
        'approved' => 'Verified by the barangay office. Please wait for the schedule.',
        'rejected' => 'Details were incomplete. Please submit a new request with your full address.',
        'completed' => 'Request fulfilled. Thank you for your patience.',
    ];

    public function run(): void
    {
        $admin = User::factory()->admin()->create([
            'name' => 'Maria Teresa Dela Cruz',
            'email' => 'admin@barangay.test',
            'phone' => '09171234567',
            'address' => 'Barangay Hall, Barangay San Isidro',
        ]);

        $demo = User::factory()->create([
            'name' => 'Juan Carlos Santos',
            'email' => 'resident@barangay.test',
            'address' => 'Purok 3, Barangay San Isidro',
        ]);

        $residents = collect([
            ['Rosario Villanueva', 'rosario.villanueva@example.com'],
            ['Eduardo Ramirez', 'eduardo.ramirez@example.com'],
            ['Liza Mae Bautista', 'liza.bautista@example.com'],
            ['Ricardo Aquino', 'ricardo.aquino@example.com'],
            ['Angelica Fernandez', 'angelica.fernandez@example.com'],
            ['Noel Magsaysay', 'noel.magsaysay@example.com'],
        ])->map(fn ($r) => User::factory()->create(['name' => $r[0], 'email' => $r[1]]))
            ->prepend($demo);

        // 28 requests: 8 pending, 7 approved, 9 completed, 4 rejected
        $statuses = collect(array_merge(
            array_fill(0, 8, 'pending'), array_fill(0, 7, 'approved'),
            array_fill(0, 9, 'completed'), array_fill(0, 4, 'rejected'),
        ))->shuffle();

        $trails = ['pending' => [], 'approved' => ['approved'], 'rejected' => ['rejected'], 'completed' => ['approved', 'completed']];

        foreach ($statuses as $i => $status) {
            $resident = $i < 6 ? $demo : $residents->random(); // make sure the demo resident has data
            $created = now()->subDays(rand(1, 45))->subHours(rand(0, 12));

            $request = ServiceRequest::factory()->create([
                'user_id' => $resident->id,
                'status' => $status,
                'created_at' => $created,
                'updated_at' => $created,
                'completed_at' => $status === 'completed' ? $created->copy()->addDays(rand(2, 6)) : null,
            ]);

            $previous = 'pending';
            foreach ($trails[$status] as $step) {
                RequestUpdate::create([
                    'service_request_id' => $request->id,
                    'user_id' => $admin->id,
                    'old_status' => $previous,
                    'new_status' => $step,
                    'remarks' => self::REMARKS[$step],
                ]);
                AppNotification::create([
                    'user_id' => $resident->id,
                    'service_request_id' => $request->id,
                    'message' => "Your request {$request->reference_no} is now ".ucfirst($step).'.',
                    'read_at' => rand(0, 1) ? now() : null,
                ]);
                $previous = $step;
            }
        }
    }
}
