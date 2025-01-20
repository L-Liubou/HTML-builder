const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath, 'utf-8');

let isEmpty = true;

stream.on('data', (chunk) => {
  isEmpty = false;
  process.stdout.write(chunk);
});

stream.on('end', () => {
  if (isEmpty) {
    console.log('\x1b[90mThe file is empty now\x1b[0m');
  }
});

stream.on('error', (err) => {
  console.error('\x1b[91mError reading file:\x1b[0m', err.message);
});
