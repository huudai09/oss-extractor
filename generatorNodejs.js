const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const exportCSV = require("./exportCSV");

const getPackageInfo = (package) => {
  return new Promise((resolve) => {
    const { name, version } = package;
    const packageLink = `https://www.npmjs.com/package/${name}`;
    const tryToGetDesc = (paragraph) => {
      const getDesc = (index) => paragraph.eq(index).text();
      let desc = getDesc(1);

      if (!desc) {
        desc = getDesc(2);
      }

      if (!desc) {
        desc = getDesc(3);
      }

      return desc;
    };

    setTimeout(() => {
      axios.get(packageLink).then((res) => {
        const $ = cheerio.load(res.data);
        const licenseElem = $(".f2874b88").eq(1);
        const license = licenseElem.text();
        const paragraph = $("._6d9832ac p");
        const desc = tryToGetDesc(paragraph);

        const data = {
          name,
          version,
          license,
          desciption: desc,
          refer: packageLink,
        };

        resolve(data);
      });
    }, 150);
  });
};

const generator = (oss) => {
  return new Promise((resolve) => {
    const content = require(path.join(__dirname, "/oss", oss.path));
    const promises = [];

    console.log("scan nodejs packages");
    for (const package in content.dependencies) {
      const version = content.dependencies[package];
      promises.push(getPackageInfo({ name: package, version }));
    }

    Promise.all(promises)
      .then((value) => {
        console.log("all nodejs packages scanned");
        exportCSV(oss.name, value);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports = generator;
