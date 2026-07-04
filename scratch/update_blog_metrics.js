const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar';
const blogDir = path.join(rootDir, 'blog');

const targetUrl = 'https://script.google.com/macros/s/AKfycbxjIQEv4uWt8uEXWq3_9pR_-_bm4BIKzDChL8Vo1k9YTCY5r2DUVVOqkBl3zQpYnmfbhQ/exec';

// 1. Update blog.html script block
const blogHtmlPath = path.join(rootDir, 'blog.html');
if (fs.existsSync(blogHtmlPath)) {
    let content = fs.readFileSync(blogHtmlPath, 'utf8');

    const oldScriptBlockStart = '// Artigo 1: IA Impacto';
    const oldScriptBlockEnd = '// -------------------------------------------------------------';
    
    const startIndex = content.indexOf(oldScriptBlockStart);
    const endIndex = content.indexOf(oldScriptBlockEnd, startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
        const textToReplace = content.substring(startIndex, endIndex);
        
        const newScriptBlock = `var COMMENTS_API_URL = '${targetUrl}';

            function loadPostMetrics(postKey, viewsEl, likesEl, baseViews, baseLikes) {
                if (COMMENTS_API_URL) {
                    $.getJSON(COMMENTS_API_URL + '?action=get_metrics&pageId=' + postKey, function(data) {
                        var views = (parseInt(data.views) || 0) + baseViews;
                        var likes = (parseInt(data.likes) || 0) + baseLikes;
                        $(viewsEl).text(views);
                        $(likesEl).text(likes);
                    }).fail(function() {
                        $(viewsEl).text(localStorage.getItem(postKey + '_views') || baseViews);
                        $(likesEl).text(localStorage.getItem(postKey + '_likes') || baseLikes);
                    });
                } else {
                    $(viewsEl).text(localStorage.getItem(postKey + '_views') || baseViews);
                    $(likesEl).text(localStorage.getItem(postKey + '_likes') || baseLikes);
                }
            }
            
            loadPostMetrics('blog_views_ia_impacto', '#ia-views-count', '#ia-likes-count', 100, 52);
            loadPostMetrics('blog_views_monitoramento_ativo', '#mon-views-count', '#mon-likes-count', 100, 30);
            loadPostMetrics('blog_views_manutencao_computadores', '#man-views-count', '#man-likes-count', 0, 0);

            `;

        content = content.replace(textToReplace, newScriptBlock);
        fs.writeFileSync(blogHtmlPath, content, 'utf8');
        console.log("Successfully updated blog.html metrics script.");
    } else {
        console.log("Could not find start/end markers in blog.html");
    }
}

// 2. Update individual article HTML files
const blogFiles = [
    { name: 'ia-impacto.html', baseViews: 100, baseLikes: 52 },
    { name: 'monitoramento-ativo.html', baseViews: 100, baseLikes: 30 },
    { name: 'manutencao-computadores.html', baseViews: 0, baseLikes: 0 },
    { name: 'template.html', baseViews: 0, baseLikes: 0 }
];

blogFiles.forEach(file => {
    const filePath = path.join(blogDir, file.name);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Locate from "// View and Like Counters (LocalStorage tracking)" to where the comment submission script starts
        const startMarker = '// View and Like Counters (LocalStorage tracking)';
        const endMarker = '// Comments Engine';

        const startIndex = content.indexOf(startMarker);
        const endIndex = content.indexOf(endMarker, startIndex);

        if (startIndex !== -1 && endIndex !== -1) {
            const textToReplace = content.substring(startIndex, endIndex);

            const newMetricsCode = `// View and Like Counters (Google Sheets tracking)
            var baselineViews = ${file.baseViews};
            var baselineLikes = ${file.baseLikes};
            
            function loadMetrics() {
                if (COMMENTS_API_URL) {
                    // Fetch and increment view count on load
                    $.getJSON(COMMENTS_API_URL + '?action=get_metrics&increment=true&pageId=' + commentsKey, function(data) {
                        var totalViews = (parseInt(data.views) || 0) + baselineViews;
                        var totalLikes = (parseInt(data.likes) || 0) + baselineLikes;
                        $('#views-count').text(totalViews);
                        $('#likes-count').text(totalLikes);
                    }).fail(loadLocalFallback);
                } else {
                    loadLocalFallback();
                }
            }
            
            function loadLocalFallback() {
                var viewsKey = commentsKey + '_views';
                var likesKey = commentsKey + '_likes';
                
                var views = parseInt(localStorage.getItem(viewsKey) || '0');
                // Increment once per browser session
                if (!sessionStorage.getItem(viewsKey + '_session')) {
                    views += 1;
                    localStorage.setItem(viewsKey, views);
                    sessionStorage.setItem(viewsKey + '_session', 'true');
                }
                
                var likes = parseInt(localStorage.getItem(likesKey) || '0');
                
                $('#views-count').text(views + baselineViews);
                $('#likes-count').text(likes + baselineLikes);
            }
            
            loadMetrics();
        
            // Like Interaction
            $('#btn-like').click(function() {
                if (localStorage.getItem(commentsKey + '_liked')) {
                    alert('Você já curtiu este artigo!');
                    return;
                }
                
                if (COMMENTS_API_URL) {
                    $.ajax({
                        url: COMMENTS_API_URL + '?action=like&pageId=' + commentsKey,
                        method: 'POST',
                        success: function(data) {
                            localStorage.setItem(commentsKey + '_liked', 'true');
                            $('#btn-like').addClass('liked').css('color', '#eed70f');
                            loadMetrics();
                        }
                    });
                } else {
                    var likesKey = commentsKey + '_likes';
                    var likes = parseInt(localStorage.getItem(likesKey) || '0') + 1;
                    localStorage.setItem(likesKey, likes);
                    localStorage.setItem(commentsKey + '_liked', 'true');
                    $('#btn-like').addClass('liked').css('color', '#eed70f');
                    loadMetrics();
                }
            });
            
            if (localStorage.getItem(commentsKey + '_liked')) {
                $('#btn-like').addClass('liked').css('color', '#eed70f');
            }

            `;

            content = content.replace(textToReplace, newMetricsCode);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully updated metrics code in: ${file.name}`);
        } else {
            console.log(`Could not find metrics code markers in: ${file.name}`);
        }
    }
});
