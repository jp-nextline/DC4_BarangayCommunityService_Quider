<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            'Document Requests' => 'Barangay clearance, certificates of indigency and residency, and similar papers.',
            'Maintenance Concerns' => 'Streetlights, drainage, roads, and other public facilities needing repair.',
            'Community Assistance' => 'Relief goods, equipment loans, and help for families in need.',
            'Health Services' => 'Barangay health worker visits, check-ups, and health programs.',
            'Peace and Order' => 'Complaints and concerns handled by the tanod and barangay officials.',
        ] as $name => $description) {
            ServiceCategory::firstOrCreate(['name' => $name], ['description' => $description]);
        }
    }
}
