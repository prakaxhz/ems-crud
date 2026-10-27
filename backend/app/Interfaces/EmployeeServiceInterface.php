<?php

namespace App\Interfaces;

use App\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

interface EmployeeServiceInterface
{
    public function getAll(array $filters = []): LengthAwarePaginator;

    public function getById(int $id): Employee;

    public function create(array $data, ?UploadedFile $photo = null, ?UploadedFile $resume = null): Employee;

    public function update(int $id, array $data, ?UploadedFile $photo = null, ?UploadedFile $resume = null): Employee;

    public function delete(int $id): bool;

    public function generateNextEmployeeId(): string;

    public function export(array $filters = [], string $format = 'xlsx'): BinaryFileResponse;

    public function importFromFile(UploadedFile $file): array;

    public function getStats(): array;
}

