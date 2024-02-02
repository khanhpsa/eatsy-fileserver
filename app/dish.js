import { uploadFileToCloud } from "./utils/cloudinary.js";
import fs from "fs";

// Path to your local folder containing the images
const folderPath = "Uploads/Dish";

export const uploadDish = (req, res) => {
  // Read the files from the folder
  try {
    fs.readdirSync(folderPath).forEach(async (file) => {
      if (!file.endsWith(".png") && !file.endsWith(".jpg")) {
        // Construct the new file name with .png extension
        const newFileName = file + ".png";
        const oldFilePath = `${folderPath}/${file}`;
        const newFilePath = `${folderPath}/${newFileName}`;
        // Rename the file in the local folder
        fs.renameSync(oldFilePath, newFilePath);
        // Upload the renamed file to Cloudinary with the new filename and folder
        await uploadFileToCloud(newFilePath, "dish", newFileName);
      } else {
        // Construct the full path to the image file
        const filePath = `${folderPath}/${file}`;
        const imageName = file.substring(0, file.lastIndexOf("."));
        // Upload the image to Cloudinary with the original filename and folder
        await uploadFileToCloud(filePath, "dish", imageName);
      }
    });
    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "An error occurred while uploading images" });
  }
};

export const renameAndUpload = () => {
  // Read the files from the folder
  try {
    const folderPath = "Uploads/DishDiet";
    const folderPathNew = "Uploads/tempFolderPath";
    fs.readdirSync(folderPath).forEach(async (file) => {
      if (!file.endsWith(".png") && !file.endsWith(".jpg")) {
        // Construct the new file name with .png extension
        const newFileName = file + ".png";
        const oldFilePath = `${folderPath}/${file}`;
        const newFilePath = `${folderPathNew}/${newFileName}`;
        // Rename the file in the local folder
        fs.renameSync(oldFilePath, newFilePath);
      }
    });
  } catch (error) {
    console.error("Error uploading images:", error);
  }
};
