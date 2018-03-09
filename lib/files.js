const path = require('path');
const fs   = require('fs');

const getPath = () => {
  return path.basename(process.cwd());
}

const directoryExists = (file) => {
  try {
    return fs.statSync(file).isDirectory();
  } catch (err) {
    return false;
  }
}

module.exports = {
  getPath,
  directoryExists,
}
