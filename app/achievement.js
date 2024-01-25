import { uploadFileToCloud } from "./utils/cloudinary.js";
import fs from "fs";

// Path to your local folder containing the images
const folderPath = "Uploads/Achievement";

export const uploadAchievement = (req, res) => {
  // Read the files from the folder
  try {
    fs.readdirSync(folderPath).forEach(async (file) => {
      // Construct the full path to the image file
      const filePath = `${folderPath}/${file}`;
      const imageName = file.substring(0, file.lastIndexOf("."));
      // Upload the image to Cloudinary with the original filename and folder
      await uploadFileToCloud(filePath, "achievement", imageName);
    });
    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "An error occurred while uploading images" });
  }
};
// be url: https://res.cloudinary.com/eatsycdn/image/upload/v1706155874/activity/
