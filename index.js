const generatePython = require("./generatorPython");
const generateNodejs = require("./generatorNodejs");

const ossPackages = [
  { path: "package.json", lang: "node", name: "NodeJSOSS" },
  { path: "requirements.txt", lang: "python", name: "PythonOSS" },
];

ossPackages.forEach((oss) => {
  if (oss.lang === "node") {
    console.log('generating NodeJS OSS List')
    generateNodejs(oss);
  }

  if (oss.lang === "python") {
    console.log('generating Python OSS List')
    generatePython(oss);
  }
});
