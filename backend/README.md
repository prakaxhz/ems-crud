# Employee Management System - Backend API

RESTful API backend for the Employee Management System built with **Laravel 10**, implementing the **Service Layer Pattern** with clean separation of interfaces, **Laravel Sanctum** token authentication, database indexing, and Excel/CSV import and export via **Maatwebsite Excel**.

---

## 🛠 Tech Stack & Architecture

- **Framework**: Laravel 10 (PHP 8.2+)
- **Authentication**: Laravel Sanctum (Bearer Token)
- **Database**: MySQL 8.0+
- **Import / Export**: Maatwebsite Excel (`maatwebsite/excel` 3.1)
- **Architecture**:
  - **Controllers**: Thin controllers handling requests and formatting responses.
  - **Service Layer**: Business logic separated in `app/Services/`.
  - **Interface Layer**: Dedicated contract definitions in `app/Interfaces/`.
  - **Form Requests**: Validations isolated in `app/Http/Requests/`.
  - **Database Indexing**: Optimized query indexes on searchable and filterable columns.

---

## 📂 Project Structure

```text
my-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   └── AuthController.php
│   │   │   └── EmployeeController.php
│   │   ├── Middleware/
│   │   │   ├── Authenticate.php
│   │   │   └── SetBearerTokenFromQuery.php
│   │   └── Requests/
│   │       ├── StoreEmployeeRequest.php
│   │       ├── UpdateEmployeeRequest.php
│   │       └── ImportEmployeeRequest.php
│   ├── Interfaces/
│   │   └── EmployeeServiceInterface.php
│   ├── Models/
│   │   ├── Employee.php
│   │   └── User.php
│   ├── Providers/
│   │   └── AppServiceProvider.php
│   ├── Services/
│   │   └── EmployeeService.php
│   └── Exports/ & Imports/
│       ├── EmployeesExport.php
│       └── EmployeesImport.php
├── config/
├── database/
│   ├── migrations/
│   │   ├── 2026_10_26_100000_create_employees_table.php
│   │   └── 2026_10_27_082315_add_indexes_to_employees_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php
│       └── EmployeeSeeder.php
├── routes/
│   ├── api.php
│   └── web.php
├── .env.example
├── composer.json
└── README.md
```

---

## ⚙️ Prerequisites

- PHP >= 8.2 with extensions: `pdo_mysql`, `mbstring`, `openssl`, `xml`, `gd` / `zip`
- Composer 2.x
- MySQL 8.x

---

## 🚀 Setup & Installation

### 1. Clone & Navigate
```bash
cd "d:\interview\creative bees\my-app"
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` (if not already present):
```bash
cp .env.example .env
```

Ensure your `.env` contains the database settings:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=employee_crud
DB_USERNAME=root
DB_PASSWORD=
```

Generate the application key:
```bash
php artisan key:generate
```

### 4. Run Migrations & Seeders
This creates the tables, database indexes, default admin user, and sample employees:
```bash
php artisan migrate:fresh --seed
```

### Default Credentials
- **Email**: `admin@creativebees.com`
- **Password**: `Admin@123`

### 5. Start Development Server
```bash
php artisan serve --port=8000
```
The API is available at `http://127.0.0.1:8000/api`.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/login` | Login and receive Sanctum Bearer token | No |
| `POST` | `/api/logout` | Revoke current user token | Yes |
| `GET` | `/api/me` | Fetch currently authenticated user | Yes |

### Employees CRUD, Search, Filter & Stats
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/employees` | List employees (supports `page`, `per_page`, `search`, `education_qualification`, `dob_from`, `dob_to`, `sort_by`, `sort_dir`) | Yes |
| `GET` | `/api/employees/stats` | Fetch aggregated dashboard counts | Yes |
| `POST` | `/api/employees` | Create employee (Auto-generates `EMP000001` format) | Yes |
| `GET` | `/api/employees/{id}` | View single employee details | Yes |
| `PUT/PATCH` | `/api/employees/{id}` | Update employee details | Yes |
| `DELETE` | `/api/employees/{id}` | Delete employee | Yes |

### Import & Export
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/employees/import` | Upload Excel/CSV file (`.xlsx`, `.xls`, `.csv`) | Yes |
| `GET` | `/api/employees/export` | Download filtered list as Excel or CSV (`?format=xlsx` or `?format=csv`) | Yes |

---

## 🗄️ Database Indexing Details

Composite and single-column indexes are added on `employees` for optimal search, sorting, and filtering speed:
- Single index: `dob`
- Single index: `education_qualification`
- Single index: `first_name`
- Single index: `last_name`
- Composite index: `(first_name, last_name)`
- Unique indexes: `employee_id`, `email`, `phone`
