const fs = require('fs');
const path = require('path');

const servicesDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar\\servicos';

fs.readdirSync(servicesDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(servicesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if main-v1.js is already imported
        if (!content.includes('main-v1.js')) {
            // Insert script before </body>
            const insertScript = '\n    <script src="../js/main-v1.js?v=3"></script>\n';
            
            if (content.includes('</body>')) {
                content = content.replace('</body>', insertScript + '</body>');
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Injected main-v1.js script import into: ${file}`);
            } else {
                console.log(`Could not find </body> in: ${file}`);
            }
        } else {
            console.log(`main-v1.js already imported in: ${file}`);
        }
    }
});
