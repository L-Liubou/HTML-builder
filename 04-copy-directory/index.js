const fs = require('fs');
const path = require('path');

const oldDirPath = path.join(__dirname, 'files');
const newDirPath = path.join(__dirname, 'files-copy');

async function copyDir(oldDir, newDir) {
  if (!fs.existsSync(oldDir)) {
    console.error('\x1b[91mCan not find "files" directory\x1b[0m');
    return;
  }
  try {
    await fs.promises.rm(newDir, { recursive: true, force: true });
    await fs.promises.mkdir(newDir, { recursive: true });
    const files = await fs.promises.readdir(oldDir, { withFileTypes: true });

    for (const file of files) {
      const oldFilePath = path.join(oldDir, file.name);
      const newFilePath = path.join(newDir, file.name);
      if (file.isFile()) {
        await fs.promises.copyFile(oldFilePath, newFilePath);
      }
    }
    console.log('\x1b[92mThe folder was successfully copied/update\x1b[0m');
  } catch (err) {
    console.error('\x1b[91mError during copy process:\x1b[0m', err);
  }
}

copyDir(oldDirPath, newDirPath).catch((err) => {
  console.error('\x1b[91mError during copy process:\x1b[0m', err);
});
