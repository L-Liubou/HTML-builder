const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
let writeStream = fs.createWriteStream(filePath, {
  flags: 'a',
  autoClose: true,
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const colors = {
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

console.log(`${colors.magenta}To add text to the file enter the text below and press 'ENTER'.
To end the recording and exit enter ‘exit’ or press 'CTRL/Control + C'.${colors.reset}`);

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    sayGoodbye();
  } else {
    writeStream.write(input + '\n', (err) => {
      if (err) {
        console.error(`
        ${colors.red}Error writing to file: ${err.message}${colors.reset}`);
      } else {
        reopenStream();
      }
    });
  }
});

function reopenStream() {
  writeStream.end();
  writeStream = fs.createWriteStream(filePath, { flags: 'a', autoClose: true });
}

function sayGoodbye() {
  console.log(`${colors.cyan}Recording is complete!
You can open the text.txt file to view it.${colors.reset}`);
  rl.close();
  writeStream.end();
}

rl.on('SIGINT', sayGoodbye);
