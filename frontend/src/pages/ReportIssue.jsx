import { useState, useRef } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import DuplicateComplaintModal from "../components/modals/DuplicateComplaintModal";

function ReportIssue() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Road");
  const [description, setDescription] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState("");
  const [aiPriority, setAiPriority] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => {
        alert("Unable to fetch location.");
      }
    );
  };

  const checkDuplicates = async () => {
    try {
      const response = await api.post("/issues/check-duplicates", {
        title,
        description,
        category,
        latitude,
        longitude,
      });

      if (response.data.duplicates.length > 0) {
        setDuplicates(response.data.duplicates);
        setShowDuplicates(true);
        setPendingSubmission(true);

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const submitIssue = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      if (image) {
        formData.append("image", image);
      }

      const response = await api.post("/issues", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAiSummary(response.data.issue.summary);
      setAiPriority(response.data.issue.priority);

      if (response.data.aiUnavailable) {
        alert(
          "Complaint submitted successfully.\n\nAI-assisted analysis is temporarily unavailable, so priority was determined using CivicResolve's built-in safety and location rules."
        );
      } else {
        alert("Complaint submitted successfully.");
      }

      setTimeout(() => {
        navigate("/citizen/dashboard");
      }, 1500);
    } catch (error) {
      // Show a clean user-friendly message, never raw API/Gemini errors.
      alert("We couldn't submit your complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const imageURL = URL.createObjectURL(file);

    setPreview(imageURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please complete all required fields.");
      return;
    }

    const duplicateFound = await checkDuplicates();

    if (!duplicateFound) {
      submitIssue();
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="page-title">Report New Issue</h1>
          <p className="page-subtitle">
            Help improve your community by reporting civic problems.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="label">
                Issue Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Huge pothole near CMR"
                className="input"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="label">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
              >
                <option>Road</option>
                <option>Garbage</option>
                <option>Electricity</option>
                <option>Water</option>
                <option>Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                className="textarea"
              />
            </div>

            {/* Image */}
            <div>
              <label className="label">
                Upload Image
              </label>

              <div className="rounded-md border-2 border-dashed border-gray-300 p-8 text-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto max-h-72 rounded-md object-cover"
                  />
                ) : (
                  <>
                    <FaCamera
                      className="mx-auto text-gray-400"
                      size={36}
                    />

                    <p className="mt-3 text-sm text-gray-500">
                      Choose an image to upload
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  hidden
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="btn-secondary mt-4"
                >
                  {preview ? "Change Image" : "Choose Image"}
                </button>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="label">
                Location
              </label>

              <button
                type="button"
                onClick={detectLocation}
                className="btn-secondary"
              >
                <FaMapMarkerAlt />
                Detect My Location
              </button>

              {latitude && (
                <div className="mt-3 rounded-md bg-gray-50 p-4 text-sm">
                  <p>
                    <strong>Latitude:</strong> {latitude}
                  </p>
                  <p>
                    <strong>Longitude:</strong> {longitude}
                  </p>
                </div>
              )}
            </div>

            {/* AI Preview */}
            <div className="rounded-md border border-primary-100 bg-primary-50 p-5">
              <h2 className="text-sm font-semibold text-gray-900">
                AI Preview
              </h2>

              {aiSummary ? (
                <>
                  <p className="mt-3 text-sm">
                    <strong>Summary:</strong>
                  </p>
                  <p className="mb-3 text-sm">
                    {aiSummary}
                  </p>

                  <p className="text-sm">
                    <strong>Priority:</strong>
                  </p>
                  <p className="text-sm font-semibold text-red-600">
                    {aiPriority}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  AI summary and priority will appear here after submission.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3"
            >
              <FaPaperPlane />
              {submitting ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        </form>
      </div>

      <DuplicateComplaintModal
        isOpen={showDuplicates}
        duplicates={duplicates}
        onClose={() => {
          setShowDuplicates(false);
          setPendingSubmission(false);
        }}
        onSupport={async (issueId) => {
          try {
            await api.patch(`/issues/${issueId}/support`);

            alert("Complaint supported successfully!");

            setShowDuplicates(false);
            setPendingSubmission(false);

            navigate("/citizen/dashboard");
          } catch (error) {
            alert(
              error.response?.data?.message ||
              "Failed to support complaint."
            );
          }
        }}
        onReportAnyway={() => {
          setShowDuplicates(false);
          setPendingSubmission(false);
          submitIssue();
        }}
      />
    </DashboardLayout>
  );
}

export default ReportIssue;
