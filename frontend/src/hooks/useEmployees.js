import { useState, useCallback, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { useBackendErrors } from './useBackendErrors';

export function useEmployees(initialParams = {}) {
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Filters & pagination state
  const [search, setSearch] = useState(initialParams.search || '');
  const [qualification, setQualification] = useState(initialParams.qualification || 'all');
  const [dobFrom, setDobFrom] = useState(initialParams.dobFrom || '');
  const [dobTo, setDobTo] = useState(initialParams.dobTo || '');
  const [sortBy, setSortBy] = useState(initialParams.sortBy || 'id');
  const [sortDir, setSortDir] = useState(initialParams.sortDir || 'desc');
  const [page, setPage] = useState(initialParams.page || 1);
  const [perPage, setPerPage] = useState(initialParams.perPage || 10);

  const { generalError, handleBackendError, clearErrors } = useBackendErrors();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    clearErrors();
    try {
      const res = await employeeService.getEmployees({
        page,
        perPage,
        search,
        qualification,
        dobFrom,
        dobTo,
        sortBy,
        sortDir,
      });
      if (res.success) {
        setEmployees(res.data || []);
        setMeta(res.meta || {});
      }
      return res;
    } catch (err) {
      handleBackendError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, qualification, dobFrom, dobTo, sortBy, sortDir, clearErrors, handleBackendError]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await employeeService.getStats();
      if (res.success) {
        setStats(res.data);
      }
      return res;
    } catch {
      // Non-blocking
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    try {
      const res = await employeeService.deleteEmployee(id);
      await fetchEmployees();
      await fetchStats();
      return res;
    } catch (err) {
      handleBackendError(err);
      throw err;
    }
  }, [fetchEmployees, fetchStats, handleBackendError]);

  const exportEmployees = useCallback(async (format = 'xlsx') => {
    try {
      await employeeService.downloadExport(format, search, qualification);
    } catch (err) {
      handleBackendError(err);
      throw err;
    }
  }, [search, qualification, handleBackendError]);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setLoading(true);
      clearErrors();
      try {
        const res = await employeeService.getEmployees({
          page,
          perPage,
          search,
          qualification,
          dobFrom,
          dobTo,
          sortBy,
          sortDir,
        });
        if (!ignore && res.success) {
          setEmployees(res.data || []);
          setMeta(res.meta || {});
        }
      } catch (err) {
        if (!ignore) {
          handleBackendError(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [page, perPage, search, qualification, dobFrom, dobTo, sortBy, sortDir, clearErrors, handleBackendError]);

  useEffect(() => {
    let ignore = false;

    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const res = await employeeService.getStats();
        if (!ignore && res.success) {
          setStats(res.data);
        }
      } catch {
        // Non-blocking
      } finally {
        if (!ignore) {
          setStatsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSort = useCallback((field, dir) => {
    setSortBy(field);
    setSortDir(dir);
    setPage(1);
  }, []);

  return {
    employees,
    meta,
    loading,
    stats,
    statsLoading,
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
    error: generalError,
  };
}

