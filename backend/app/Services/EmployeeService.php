<?php

namespace App\Services;

use App\Exports\EmployeesExport;
use App\Imports\EmployeesImport;
use App\Models\Employee;
use App\Interfaces\EmployeeServiceInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class EmployeeService implements EmployeeServiceInterface
{
    /**
     * Get paginated employees with search, filter, and sorting.
     */
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Employee::query();

        // Search across multiple fields
        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                  ->orWhere('lastname', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('education_qualification', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Education Qualification Filter
        if (!empty($filters['education_qualification']) && $filters['education_qualification'] !== 'all') {
            $query->where('education_qualification', $filters['education_qualification']);
        }

        // Date of birth range filter
        if (!empty($filters['dob_from'])) {
            $query->whereDate('date_of_birth', '>=', $filters['dob_from']);
        }
        if (!empty($filters['dob_to'])) {
            $query->whereDate('date_of_birth', '<=', $filters['dob_to']);
        }

        // Sorting
        $allowedSortFields = [
            'id', 'employee_id', 'firstname', 'lastname', 'date_of_birth',
            'education_qualification', 'email', 'phone', 'created_at'
        ];
        $sortBy = in_array($filters['sort_by'] ?? '', $allowedSortFields) ? $filters['sort_by'] : 'id';
        $sortDir = strtolower($filters['sort_dir'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        $query->orderBy($sortBy, $sortDir);

        $perPage = max(1, min(100, (int)($filters['per_page'] ?? 10)));

        return $query->paginate($perPage);
    }

    /**
     * Get single employee by ID.
     */
    public function getById(int $id): Employee
    {
        return Employee::findOrFail($id);
    }

    /**
     * Generate next sequential Employee ID like EMP-0001.
     */
    public function generateNextEmployeeId(): string
    {
        $lastEmployee = Employee::orderBy('id', 'desc')->first();
        $nextNumber = 1;

        if ($lastEmployee && !empty($lastEmployee->employee_id)) {
            if (preg_match('/(?:EMP-?)(\d+)/i', $lastEmployee->employee_id, $matches)) {
                $nextNumber = intval($matches[1]) + 1;
            } else {
                $nextNumber = $lastEmployee->id + 1;
            }
        }

        do {
            $candidate = sprintf('EMP-%04d', $nextNumber);
            $exists = Employee::where('employee_id', $candidate)->exists();
            if ($exists) {
                $nextNumber++;
            }
        } while ($exists);

        return $candidate;
    }

    /**
     * Create a new employee.
     */
    public function create(array $data, ?UploadedFile $photo = null, ?UploadedFile $resume = null): Employee
    {
        if (empty($data['employee_id'])) {
            $data['employee_id'] = $this->generateNextEmployeeId();
        }

        if ($photo) {
            $data['photo'] = $this->storeFile($photo, 'photos');
        }

        if ($resume) {
            $data['resume'] = $this->storeFile($resume, 'resumes');
        }

        return Employee::create($data);
    }

    /**
     * Update an existing employee.
     */
    public function update(int $id, array $data, ?UploadedFile $photo = null, ?UploadedFile $resume = null): Employee
    {
        $employee = $this->getById($id);

        if ($photo) {
            if ($employee->photo) {
                $this->deleteFile($employee->photo);
            }
            $data['photo'] = $this->storeFile($photo, 'photos');
        }

        if ($resume) {
            if ($employee->resume) {
                $this->deleteFile($employee->resume);
            }
            $data['resume'] = $this->storeFile($resume, 'resumes');
        }

        $employee->update($data);
        return $employee->fresh();
    }

    /**
     * Delete an employee and their files.
     */
    public function delete(int $id): bool
    {
        $employee = $this->getById($id);

        if ($employee->photo) {
            $this->deleteFile($employee->photo);
        }

        if ($employee->resume) {
            $this->deleteFile($employee->resume);
        }

        return (bool)$employee->delete();
    }

    /**
     * Store an uploaded file safely and return relative path.
     */
    protected function storeFile(UploadedFile $file, string $subfolder): string
    {
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $relativeDir = 'uploads/employees/' . $subfolder;
        $destinationPath = public_path($relativeDir);

        if (!File::exists($destinationPath)) {
            File::makeDirectory($destinationPath, 0755, true);
        }

        $file->move($destinationPath, $filename);

        return $relativeDir . '/' . $filename;
    }

    /**
     * Delete a stored file.
     */
    protected function deleteFile(string $relativePath): void
    {
        $fullPath = public_path($relativePath);
        if (File::exists($fullPath)) {
            File::delete($fullPath);
        }
    }

    /**
     * Export employees using Maatwebsite\Excel package.
     */
    public function export(array $filters = [], string $format = 'xlsx'): BinaryFileResponse
    {
        $timestamp = date('Y-m-d_His');
        $writerType = strtolower($format) === 'csv'
            ? \Maatwebsite\Excel\Excel::CSV
            : \Maatwebsite\Excel\Excel::XLSX;

        $extension = strtolower($format) === 'csv' ? 'csv' : 'xlsx';
        $filename = "employees_{$timestamp}.{$extension}";

        return Excel::download(new EmployeesExport($filters), $filename, $writerType);
    }

    /**
     * Import employees using Maatwebsite\Excel package.
     */
    public function importFromFile(UploadedFile $file): array
    {
        $import = new EmployeesImport($this);

        Excel::import($import, $file);

        return [
            'total_processed' => $import->getImportedCount() + $import->getUpdatedCount() + $import->getSkippedCount(),
            'imported_count' => $import->getImportedCount(),
            'updated_count' => $import->getUpdatedCount(),
            'skipped_count' => $import->getSkippedCount(),
            'errors' => $import->getErrors(),
        ];
    }

    /**
     * Get summary statistics for dashboard.
     */
    public function getStats(): array
    {
        $total = Employee::count();
        $qualifications = Employee::select('education_qualification', DB::raw('count(*) as count'))
            ->groupBy('education_qualification')
            ->orderBy('count', 'desc')
            ->get();

        $recent = Employee::orderBy('id', 'desc')->take(5)->get();

        return [
            'total_employees' => $total,
            'qualifications_breakdown' => $qualifications,
            'recent_employees' => $recent,
        ];
    }
}
