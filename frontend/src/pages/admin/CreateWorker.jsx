import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";

const initialForm = {
  name: "",
  email: "",
  specialization: "Other",
  password: "",
  confirmPassword: "",
};

function CreateWorker() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api.post("/admin/create-worker", {
        name,
        email,
        specialization: form.specialization,
        password: form.password,
      });

      setSuccessMessage(response.data.message || "Worker created successfully.");
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create worker. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <Link
          to="/admin/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition hover:text-primary-700"
        >
          <FaArrowLeft />
          Back to Dashboard
        </Link>

        <div className="card p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="page-title">Create Worker</h1>
            <p className="page-subtitle">
              Add a municipal worker to receive and manage assigned complaints.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="label">
                Worker Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                className="input"
                placeholder="Enter worker name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="input"
                placeholder="worker@example.com"
              />
            </div>

            <div>
              <label htmlFor="specialization" className="label">
                Specialization
              </label>
              <select
                id="specialization"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="input"
              >
                <option value="Road">Road</option>
                <option value="Garbage">Garbage</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="input"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="input"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
              <Link
                to="/admin/dashboard"
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                <FaUserPlus />
                {isSubmitting ? "Creating Worker..." : "Create Worker"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateWorker;