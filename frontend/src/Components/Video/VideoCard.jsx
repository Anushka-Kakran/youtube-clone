import { useState } from "react";
import axios from "axios";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);

  const handleUpload = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("thumbnail", thumbnail);
      formData.append("video", video);

      const res = await axios.post(
        "https://youtube-clone-zd16.onrender.com/video/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔥 IMPORTANT
          },
        }
      );

      console.log(res.data);
      alert("Video Uploaded Successfully 🚀");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-3">
      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
      <input placeholder="Tags" onChange={(e) => setTags(e.target.value)} />

      <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} />
      <input type="file" onChange={(e) => setVideo(e.target.files[0])} />

      <button onClick={handleUpload} className="bg-blue-500 text-white p-2">
        Upload
      </button>
    </div>
  );
};

export default UploadVideo;