// 通过 md-template 和 src-example 构建 README.md

const fs = require("fs/promises");
const path = require("path");

async function readTSFilesAndWriteToMD(directoryPath, outputPath) {
  try {
    const files = await fs.readdir(directoryPath);
    let mdContent = ""; // To accumulate content for the example.md file

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStat = await fs.stat(filePath);

      if (fileStat.isDirectory()) {
        await readTSFilesAndWriteToMD(filePath, outputPath); // Recursive call for nested directories
      } else if (file.endsWith(".ts")) {
        const fileContent = await fs.readFile(filePath, "utf-8");
        mdContent += `
### ${filePath}

\`\`\`typescript

//${filePath}
${fileContent}

\`\`\`
`;
      }
    }

    // Write the accumulated content to example.md
    await fs.writeFile(path.join(outputPath, "example.md"), mdContent);
    console.log("Content written to example.md successfully.");
  } catch (err) {
    console.error("Error reading files:", err);
  }
}

// Replace 'src-example' with your directory path and 'md-template' with the output directory path
readTSFilesAndWriteToMD("src-example", "md-template");

const mds = ["base.md", "example-head.md", "example.md"];

async function mergeFilesAndWriteToReadme(
  directoryPath,
  fileNames,
  readmePath
) {
  try {
    let mergedContent = "";

    for (const fileName of fileNames) {
      const filePath = path.join(directoryPath, fileName);
      const fileContent = await fs.readFile(filePath, "utf-8");
      mergedContent += `${fileContent}\n\n`;
    }

    await fs.writeFile(readmePath, mergedContent.trim());
    console.log("Content merged and written to README2.md successfully.");
  } catch (err) {
    console.error("Error merging files:", err);
  }
}

// 合并md文件
mergeFilesAndWriteToReadme("md-template", mds, "README.md");
