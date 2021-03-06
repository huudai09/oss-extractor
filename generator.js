const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const csv = require("fast-csv");

const exportCSV = (name, values) => {
  // const csvStream = csv.format({ headers: true });

  // csvStream.pipe(process.stdout).on("end", () => process.exit());

  // for (let i = 0; i < values.length; i++) {
  //   const value = values[i];
  //   csvStream.write(value);
  // }
  // csvStream.end();
  const filePath = path.resolve(__dirname, `${name}.csv`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  csv
    .writeToPath(filePath, values, { headers: true })
    .on("error", (err) => console.error(err))
    .on("finish", () => console.log("Done writing."));
};

const getPythonPackageInfo = (package) => {
  return new Promise((resolve) => {
    const [name, version] = package;
    const packageLink = `https://pypi.org/project/${name}`;

    axios.get(packageLink).then((res) => {
      const $ = cheerio.load(res.data);
      const licenseElem = $(".vertical-tabs__tabs .sidebar-section")
        .eq(3)
        .find("p")
        .eq(0);
      const license = licenseElem.text().replace(/^license:\s+/i, "");
      const data = {
        name,
        version,
        license,
        desciption: $(".package-description__summary").text(),
        refer: packageLink,
      };

      resolve(data);
    });
  });
};

exports.generatePython = (oss) => {
  return new Promise((resolve) => {
    const content = fs.readFileSync(
      path.join(__dirname, "/oss", oss.path),
      "utf-8"
    );
    const extractVersion = (p) => {
      const s = p.split("==");
      return s;
    };

    const packageArr = content
      .split(/\r|\r\n|\n/)
      .filter(Boolean)
      .map(extractVersion);

    const promises = [];
    for (let i = 0; i < packageArr.length; i++) {
      const package = packageArr[i];
      promises.push(getPythonPackageInfo(package));
    }

    Promise.all(promises).then((value) => {
      exportCSV("python-oss-list", value);
    });
  });
};

exports.generateNodejs = () => {};
