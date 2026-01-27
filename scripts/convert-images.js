import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up one level to root
const rootDir = path.join(__dirname, '..');

const filesToConvert = [
    'assets/images/13.PNG',
    'admin/assets/images/1.png',
    'admin/assets/images/2.png',
    'admin/assets/images/backimage.png'
];

async function convertImages() {
    for (const relativePath of filesToConvert) {
        const inputPath = path.join(rootDir, relativePath);
        const dir = path.dirname(inputPath);
        const ext = path.extname(inputPath);
        const name = path.basename(inputPath, ext);
        const outputPath = path.join(dir, `${name}.webp`);

        try {
            if (fs.existsSync(inputPath)) {
                console.log(`Converting: ${relativePath}...`);
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`Successfully converted to: ${outputPath}`);
            } else {
                console.warn(`File not found: ${relativePath}`);
            }
        } catch (error) {
            console.error(`Error converting ${relativePath}:`, error);
        }
    }
}

convertImages();
