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
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Issues</h1>
          <p className="mt-2 text-gray-500">
            View, search, and filter all reported civic complaints.
          </p>
        </div>

        <section className="rounded-2xl bg-white p-5 shadow-md sm:p-7">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Complaints</h2>
              <p className="mt-1 text-sm text-gray-500">
                {isLoading
                  ? "Loading complaints..."
                  : `${totalIssues} complaint${totalIssues === 1 ? "" : "s"} found`}
              </p>
            </div>
          </div>

          <form onSubmit={applyFilters} className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title"
              className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
              >
                <FaSearch /> Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </form>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-5 text-center text-sm text-red-600">{error}</p>
          ) : isLoading ? (
            <p className="py-10 text-center text-gray-500">Loading complaints...</p>
          ) : issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <FaClipboardList className="mb-3 text-4xl text-gray-300" />
              <p className="text-gray-500">No complaints match the current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-3 font-semibold">Complaint</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Priority</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Reported by</th>
                    <th className="px-3 py-3 font-semibold">Assigned worker</th>
                    <th className="px-3 py-3 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-3 py-4 font-medium text-gray-800">{issue.title}</td>
                      <td className="px-3 py-4 text-gray-600">{issue.category || "N/A"}</td>
                      <td className="px-3 py-4"><PriorityBadge priority={issue.priority} /></td>
                      <td className="px-3 py-4"><StatusBadge status={issue.status} /></td>
                      <td className="px-3 py-4 text-gray-600">
                        <p>{issue.reportedBy?.name || "Unknown citizen"}</p>
                        {issue.reportedBy?.email && (
                          <p className="text-xs text-gray-400">{issue.reportedBy.email}</p>
                        )}
                      </td>
                      <td className="px-3 py-4 text-gray-600">
                        {issue.assignedTo ? (
                          <>
                            <p>{issue.assignedTo.name}</p>
                            <p className="text-xs text-gray-400">
                              {issue.assignedTo.specialization || "General"}
                            </p>
                          </>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                        {formatDate(issue.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !error && totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-5 sm:flex-row">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaChevronLeft /> Previous
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AllIssues;