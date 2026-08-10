import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";

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
          className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
        />
      );
    }

    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-md">
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
      <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Citizen Profile
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              My Profile
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Keep your contact details up to date for faster service.
            </p>
          </div>

          <button
            onClick={() => {
              setEditing((prev) => !prev);
              setMessage({ type: "", text: "" });
            }}
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {editing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {message.text ? (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start">
                <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-2">
                  {renderAvatar()}
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.name || "Your Name"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">{profile?.email}</p>
                  <div className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                    Citizen Member
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.phone || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.address || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4 sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                {editing ? "Edit Profile" : "Profile Details"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {editing
                  ? "Update your personal details below."
                  : "Your current public profile information is shown here."}
              </p>

              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                      {profile?.name || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="rounded-xl bg-gray-100 px-4 py-3 text-gray-600">
                    {profile?.email || "Not provided"}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                      {profile?.phone || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                      {profile?.address || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Profile Image URL
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  ) : (
                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                      {profile?.profileImage ? profile.profileImage : "Not provided"}
                    </div>
                  )}
                </div>

                {editing ? (
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                ) : null}
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Profile;