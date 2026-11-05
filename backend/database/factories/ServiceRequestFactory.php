<?php

namespace Database\Factories;

use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceRequestFactory extends Factory
{
    /** Realistic barangay requests: [category, title, description, location] */
    public const TEMPLATES = [
        ['Document Requests', 'Barangay clearance for job application', 'I need a barangay clearance for a job application. Please include my current address in the certificate.', null],
        ['Document Requests', 'Certificate of indigency for hospital bill', 'My father was admitted to the district hospital and we need a certificate of indigency for the medical assistance request.', null],
        ['Document Requests', 'Certificate of residency for school enrollment', 'My daughter is enrolling in Grade 7 and the school requires a certificate of residency.', null],
        ['Maintenance Concerns', 'Broken streetlight along the main road', 'The streetlight near the corner store has not worked for two weeks. The area is very dark at night and unsafe for students.', 'Purok 3 main road'],
        ['Maintenance Concerns', 'Clogged drainage beside the covered court', 'The canal beside the covered court is blocked with garbage and overflows when it rains, flooding nearby houses.', 'Covered court, Purok 2'],
        ['Maintenance Concerns', 'Large pothole in front of the elementary school', 'A deep pothole has formed at the school entrance. Tricycles and pedestrians are at risk, especially after rain.', 'Elementary school entrance'],
        ['Community Assistance', 'Wheelchair loan for a senior citizen', 'My grandmother recently had surgery and cannot walk. We would like to borrow a wheelchair from the barangay for a few weeks.', null],
        ['Community Assistance', 'Relief goods for flood-affected household', 'Our house was flooded during the last heavy rain and our food supplies were damaged. We are asking for relief goods.', 'Purok 5, near the creek'],
        ['Health Services', 'Home visit by barangay health worker', 'My mother is bedridden and needs her blood pressure checked. Could a health worker visit her at home?', 'Purok 1'],
        ['Peace and Order', 'Noise disturbance late at night', 'Loud karaoke goes on past midnight almost every weekend in our street. Please send a tanod to talk to the neighbors.', 'Purok 4'],
    ];

    public function definition(): array
    {
        [$category, $title, $description, $location] = fake()->randomElement(self::TEMPLATES);

        return [
            'user_id' => User::factory(),
            'service_category_id' => ServiceCategory::firstOrCreate(['name' => $category])->id,
            'title' => $title,
            'description' => $description,
            'location' => $location,
            'status' => 'pending',
        ];
    }
}
