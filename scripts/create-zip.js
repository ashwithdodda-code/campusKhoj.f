import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const sourceDir = path.resolve(process.cwd(), 'CampusKhoj-Full-Stack-Java');
const publicDir = path.resolve(process.cwd(), 'public');
const rootZipPath = path.resolve(process.cwd(), 'CampusKhoj-Full-Stack-Java.zip');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}
const publicZipPath = path.join(publicDir, 'CampusKhoj-Full-Stack-Java.zip');

function addFolderToZip(zip, folderPath, rootPath) {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
        const fullPath = path.join(folderPath, item);
        const relativePath = path.relative(rootPath, fullPath).replace(/\\/g, '/');
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            zip.folder(relativePath);
            addFolderToZip(zip, fullPath, rootPath);
        } else {
            const fileData = fs.readFileSync(fullPath);
            zip.file(relativePath, fileData);
        }
    }
}

async function packageZip() {
    console.log(`Packaging directory: ${sourceDir}`);
    const zip = new JSZip();
    const projectFolder = zip.folder('CampusKhoj-Full-Stack-Java');

    addFolderToZip(projectFolder, sourceDir, sourceDir);

    console.log('Generating ZIP buffer...');
    const content = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
    });

    fs.writeFileSync(publicZipPath, content);
    fs.writeFileSync(rootZipPath, content);
    console.log(`ZIP successfully generated! Size: ${content.length} bytes`);
    console.log(`Saved to: ${publicZipPath}`);
    console.log(`Saved to: ${rootZipPath}`);
}

packageZip().catch(err => {
    console.error('Packaging failed:', err);
    process.exit(1);
});
