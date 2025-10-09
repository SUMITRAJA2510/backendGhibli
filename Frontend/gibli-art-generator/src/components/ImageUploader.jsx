import React, { useState } from "react";

const API_URL = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/api/v1"}`;

function resizeImage(file, maxWidth = 1024, maxHeight = 1024) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => (img.src = e.target.result);

        img.onload = () => {
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            const width = img.width * ratio;
            const height = img.height * ratio;

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => resolve(blob),
                "image/png",
                0.9
            );
        };

        img.onerror = reject;
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
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const resizedBlob = await resizeImage(selectedFile);
            const formData = new FormData();
            formData.append("image", resizedBlob, "resized.png");
            formData.append("prompt", "your prompt here"); // optional

            const response = await fetch(`${API_URL}/generate-from-text`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPreview(url);
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("Failed to upload. Please try again later.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
                <div>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ maxWidth: 300, maxHeight: 300, borderRadius: 8 }}
                    />
                </div>
            )}
            <button onClick={handleUpload} disabled={!selectedFile || uploading}>
                {uploading ? "Processing..." : "Upload & Generate"}
            </button>
        </div>
    );
};

export default ImageUploader;
