import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bodyParser from "body-parser";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/img"); // Thay đổi đường dẫn tới thư mục lưu trữ tùy theo yêu cầu
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Now you can use __dirname in your code
console.log(__dirname);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/Content/Media", (req, res) => {
  console.log("ZOOOOO");
  const imageUrl = req.query.url; // Get the image URL from the query parameter

  // Construct the file path based on the URL
  const filePath = path.join(__dirname, "Uploads", imageUrl);

  // Send the image file as the response
  res.sendFile(filePath);
});

app.post("api/upload/images", upload.array("photos", 10), function (req, res) {
  var uploadedList = [];
  var returnModel = {};

  if (req.files.length < 1) {
    returnModel.Code = "Error";
    return res.status(200).json(returnModel);
  }

  try {
    var objectId = 0;
    var subDir = "img";
    var includeDatePath = true;

    if (req.body.MyFormData) {
      var vals = req.body.MyFormData;
      var vals2 = new URLSearchParams(vals);
      objectId = parseInt(vals2.get("ObjectId"));
      subDir = vals2.get("SubDir");
      includeDatePath = vals2.get("InCludeDatePath") === "true";
    }

    if (objectId <= 0) objectId = parseInt(req.query.ObjectId);

    var baseUrl = req.protocol + "://" + req.get("host");

    req.files.forEach(function (file) {
      var fileDir = "";
      var subDirPath =
        objectId > 0 ? "/" + subDir + "/" + objectId : "/" + subDir;
      var returnFile = {
        Path: subDirPath + "/" + file.filename,
        FullPath:
          baseUrl + "/Content/Media?url=" + subDirPath + "/" + file.filename,
      };

      uploadedList.push(returnFile);
    });

    returnModel.Code = "Success";
    returnModel.Data = uploadedList;
  } catch (ex) {
    var strError = "Failed for UPLOAD IMAGES: " + ex.message;
    returnModel.Code = "Error";
    returnModel.Msg = strError;

    return res.status(200).json(returnModel);
  }

  return res.status(200).json(returnModel);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
