import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
import { requestLogger } from "./app/utils/logger.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const EnumCommonCode = {
  Success: 1,
  Error: -1,
  Error_Info_NotFound: -2,
};

// Now you can use __dirname in your code
console.log(__dirname);

const app = express();
const port = 3000;
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "Uploads/" + (req?.body?.SubDir ?? "Default");

    // Check if the directory exists
    if (!fs.existsSync(uploadDir)) {
      // Create the directory if it doesn't exist
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

app.get("/Content/Media", (req, res) => {
  const imageUrl = req.query.url; // Get the image URL from the query parameter
  const filePath = path.join(__dirname, "Uploads", imageUrl);
  console.log("filePath::", filePath);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found, send the default image instead
      const defaultImagePath = path.join(__dirname, "Uploads", "default.png");
      res.sendFile(defaultImagePath);
    } else {
      // File found, send the requested image as the response
      res.sendFile(filePath);
    }
  });
});
//"https://cdn.eatsy.vn/api/upload/images"
app.post("/api/upload/images", upload.array("photos", 10), function (req, res) {
  var uploadedList = [];
  var returnModel = {};
  if (req.files.length < 1) {
    returnModel.Code = EnumCommonCode.Error;
    return res.status(500).json(returnModel);
  }

  try {
    var subDir = "img";

    if (req.body) {
      subDir = req.body?.SubDir ?? "Default";
    }

    var baseUrl = req.protocol + "://" + req.get("host");

    req.files.forEach(function (file) {
      var subDirPath = "/" + subDir;
      var returnFile = {
        Path: subDirPath + "/" + file.filename,
        FullPath:
          baseUrl + "/Content/Media?url=" + subDirPath + "/" + file.filename,
      };

      uploadedList.push(returnFile);
    });

    returnModel.Code = EnumCommonCode.Success;
    returnModel.Data = uploadedList;
  } catch (ex) {
    var strError = "Failed for UPLOAD IMAGES: " + ex.message;
    returnModel.Code = EnumCommonCode.Error;
    returnModel.Msg = strError;

    return res.status(200).json(returnModel);
  }

  return res.status(200).json(returnModel);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
