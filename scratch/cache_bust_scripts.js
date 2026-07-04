const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar';

function processDir(directory) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file === 'blog' || file === 'servicos') {
                processDir(fullPath);
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace main-v1.js?v=2 or main-v1.js with main-v1.js?v=3
            if (content.includes('main-v1.js?v=2')) {
                content = content.replace(/main-v1\.js\?v=2/g, 'main-v1.js?v=3');
                modified = true;
            } else if (content.includes('main-v1.js')) {
                content = content.replace(/main-v1\.js/g, 'main-v1.js?v=3');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated cache-bust version in: ${path.relative(rootDir, fullPath)}`);
            }
        }
    });
}

processDir(rootDir);
