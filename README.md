# oss-extractor
A simple tool to extract OSS information (nodejs, python) to csv file

## Usage

- First, copy `package.json` or `requirements.txt` (or any file you want, but keep the file format) into `/oss` folder
- Update `ossPackages` variable inside `index.js` file as follows

  ```javascript
  const ossPackages = [
    { path: "package.json", lang: "node", name: "NodeJSOSS" },
    { path: "requirements.txt", lang: "python", name: "PythonOSS" },
  ];
  ```
- Lastly, run the commit and get the result in `/output` folder

  ```shell
  $ node .
  ```

### Important
Nodejs only read the file format of `package.json` and Python read `requirements.txt` format

Therefore, you can use any file with any names but keep the format

