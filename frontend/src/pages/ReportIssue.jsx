import { useState, useRef } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


function ReportIssue() {
  const [title, setTitle] = useState("");
const [category, setCategory] = useState("Road");
const [description, setDescription] = useState("");

const [latitude, setLatitude] = useState("");
const [longitude, setLongitude] = useState("");

const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");
const [loading, setLoading] = useState(false);
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

const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setImage(file);

  const imageURL = URL.createObjectURL(file);

  setPreview(imageURL);
};

const handleSubmit = async () => {
  if (!title || !description) {
    alert("Please complete all required fields.");
    return;
  }

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

    alert("Issue reported successfully!");

    setTimeout(() => {
      navigate("/citizen/dashboard");
    }, 1500);

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Something went wrong."
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              Report New Issue
            </h1>

            <p className="text-gray-500 mt-2">
              Help improve your community by reporting civic problems.
            </p>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="space-y-7">

            {/* Title */}

            <div>

              <label className="block font-semibold mb-2">
                Issue Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Huge pothole near CMR"
                className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            {/* Category */}

            <div>

              <label className="block font-semibold mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-xl p-4"
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

              <label className="block font-semibold mb-2">
                Description
              </label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe the issue..."
                className="w-full border rounded-xl p-4 resize-none"
              />

            </div>

            {/* Image */}

<div>

  <label className="block font-semibold mb-3">
    Upload Image
  </label>

  <div className="border-2 border-dashed rounded-2xl p-10 text-center">

    {preview ? (
      <img
        src={preview}
        alt="Preview"
        className="mx-auto rounded-xl max-h-72 object-cover"
      />
    ) : (
      <>
        <FaCamera
          className="mx-auto text-blue-600"
          size={42}
        />

        <p className="mt-4 text-gray-500">
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
      className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
    >
      {preview ? "Change Image" : "Choose Image"}
    </button>

  </div>

</div>

            {/* Location */}

            <div>

              <label className="block font-semibold mb-3">
                Location
              </label>

              <button
  type="button"
  onClick={detectLocation}
  className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
>
  <FaMapMarkerAlt />
  Detect My Location
</button>

{latitude && (
  <div className="mt-4 bg-gray-50 rounded-xl p-4">

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

            <div className="bg-blue-50 rounded-2xl p-6">

              <h2 className="font-bold text-xl mb-4">
                🤖 AI Preview
              </h2>

              {aiSummary ? (
  <>

    <p>
      <strong>Summary:</strong>
    </p>

    <p className="mb-4">
      {aiSummary}
    </p>

    <p>
      <strong>Priority:</strong>
    </p>

    <p className="text-red-600 font-bold">
      {aiPriority}
    </p>

  </>
) : (
  <p className="text-gray-500">
    AI summary and priority will appear here after submission.
  </p>
)}

            </div>

            {/* Submit */}

            <button
  onClick={handleSubmit}
  disabled={submitting}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl flex justify-center items-center gap-3 text-lg font-semibold disabled:opacity-50"
>
  <FaPaperPlane />

  {submitting ? "Submitting..." : "Submit Issue"}
</button>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default ReportIssue;