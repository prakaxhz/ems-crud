<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Interfaces\EmployeeServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

class EmployeeController extends Controller
{
    protected EmployeeServiceInterface $employeeService;

    public function __construct(EmployeeServiceInterface $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    /**
     * Display a listing of the employees with search, filter, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search',
            'education_qualification',
            'dob_from',
            'dob_to',
            'sort_by',
            'sort_dir',
            'per_page',
        ]);

        $employees = $this->employeeService->getAll($filters);

        return response()->json([
            'success' => true,
            'data' => $employees->items(),
            'meta' => [
                'current_page' => $employees->currentPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
                'last_page' => $employees->lastPage(),
                'from' => $employees->firstItem(),
                'to' => $employees->lastItem(),
            ],
        ]);
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['photo', 'resume']);
        $photo = $request->file('photo');
        $resume = $request->file('resume');

        $employee = $this->employeeService->create($data, $photo, $resume);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully.',
            'data' => $employee,
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified employee.
     */
    public function show(int $id): JsonResponse
    {
        $employee = $this->employeeService->getById($id);

        return response()->json([
            'success' => true,
            'data' => $employee,
        ]);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(UpdateEmployeeRequest $request, int $id): JsonResponse
    {
        $data = $request->safe()->except(['photo', 'resume']);
        $photo = $request->file('photo');
        $resume = $request->file('resume');

        $employee = $this->employeeService->update($id, $data, $photo, $resume);

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully.',
            'data' => $employee,
        ]);
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->employeeService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully.',
        ]);
    }

    /**
     * Export employees to Excel (XLSX) or CSV using Maatwebsite\Excel.
     */
    public function export(Request $request)
    {
        $format = $request->query('format', 'xlsx');
        $filters = $request->only(['search', 'education_qualification']);

        return $this->employeeService->export($filters, $format);
    }

    /**
     * Import employees from uploaded Excel / CSV.
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt,xlsx', 'max:10240'],
        ], [
            'file.required' => 'Please select a CSV or XLSX file to import.',
            'file.mimes' => 'The file must be a CSV or Excel (.xlsx) file.',
            'file.max' => 'The file must not exceed 10MB.',
        ]);

        try {
            $result = $this->employeeService->importFromFile($request->file('file'));

            return response()->json([
                'success' => true,
                'message' => "Import completed: {$result['imported_count']} added, {$result['updated_count']} updated, {$result['skipped_count']} skipped.",
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to import file: ' . $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Serve photo directly.
     */
    public function photo(int $id)
    {
        $employee = $this->employeeService->getById($id);

        if (!$employee->photo || !File::exists(public_path($employee->photo))) {
            $initials = strtoupper(substr($employee->firstname, 0, 1) . substr($employee->lastname, 0, 1));
            $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
                <rect width="120" height="120" rx="60" fill="#4f46e5"/>
                <text x="50%" y="54%" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">' . htmlspecialchars($initials) . '</text>
            </svg>';
            return response($svg, 200, ['Content-Type' => 'image/svg+xml']);
        }

        return response()->file(public_path($employee->photo));
    }

    /**
     * Download or view resume directly.
     */
    public function resume(int $id)
    {
        $employee = $this->employeeService->getById($id);

        if (!$employee->resume || !File::exists(public_path($employee->resume))) {
            return response()->json(['message' => 'Resume not found.'], 404);
        }

        $filePath = public_path($employee->resume);
        $fileName = basename($filePath);

        return response()->download($filePath, "Resume_{$employee->employee_id}_{$employee->firstname}.pdf", [
            'Content-Type' => mime_content_type($filePath) ?: 'application/pdf',
        ]);
    }

    /**
     * Dashboard statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = $this->employeeService->getStats();

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get next suggested Employee ID.
     */
    public function nextId(): JsonResponse
    {
        $nextId = $this->employeeService->generateNextEmployeeId();

        return response()->json([
            'success' => true,
            'next_id' => $nextId,
        ]);
    }
}
