import axiosClient from "../api/axiosClient.js";

// Uploads a single file straight from the browser to Cloudinary, using a
// signature our backend generated (so the upload is authenticated
// without ever exposing the Cloudinary API secret to the client).
// onProgress receives a 0-100 number, useful for video uploads which can
// take a while.
export const uploadMediaFile = async (file, onProgress) => {
  const { data: sig } = await axiosClient.get("/posts/upload-signature");

  const isVideo = file.type.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", sig.timestamp);
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`;

  const result = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Upload to Cloudinary failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.send(formData);
  });

  return {
    url: result.secure_url,
    type: isVideo ? "video" : "image",
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    // Cloudinary auto-generates a jpg poster frame for videos at the .0s
    // mark - swapping the extension gives us a free thumbnail URL.
    thumbnailUrl: isVideo ? result.secure_url.replace(/\.[^.]+$/, ".jpg") : undefined,
  };
};
