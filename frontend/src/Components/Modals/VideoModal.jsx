import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function VideoModal({
  isOpen,
  onClose,
  initialData,
  onRefresh,
}) {
  // =========================
  // STATES
  // =========================
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technology",
    tags: "",
  });

  const [files, setFiles] = useState({
    video: null,
    thumbnail: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // =========================
  // PREFILL (EDIT MODE)
  // =========================
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "Technology",
        tags: initialData.tags?.join(",") || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Technology",
        tags: "",
      });
      setFiles({ video: null, thumbnail: null });
      setImagePreview(null);
    }
  }, [initialData, isOpen]);

  // =========================
  // CLEANUP PREVIEW MEMORY
  // =========================
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // ✅ IMPORTANT: AFTER ALL HOOKS
  if (!isOpen) return null;

  // =========================
  // FILE HANDLERS
  // =========================
  const handleVideo = (e) => {
    setFiles((prev) => ({ ...prev, video: e.target.files[0] }));
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFiles((prev) => ({ ...prev, thumbnail: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // =========================
  // UPLOAD / UPDATE
  // =========================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!initialData && (!files.video || !files.thumbnail)) {
      toast.error("Please upload video and thumbnail");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("tags", formData.tags);

    if (files.video) data.append("video", files.video);
    if (files.thumbnail) data.append("thumbnail", files.thumbnail);

    try {
      if (initialData) {
        // ✅ UPDATE VIDEO (PUT)
        await axios.put(
          `https://youtube-clone-zd16.onrender.com/video/${initialData._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        // ✅ UPLOAD VIDEO (POST)
        await axios.post(
          "https://youtube-clone-zd16.onrender.com/video/upload",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      toast.success(
        initialData
          ? "Video updated successfully 🎉"
          : "Video uploaded successfully 🎉",
      );

      // RESET
      setFormData({
        title: "",
        description: "",
        category: "Technology",
        tags: "",
      });
      setFiles({ video: null, thumbnail: null });
      setImagePreview(null);

      onRefresh();
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#212121] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b dark:border-white/10">
          <h2 className="text-xl font-bold dark:text-white">
            {initialData ? "Edit Video" : "Upload Video"}
          </h2>
          <button onClick={onClose} className="text-2xl dark:text-white">
            &times;
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleUpload}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 rounded-lg border  dark:text-white"
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full p-3 rounded-lg border dark:text-white"
            >
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Motivation">Motivation</option>
              <option value="Music">Music</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full p-3 rounded-lg border dark:bg-[#121212] dark:border-white/10 dark:text-white"
          />

          <textarea
            rows="4"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-3 rounded-lg border dark:bg-[#121212] dark:border-white/10 dark:text-white"
          />

          {/* FILE INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 dark:text-gray-400">
                Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideo}
                className="dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 dark:text-gray-400">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnail}
                className="dark:text-white text-sm"
              />
            </div>
          </div>

          {/* PREVIEW */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${isLoading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
              }`}
          >
            {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}

            {isLoading
              ? "Uploading..."
              : initialData
                ? "Save Changes"
                : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}
