<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'employee_id' => 'EMP-0001',
                'firstname' => 'Aarav',
                'lastname' => 'Sharma',
                'date_of_birth' => '1992-05-14',
                'education_qualification' => 'B.Tech Computer Science',
                'address' => '42 Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103',
                'email' => 'aarav.sharma@example.com',
                'phone' => '+91 9876543210',
            ],
            [
                'employee_id' => 'EMP-0002',
                'firstname' => 'Priya',
                'lastname' => 'Sundaram',
                'date_of_birth' => '1995-08-22',
                'education_qualification' => 'MCA',
                'address' => '15 Anna Nagar 2nd Avenue, Chennai, Tamil Nadu - 600040',
                'email' => 'priya.sundaram@example.com',
                'phone' => '+91 9845123456',
            ],
            [
                'employee_id' => 'EMP-0003',
                'firstname' => 'Rohan',
                'lastname' => 'Verma',
                'date_of_birth' => '1990-11-03',
                'education_qualification' => 'M.Sc Data Science',
                'address' => '78 Koregaon Park, Lane 5, Pune, Maharashtra - 411001',
                'email' => 'rohan.verma@example.com',
                'phone' => '+91 9123456780',
            ],
            [
                'employee_id' => 'EMP-0004',
                'firstname' => 'Ananya',
                'lastname' => 'Patel',
                'date_of_birth' => '1996-03-18',
                'education_qualification' => 'B.Sc Information Technology',
                'address' => '102 Bodakdev, SG Highway, Ahmedabad, Gujarat - 380054',
                'email' => 'ananya.patel@example.com',
                'phone' => '+91 9789012345',
            ],
            [
                'employee_id' => 'EMP-0005',
                'firstname' => 'Karthik',
                'lastname' => 'Rajan',
                'date_of_birth' => '1993-09-30',
                'education_qualification' => 'B.E Electronics & Communication',
                'address' => '32/3 STV Nagar, Nava India, Peelamedu, Coimbatore - 641004',
                'email' => 'karthik.rajan@example.com',
                'phone' => '+91 9952852337',
            ],
            [
                'employee_id' => 'EMP-0006',
                'firstname' => 'Sneha',
                'lastname' => 'Reddy',
                'date_of_birth' => '1994-07-12',
                'education_qualification' => 'B.Tech Information Technology',
                'address' => '54 Jubilee Hills, Road No. 36, Hyderabad, Telangana - 500033',
                'email' => 'sneha.reddy@example.com',
                'phone' => '+91 9876012345',
            ],
            [
                'employee_id' => 'EMP-0007',
                'firstname' => 'Vikram',
                'lastname' => 'Malhotra',
                'date_of_birth' => '1989-12-05',
                'education_qualification' => 'MBA HR & Operations',
                'address' => '12 Barakhamba Road, Connaught Place, New Delhi - 110001',
                'email' => 'vikram.malhotra@example.com',
                'phone' => '+91 9988776655',
            ],
            [
                'employee_id' => 'EMP-0008',
                'firstname' => 'Divya',
                'lastname' => 'Nair',
                'date_of_birth' => '1997-01-25',
                'education_qualification' => 'BCA',
                'address' => '24 Panampilly Nagar, Kochi, Kerala - 682036',
                'email' => 'divya.nair@example.com',
                'phone' => '+91 9447123890',
            ],
            [
                'employee_id' => 'EMP-0009',
                'firstname' => 'Manish',
                'lastname' => 'Gupta',
                'date_of_birth' => '1991-04-19',
                'education_qualification' => 'B.Tech Computer Science',
                'address' => '88 Salt Lake Sector V, Kolkata, West Bengal - 700091',
                'email' => 'manish.gupta@example.com',
                'phone' => '+91 9830112233',
            ],
            [
                'employee_id' => 'EMP-0010',
                'firstname' => 'Pooja',
                'lastname' => 'Deshmukh',
                'date_of_birth' => '1998-10-08',
                'education_qualification' => 'B.Sc Computer Science',
                'address' => '67 Shivaji Nagar, Model Colony, Pune, Maharashtra - 411016',
                'email' => 'pooja.deshmukh@example.com',
                'phone' => '+91 9765432109',
            ],
            [
                'employee_id' => 'EMP-0011',
                'firstname' => 'Arjun',
                'lastname' => 'Menon',
                'date_of_birth' => '1992-06-15',
                'education_qualification' => 'MCA',
                'address' => '91 Calicut Bypass, Kozhikode, Kerala - 673004',
                'email' => 'arjun.menon@example.com',
                'phone' => '+91 9495123456',
            ],
            [
                'employee_id' => 'EMP-0012',
                'firstname' => 'Deepika',
                'lastname' => 'Joshi',
                'date_of_birth' => '1995-02-28',
                'education_qualification' => 'B.Tech Information Technology',
                'address' => '33 Malviya Nagar, Jaipur, Rajasthan - 302017',
                'email' => 'deepika.joshi@example.com',
                'phone' => '+91 9414567890',
            ],
        ];

        foreach ($employees as $data) {
            Employee::updateOrCreate(['email' => $data['email']], $data);
        }
    }
}

