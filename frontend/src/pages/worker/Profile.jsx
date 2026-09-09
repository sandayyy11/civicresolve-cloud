import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";
import { FaClipboardList, FaClock, FaCheckCircle, FaStar } from "react-icons/fa";

function WorkerProfile() {
  const [profile, setProfile] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    profileImage: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchProfile = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const [profileResponse, issuesResponse] = await Promise.all([
        api.get("/users/profile"),
        api.get("/worker/dashboard"),
      ]);

      const userData = profileResponse.data.user;
      setProfile(userData);
      setIssues(issuesResponse.data.issues || []);
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || "",
        profileImage: userData.profileImage || "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.patch("/users/profile", {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profileImage: formData.profileImage,
      });

      setProfile(response.data.user);
      setEditing(false);
      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleDateString("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const pending = issues.filter((issue) => issue.status === "Pending").length;
  const inProgress = issues.filter((issue) => issue.status === "In Progress").length;
  const resolved = issues.filter((issue) => issue.status === "Resolved").length;
  const feedbackItems = issues.filter((issue) => issue.feedback?.rating);

  const renderAvatar = () => {
    const image = profile?.profileImage || formData.profileImage;

    if (image) {
      return (
        <img
          src={image}
          alt="Profile"
          className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-sm"
        />
      );
    }

    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-700 text-xl font-semibold text-white">
        {(profile?.name || formData.name || "U")
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">
            Manage your contact details and track your service work.
          </p>
        </div>

        <button
          onClick={() => {
            setEditing((prev) => !prev);
            setMessage({ type: "", text: "" });
          }}
          className="btn-secondary"
        >
          {editing ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      {message.text ? (
        <div
          className={`mb-6 rounded-md border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card p-6">
              <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start">
                {renderAvatar()}

                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile?.name || "Your Name"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">{profile?.email}</p>
                  <div className="mt-3 inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
                    Worker Member
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.phone || "Not provided"}
                  </p>
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.address || "Not provided"}
                  </p>
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Specialization</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.specialization || "Not provided"}
                  </p>
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-base font-semibold text-gray-900">
                {editing ? "Edit Profile" : "Profile Details"}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {editing
                  ? "Update your personal details below."
                  : "Your current profile information is shown here."}
              </p>

              <form onSubmit={handleSave} className="mt-5 space-y-4">
                <div>
                  <label className="label">Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                    />
                  ) : (
                    <div className="rounded-md bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800">
                      {profile?.name || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">Email</label>
                  <div className="rounded-md bg-gray-100 px-3.5 py-2.5 text-sm text-gray-600">
                    {profile?.email || "Not provided"}
                  </div>
                </div>

                <div>
                  <label className="label">Phone</label>
                  {editing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  ) : (
                    <div className="rounded-md bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800">
                      {profile?.phone || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">Address</label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="textarea"
                    />
                  ) : (
                    <div className="rounded-md bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800">
                      {profile?.address || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">Profile Image URL</label>
                  {editing ? (
                    <input
                      type="text"
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="input"
                    />
                  ) : (
                    <div className="rounded-md bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800">
                      {profile?.profileImage ? profile.profileImage : "Not provided"}
                    </div>
                  )}
                </div>

                {editing ? (
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary w-full"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                ) : null}
              </form>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="card p-6">
              <h3 className="text-base font-semibold text-gray-900">Work Statistics</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-md bg-primary-50 p-4">
                  <div className="flex items-center gap-2 text-primary-700">
                    <FaClipboardList />
                    <p className="text-sm font-medium">Assigned</p>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">{issues.length}</p>
                </div>

                <div className="rounded-md bg-amber-50 p-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <FaClock />
                    <p className="text-sm font-medium">In Progress</p>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">{inProgress}</p>
                </div>

                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <FaCheckCircle />
                    <p className="text-sm font-medium">Completed</p>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">{resolved}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Citizen Feedback</h3>
                <span className="badge-resolved">
                  {feedbackItems.length} feedback items
                </span>
              </div>

              {feedbackItems.length === 0 ? (
                <div className="rounded-md border border-dashed border-gray-200 p-8 text-center">
                  <FaStar className="mx-auto text-gray-300" size={36} />
                  <p className="mt-4 text-sm text-gray-500">
                    No feedback yet for your assigned complaints.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {feedbackItems.slice(0, 5).map((issue) => (
                    <div key={issue._id} className="rounded-md border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                        <span className="text-amber-500">
                          {"★".repeat(issue.feedback.rating)}
                          {"☆".repeat(5 - issue.feedback.rating)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {issue.feedback.comment || "No additional comment provided."}
                      </p>
                      <p className="mt-3 text-xs text-gray-500">
                        Resolution date: {new Date(issue.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default WorkerProfile;
