const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar';
const blogDir = path.join(rootDir, 'blog');

// 1. Update blog.html
const blogHtmlPath = path.join(rootDir, 'blog.html');
if (fs.existsSync(blogHtmlPath)) {
    let content = fs.readFileSync(blogHtmlPath, 'utf8');

    const oldGet = `$.getJSON(COMMENTS_API_URL + '?action=get_metrics&pageId=' + postKey, function(data) {`;
    const newGet = `$.getJSON(COMMENTS_API_URL + '?action=get_metrics&pageId=' + postKey + '&cb=' + new Date().getTime(), function(data) {`;

    if (content.includes(oldGet)) {
        content = content.replace(oldGet, newGet);
        fs.writeFileSync(blogHtmlPath, content, 'utf8');
        console.log("Successfully added cache-buster in blog.html");
    } else {
        console.log("Could not find target $.getJSON in blog.html");
    }
}

// 2. Update individual article HTML files
const files = [
    'ia-impacto.html',
    'monitoramento-ativo.html',
    'manutencao-computadores.html',
    'template.html'
];

files.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        const oldGet = `$.getJSON(COMMENTS_API_URL + '?action=get_metrics&increment=true&pageId=' + viewsKey, function(data) {`;
        const newGet = `$.getJSON(COMMENTS_API_URL + '?action=get_metrics&increment=true&pageId=' + viewsKey + '&cb=' + new Date().getTime(), function(data) {`;

        if (content.includes(oldGet)) {
            content = content.replace(oldGet, newGet);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully added cache-buster in: ${file}`);
        } else {
            console.log(`Target $.getJSON not found in: ${file}`);
        }
    }
});
