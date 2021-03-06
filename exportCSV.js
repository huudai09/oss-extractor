const csv = require("fast-csv");
const path = require("path");
const fs = require("fs");

module.exports = (name, values) => {
  const filePath = path.resolve(__dirname, `output/${name}.csv`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  csv
    .writeToPath(filePath, values, { headers: true })
    .on("error", (err) => console.error(err))
    .on("finish", () => console.log(`generated ${filePath.toString()}`));
};
