const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

const deleteVideoFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return result;
  } catch (error) {
    console.error("Error deleting video from Cloudinary:", error);
    throw error;
  }
};

const extractPublicId = (url) => {
  if (!url) return null;

  // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v12345678/swatvenue/images/sample.jpg
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");

  if (uploadIndex === -1 || uploadIndex === parts.length - 1) return null;

  // The public ID starts after the version (v12345678) or after 'upload' if no version
  let startIndex = uploadIndex + 1;
  if (parts[startIndex].startsWith("v") && !isNaN(parts[startIndex].substring(1))) {
    startIndex++;
  }

  // Join the remaining parts and remove the file extension
  const publicIdWithExtension = parts.slice(startIndex).join("/");
  const publicId = publicIdWithExtension.split(".")[0];

  return publicId;
};

module.exports = {
  cloudinary,
  deleteFromCloudinary,
  deleteVideoFromCloudinary,
  extractPublicId,
};
