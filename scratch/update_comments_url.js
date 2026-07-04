const fs = require('fs');
const path = require('path');

const blogDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar\\blog';
const filesToUpdate = [
    'ia-impacto.html',
    'monitoramento-ativo.html',
    'manutencao-computadores.html',
    'template.html'
];

const targetUrl = 'https://script.google.com/macros/s/AKfycbxjIQEv4uWt8uEXWq3_9pR_-_bm4BIKzDChL8Vo1k9YTCY5r2DUVVOqkBl3zQpYnmfbhQ/exec';

filesToUpdate.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Search for the empty variable declaration
        const targetSearch = "var COMMENTS_API_URL = '';";
        const targetReplacement = `var COMMENTS_API_URL = '${targetUrl}';`;
        
        if (content.includes(targetSearch)) {
            content = content.replace(targetSearch, targetReplacement);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully configured COMMENTS_API_URL in: ${file}`);
        } else {
            console.log(`Target variable declaration not found or already updated in: ${file}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
