<?php

namespace App\Imports;

use App\Models\Employee;
use App\Interfaces\EmployeeServiceInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class EmployeesImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{
    protected EmployeeServiceInterface $employeeService;

    protected int $importedCount = 0;
    protected int $updatedCount = 0;
    protected int $skippedCount = 0;
    protected array $errors = [];

    public function __construct(EmployeeServiceInterface $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            $rowNum = $index + 2; // Row 1 is headings

            $firstname = trim($row['first_name'] ?? $row['firstname'] ?? '');
            $lastname = trim($row['last_name'] ?? $row['lastname'] ?? '');
            $email = trim($row['email'] ?? $row['email_address'] ?? '');
            $phone = trim((string)($row['phone'] ?? $row['phone_number'] ?? $row['mobile'] ?? ''));
            $qualification = trim($row['education_qualification'] ?? $row['qualification'] ?? $row['education'] ?? '');
            $address = trim($row['address'] ?? '');
            $dobRaw = $row['date_of_birth'] ?? $row['dob'] ?? $row['birth_date'] ?? null;
            $empId = trim((string)($row['employee_id'] ?? $row['empid'] ?? $row['id'] ?? ''));

            // Validation
            if (empty($firstname) || empty($lastname)) {
                $this->errors[] = "Row {$rowNum}: First name and Last name are required.";
                $this->skippedCount++;
                continue;
            }

            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->errors[] = "Row {$rowNum}: Invalid or missing email ('{$email}').";
                $this->skippedCount++;
                continue;
            }

            // Parse Date of Birth
            $dob = '1995-01-01';
            if (!empty($dobRaw)) {
                try {
                    if (is_numeric($dobRaw) && (int)$dobRaw > 1000) {
                        $dob = ExcelDate::excelToDateTimeObject($dobRaw)->format('Y-m-d');
                    } else {
                        $dob = Carbon::parse($dobRaw)->format('Y-m-d');
                    }
                } catch (\Exception $e) {
                    $dob = '1995-01-01';
                }
            }

            $existing = Employee::where('email', $email)->first();

            if ($existing) {
                $existing->update([
                    'firstname' => $firstname,
                    'lastname' => $lastname,
                    'phone' => !empty($phone) ? $phone : $existing->phone,
                    'education_qualification' => !empty($qualification) ? $qualification : $existing->education_qualification,
                    'address' => !empty($address) ? $address : $existing->address,
                    'date_of_birth' => $dob,
                ]);
                $this->updatedCount++;
            } else {
                if (empty($empId) || Employee::where('employee_id', $empId)->exists()) {
                    $empId = $this->employeeService->generateNextEmployeeId();
                }

                Employee::create([
                    'employee_id' => $empId,
                    'firstname' => $firstname,
                    'lastname' => $lastname,
                    'email' => $email,
                    'phone' => !empty($phone) ? $phone : 'N/A',
                    'education_qualification' => !empty($qualification) ? $qualification : 'Graduate',
                    'address' => !empty($address) ? $address : 'N/A',
                    'date_of_birth' => $dob,
                ]);
                $this->importedCount++;
            }
        }
    }

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }

    public function getUpdatedCount(): int
    {
        return $this->updatedCount;
    }

    public function getSkippedCount(): int
    {
        return $this->skippedCount;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}

