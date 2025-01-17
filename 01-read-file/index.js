const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath, 'utf-8');

stream.on('data', (chunk) => process.stdout.write(chunk));
stream.on('error', (err) => {
  console.error('\x1b[91mError reading file:\x1b[0m', err.message);
});
