import axios from "axios";
import React, { useState } from "react";

const AddFoodForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a video file!");
      return;
    }

    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("video", file);
    formData.append("description", e.target.description.value);
    formData.append("price", e.target.price.value);

    setUploading(true);
    setProgress(0);

    try {
      const res = await axios.post("https://foodshort.onrender.com/api/food/", formData, {
        withCredentials: true, // cookies for auth
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
        timeout: 120000, // 2 minutes timeout for slow networks
      });

      alert("Food item added successfully!");
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error("Upload failed:", err);

      // Fallback: save to local server if ImageKit fails
      if (err.message.includes("timeout") || err.message.includes("APIConnectionTimeoutError")) {
        alert("Upload timed out. Saving locally instead...");

        try {
          const fallbackRes = await axios.post("/api/food/local", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          alert("Saved locally successfully!");
        } catch (fallbackErr) {
          console.error("Local save failed:", fallbackErr);
          alert("Both upload and local save failed!");
        }
      } else {
        alert("Upload failed!");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Add New Food Item</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Food Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g. Chicken Burger"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Video */}
        <div>
          <label htmlFor="video" className="block mb-1 font-medium">
            Upload Video
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            className="w-full border px-3 py-2 rounded cursor-pointer"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="bg-blue-500 h-4 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Optional description"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block mb-1 font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="e.g. 12.99"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            uploading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={uploading}
        >
          {uploading ? `Uploading ${progress}%` : "Add Food"}
        </button>
      </form>
    </div>
  );
};

export default AddFoodForm;

