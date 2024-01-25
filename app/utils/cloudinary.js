import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "eatsycdn",
  api_key: "552369841841616",
  api_secret: "_S9kqYk2YQLg_YpoT9Pw43D3D-g",
});

// Function to upload a file to Cloudinary
export const uploadFileToCloud = async (filePath, folder, public_id) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id,
    });
    return result;
  } catch (error) {
    throw new Error("Error uploading file to Cloudinary", error);
  }
};

// Function to delete a file from Cloudinary
export const deleteFileCloud = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error("Error deleting file from Cloudinary");
  }
};
