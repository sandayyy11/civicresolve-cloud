import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import PriorityBadge from "../../components/ui/PriorityBadge";
import api from "../../services/api";
import {
  FaChevronLeft,
  FaChevronRight,
  FaClipboardList,
  FaSearch,
} from "react-icons/fa";

const categories = ["Road", "Garbage", "Water", "Electricity", "Other"];
const PAGE_SIZE = 10;

function formatDate(dateString) {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AllIssues() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "",
    category: "",
  });

  const [page, setPage] = useState(1);
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = { page, limit: PAGE_SIZE };
      if (appliedFilters.search) params.search = appliedFilters.search;
      if (appliedFilters.status) params.status = appliedFilters.status;
      if (appliedFilters.category) params.category = appliedFilters.category;

      const response = await api.get("/issues", { params });

      setIssues(response.data.issues || []);
      setTotalIssues(response.data.totalIssues || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Unable to load complaints. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, page]);

  const applyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters({
      search: search.trim(),
      status: statusFilter,
      category: categoryFilter,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setPage(1);
    setAppliedFilters({ search: "", status: "", category: "" });
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-title">All Issues</h1>
        <p className="page-subtitle">View, search, and filter all reported civic complaints.</p>
      </div>

      <section className="card p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Complaints</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {isLoading
                ? "Loading complaints..."
                : `${totalIssues} complaint${totalIssues === 1 ? "" : "s"} found`}
            </p>
          </div>
        </div>

        <form onSubmit={applyFilters} className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title"
            className="input"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="input"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="input"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              <FaSearch /> Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
        </form>

        {error ? (
          <p className="rounded-md bg-red-50 px-4 py-5 text-center text-sm text-red-600">{error}</p>
        ) : isLoading ? (
          <p className="py-10 text-center text-gray-500">Loading complaints...</p>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <FaClipboardList className="mb-3 text-4xl text-gray-300" />
            <p className="text-gray-500">No complaints match the current filters.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reported by</th>
                  <th>Assigned worker</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id}>
                    <td className="font-medium text-gray-900">{issue.title}</td>
                    <td>{issue.category || "N/A"}</td>
                    <td><PriorityBadge priority={issue.priority} /></td>
                    <td><StatusBadge status={issue.status} /></td>
                    <td>
                      <p>{issue.reportedBy?.name || "Unknown citizen"}</p>
                      {issue.reportedBy?.email && (
                        <p className="text-xs text-gray-400">{issue.reportedBy.email}</p>
                      )}
                    </td>
                    <td>
                      {issue.assignedTo ? (
                        <>
                          <p>{issue.assignedTo.name}</p>
                          <p className="text-xs text-gray-400">
                            {issue.assignedTo.specialization || "General"}
                          </p>
                        </>
                      ) : (
                        <span className="badge-neutral">Unassigned</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {formatDate(issue.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && totalPages > 1 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-5 sm:flex-row">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="btn-secondary"
              >
                <FaChevronLeft /> Previous
              </button>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="btn-secondary"
              >
                Next <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default AllIssues;