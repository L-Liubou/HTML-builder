const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const newIndex = path.join(projectDist, 'index.html');
const bundleCss = path.join(projectDist, 'style.css');
const newAssets = path.join(projectDist, 'assets');

let templateFile = path.join(__dirname, 'template.html');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const componentsDir = path.join(__dirname, 'components');

async function createProjectDist() {
  try {
    await fs.promises.mkdir(projectDist, { recursive: true });
  } catch (err) {
    console.error('\x1b[91mError creating "project-dist" folder:\x1b[0m', err);
  }
}

async function replaceTemplateTags() {
  try {
    let templateContent = await fs.promises.readFile(templateFile, 'utf-8');
    const componentsFiles = await fs.promises.readdir(componentsDir, {
      withFileTypes: true,
    });

    for (const file of componentsFiles) {
      const filePath = path.join(componentsDir, file.name);

      if (file.isFile() && path.extname(file.name) === '.html') {
        const componentName = path.basename(file.name, '.html');
        const componentContent = await fs.promises.readFile(filePath, 'utf-8');
        templateContent = templateContent.replace(
          new RegExp(`{{${componentName}}}`, 'g'),
          componentContent,
        );
      }
    }
    await fs.promises.writeFile(newIndex, templateContent, 'utf-8');
  } catch (err) {
    console.error('\x1b[91mError during HTML build process:\x1b[0m', err);
  }
}

async function copyDir(oldDir, newDir) {
  try {
    if (!fs.existsSync(oldDir)) {
      console.error('\x1b[91"Assets" folder is not found\x1b[0m');
      return;
    }
    await fs.promises.rm(newDir, { recursive: true, force: true });
    await fs.promises.mkdir(newDir, { recursive: true });

    const files = await fs.promises.readdir(oldDir, { withFileTypes: true });
    for (const file of files) {
      const oldFilePath = path.join(oldDir, file.name);
      const newFilePath = path.join(newDir, file.name);

      if (file.isDirectory()) {
        await copyDir(oldFilePath, newFilePath);
      } else {
        await fs.promises.copyFile(oldFilePath, newFilePath);
      }
    }
  } catch (err) {
    console.error('\x1b[91mError during copy process:\x1b[0m', err);
  }
}

async function mergeStyles() {
  try {
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
  } catch (err) {
    console.error('\x1b[91mError during merge styles process:\x1b[0m', err);
  }
}

async function buildPage() {
  try {
    await createProjectDist();
    await replaceTemplateTags();
    await mergeStyles();
    await copyDir(assetsDir, newAssets);
    console.log(
      '\x1b[95m"Project-dist" folder was successfully created!\x1b[0m',
    );
  } catch (err) {
    console.error('\x1b[91mAssembly error:\x1b[0m', err);
  }
}

buildPage().catch((err) => {
  console.error('\x1b[91mAssembly error:\x1b[0m', err);
});
