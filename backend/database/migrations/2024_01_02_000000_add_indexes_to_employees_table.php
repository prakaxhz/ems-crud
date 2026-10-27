<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add performance indexes to frequently queried columns (search, filter, sort)
     * without altering column definitions, nullability, or uniqueness rules.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->index('firstname', 'employees_firstname_index');
            $table->index('lastname', 'employees_lastname_index');
            $table->index('date_of_birth', 'employees_date_of_birth_index');
            $table->index('education_qualification', 'employees_education_qualification_index');
            $table->index('phone', 'employees_phone_index');
            $table->index('created_at', 'employees_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropIndex('employees_firstname_index');
            $table->dropIndex('employees_lastname_index');
            $table->dropIndex('employees_date_of_birth_index');
            $table->dropIndex('employees_education_qualification_index');
            $table->dropIndex('employees_phone_index');
            $table->dropIndex('employees_created_at_index');
        });
    }
};

