import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import StatsCards from '../components/StatsCards';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeView from '../components/EmployeeView';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ImportModal from '../components/ImportModal';
import Toast from '../components/Toast';
import { useEmployees } from '../hooks/useEmployees';

export default function DashboardPage() {
  const {
    employees,
    meta,
    loading,
    stats,
    search,
    setSearch,
    qualification,
    setQualification,
    dobFrom,
    setDobFrom,
    dobTo,
    setDobTo,
    sortBy,
    sortDir,
    handleSort,
    page,
    setPage,
    perPage,
    setPerPage,
    fetchEmployees,
    fetchStats,
    deleteEmployee,
    exportEmployees,
  } = useEmployees();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setIsViewOpen(true);
  };

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setIsEditOpen(true);
  };

  const handleDeletePrompt = (emp) => {
    setSelectedEmployee(emp);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await deleteEmployee(id);
      showToast('Employee deleted successfully.');
      setIsDeleteOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to delete employee.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = (msg) => {
    showToast(msg);
    fetchEmployees();
    fetchStats();
  };

  const handleImportSuccess = (msg) => {
    showToast(msg);
    fetchEmployees();
    fetchStats();
  };

  const handleExport = async (format) => {
    try {
      showToast(`Generating ${format.toUpperCase()} export...`, 'info');
      await exportEmployees(format);
      showToast(`Export downloaded successfully.`);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to export employees.', 'error');
    }
  };

  return (
    <MainLayout onAddClick={() => setIsAddOpen(true)}>
      <StatsCards stats={stats} total={meta.total} />
      <EmployeeList
        employees={employees}
        meta={meta}
        loading={loading}
        search={search}
        setSearch={setSearch}
        qualification={qualification}
        setQualification={setQualification}
        dobFrom={dobFrom}
        setDobFrom={setDobFrom}
        dobTo={dobTo}
        setDobTo={setDobTo}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        onRefresh={() => {
          fetchEmployees();
          fetchStats();
          showToast('Data refreshed.');
        }}
        onAddClick={() => setIsAddOpen(true)}
        onViewClick={handleView}
        onEditClick={handleEdit}
        onDeleteClick={handleDeletePrompt}
        onImportClick={() => setIsImportOpen(true)}
        onExport={handleExport}
      />

      <EmployeeForm
        mode="add"
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleFormSuccess}
      />
      <EmployeeForm
        mode="edit"
        initialData={selectedEmployee}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedEmployee(null);
        }}
        onSuccess={handleFormSuccess}
      />
      <EmployeeView
        employee={selectedEmployee}
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedEmployee(null);
        }}
        onEdit={(emp) => {
          setSelectedEmployee(emp);
          setIsEditOpen(true);
        }}
        onDelete={(emp) => {
          setSelectedEmployee(emp);
          setIsDeleteOpen(true);
        }}
      />
      <DeleteConfirmModal
        employee={selectedEmployee}
        isOpen={isDeleteOpen}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedEmployee(null);
        }}
      />
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={handleImportSuccess}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </MainLayout>
  );
}
