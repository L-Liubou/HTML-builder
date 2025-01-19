const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');
const bundleCss = path.join(projectDist, 'bundle.css');

async function mergeStyles() {
  try {
    if (!fs.existsSync(projectDist)) {
      fs.mkdirSync(projectDist);
    }
    const files = await fs.promises.readdir(stylesDir, { withFileTypes: true });
    const styles = [];

    for (const file of files) {
      const filePath = path.join(stylesDir, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        styles.push(data);
      }
    }
    await fs.promises.writeFile(bundleCss, styles.join('\n'));
    console.log(
      '\x1b[93mThe styles have been successfully merged into ./project-dist/bundle.css\x1b[0m',
    );
  } catch (err) {
    console.error('\x1b[91mError during merge styles process:\x1b[0m', err);
  }
}

mergeStyles().catch((err) => {
  console.error('\x1b[91mError during merge styles process:\x1b[0m', err);
});
