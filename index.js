const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001;

const parseCsv = require("csv-parse").parse;

app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("GET request to homepage");
});

app.post("/players", (req, res) => {
  const data = req.body.data;
  console.log(req.body);
  //   result = parseCsv(data, { delimiter: ",", from_line: 2 });
  //   console.log(result);
});

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
