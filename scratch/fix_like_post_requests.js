const fs = require('fs');
const path = require('path');

const blogDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar\\blog';
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

        // Locate the target AJAX call
        const oldAjaxBlock = `                    $.ajax({
                        url: COMMENTS_API_URL + '?action=like&pageId=' + viewsKey,
                        method: 'POST',
                        success: function(data) {`;

        const newAjaxBlock = `                    $.ajax({
                        url: COMMENTS_API_URL,
                        method: 'POST',
                        data: {
                            action: 'like',
                            pageId: viewsKey
                        },
                        success: function(data) {`;

        if (content.includes(oldAjaxBlock)) {
            content = content.replace(oldAjaxBlock, newAjaxBlock);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully fixed like button post request payload in: ${file}`);
        } else {
            console.log(`Target AJAX block not found in: ${file}`);
        }
    }
});
