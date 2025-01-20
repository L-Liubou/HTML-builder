const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

const colors = {
  yellow: '\x1b[93m',
  blue: '\x1b[94m',
  white: '\x1b[97m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(
      `${colors.red}Error reading a folder: ${err.message}${colors.reset}`,
    );
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const { name, ext } = path.parse(file.name);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(
            `${colors.red}Error in receiving information: ${err.message}${colors.reset}`,
          );
          return;
        }
        const fileSize = (stats.size / 1024).toFixed(2);
        console.log(`${colors.yellow}${name}${colors.reset} - ${colors.blue}${ext.slice(1)}${colors.reset} - ${colors.white}${fileSize}kb${colors.reset}`);});
    }
  });
});
