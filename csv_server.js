const multer = require("multer");
const csv = require("fast-csv");
const fs = require("fs");
const express = require("express");
const redis = require("redis");

const redisClient = redis.createClient(process.env.REDIS_URL);

const app = express();
const PORT = process.env.PORT || 5001;

global.__basedir = __dirname;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    console.log(file);
    cb("Please upload csv only.", false);
  }
};

const upload = multer({ storage: storage, fileFilter: csvFilter });

app.get("/", function (req, res) {
  res.send("GET request to homepage");
});
// curl --location --request POST 'http://localhost:5001/players' \
// --form 'file=@"/Users/nirshtein/Development/GitHub/NodeServer/players.csv"'
app.post("/players", upload.single("file"), (req, res) => {
  if (req.file == undefined) {
    return res.status(400).send({ message: "Please upload csv file." });
  }

  let csvData = [];
  let filePath = __basedir + "/uploads/" + req.file.filename;
  fs.createReadStream(filePath)
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => {
      throw error.message;
    })
    .on("data", (row) => {
      csvData.push(row);
    })
    .on("end", () => {
      console.log("csvData");
      console.log(csvData);
      res.send(200);
    });
});

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
