import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";
import { UserCircle2, Edit3, Save, X } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);
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
      const response = await api.get("/users/profile");
      const userData = response.data.user;

      setProfile(userData);
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

  const renderAvatar = () => {
    const image = profile?.profileImage || formData.profileImage;

    if (image) {
      return (
        <img
          src={image}
          alt="Profile"
          className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-md"
        />
      );
    }

    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white shadow-md">
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
            Keep your contact details up to date for faster service.
          </p>
        </div>

        <button
          onClick={() => {
            setEditing((prev) => !prev);
            setMessage({ type: "", text: "" });
          }}
          className={editing ? "btn-secondary" : "btn-primary"}
        >
          {editing ? (
            <>
              <X size={16} /> Cancel Edit
            </>
          ) : (
            <>
              <Edit3 size={16} /> Edit Profile
            </>
          )}
        </button>
      </div>

      {message.text ? (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-slate-500">Loading your profile...</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Profile card */}
          <div className="card p-6">
            <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start">
              <div className="rounded-full bg-primary-50 p-1 ring-4 ring-primary-50">
                {renderAvatar()}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-slate-900">
                  {profile?.name || "Your Name"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {profile?.email}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
                  <UserCircle2 size={14} />
                  Citizen Member
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Phone</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {profile?.phone || "Not provided"}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">Address</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {profile?.address || "Not provided"}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-medium text-slate-500">Member Since</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(profile?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Details / Edit form */}
          <div className="card p-6">
            <h3 className="text-base font-semibold text-slate-900">
              {editing ? "Edit Profile" : "Profile Details"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update your personal details below."
                : "Your current public profile information is shown here."}
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
                  <div className="rounded-lg bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800">
                    {profile?.name || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <label className="label">Email</label>
                <div className="rounded-lg bg-slate-100 px-3.5 py-2.5 text-sm text-slate-600">
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
                  <div className="rounded-lg bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800">
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
                  <div className="rounded-lg bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800">
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
                  <div className="rounded-lg bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800">
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
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              ) : null}
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Profile;