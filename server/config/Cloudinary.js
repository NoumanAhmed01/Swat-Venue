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

  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const publicId = filename.split(".")[0];

  const folderIndex = parts.indexOf("upload");
  if (folderIndex !== -1 && folderIndex + 2 < parts.length) {
    const folder = parts[folderIndex + 1];
    return `${folder}/${publicId}`;
  }

  return publicId;
};

module.exports = {
  cloudinary,
  deleteFromCloudinary,
  deleteVideoFromCloudinary,
  extractPublicId,
};
