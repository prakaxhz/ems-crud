<?php

namespace App\Exports;

use App\Models\Employee;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EmployeesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = Employee::query();

        if (!empty($this->filters['search'])) {
            $search = trim($this->filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                  ->orWhere('lastname', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('education_qualification', 'like', "%{$search}%");
            });
        }

        if (!empty($this->filters['education_qualification']) && $this->filters['education_qualification'] !== 'all') {
            $query->where('education_qualification', $this->filters['education_qualification']);
        }

        return $query->orderBy('id', 'asc')->get();
    }

    /**
     * Map each employee row.
     */
    public function map($employee): array
    {
        return [
            $employee->employee_id,
            $employee->firstname,
            $employee->lastname,
            $employee->date_of_birth ? Carbon::parse($employee->date_of_birth)->format('Y-m-d') : '',
            $employee->education_qualification,
            $employee->email,
            $employee->phone,
            $employee->address,
            $employee->created_at ? $employee->created_at->format('Y-m-d H:i:s') : '',
        ];
    }

    /**
     * Table column headings.
     */
    public function headings(): array
    {
        return [
            'Employee ID',
            'First Name',
            'Last Name',
            'Date of Birth',
            'Education Qualification',
            'Email',
            'Phone',
            'Address',
            'Created Date',
        ];
    }

    /**
     * Worksheet styling.
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 11,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5'],
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }
}

