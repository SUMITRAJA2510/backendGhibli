import React, { useState } from "react";

function resizeImage(file, maxWidth = 1024, maxHeight = 1024) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const resizedBlob = await resizeImage(selectedFile);
    const formData = new FormData();
    formData.append("image", resizedBlob, "resized.png");
    // Add other fields if needed, e.g. prompt
    // formData.append("prompt", "your prompt here");

    try {
      const response = await fetch("http://localhost:8080/api/v1/generate", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        // handle success (e.g. show generated image)
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreview(url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Error uploading image");
    }
    setUploading(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <div>
          <img src={preview} alt="Preview" style={{ maxWidth: 300, maxHeight: 300 }} />
        </div>
      )}
      <button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? "Uploading..." : "Upload & Generate"}
      </button>
    </div>
  );
};

export default ImageUploader;