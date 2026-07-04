const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar';
const blogDir = path.join(rootDir, 'blog');

const targetUrl = 'https://script.google.com/macros/s/AKfycbxjIQEv4uWt8uEXWq3_9pR_-_bm4BIKzDChL8Vo1k9YTCY5r2DUVVOqkBl3zQpYnmfbhQ/exec';

// 1. Update blog.html script block
const blogHtmlPath = path.join(rootDir, 'blog.html');
if (fs.existsSync(blogHtmlPath)) {
    let content = fs.readFileSync(blogHtmlPath, 'utf8');

    const oldScriptBlockStart = 'var COMMENTS_API_URL =';
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
    }
}

// 2. monitoramento-ativo.html, ia-impacto.html, template.html are already updated. We only need to target manutencao-computadores.html.
const manFile = path.join(blogDir, 'manutencao-computadores.html');
if (fs.existsSync(manFile)) {
    let content = fs.readFileSync(manFile, 'utf8');
    const oldBlock = `            // Real Views Engine (starts at 0 if not set)
            var views = localStorage.getItem(viewsKey);
            if (views === null) {
                views = 0;
            } else {
                views = parseInt(views);
            }
            views += 1;
            localStorage.setItem(viewsKey, views);
            $('#man-views-detail').text(views);

            // Likes Engine (starts at 0 if not set)
            var likes = localStorage.getItem(likesKey);
            if (likes === null) {
                likes = 0;
            } else {
                likes = parseInt(likes);
            }
            $('#man-likes-detail').text(likes);

            if (localStorage.getItem(likedKey) === 'true') {
                $('#like-btn').addClass('liked');
            }

            $('#like-btn').click(function() {
                if (localStorage.getItem(likedKey) === 'true') {
                    likes = Math.max(0, likes - 1);
                    localStorage.setItem(likesKey, likes);
                    localStorage.setItem(likedKey, 'false');
                    $(this).removeClass('liked');
                } else {
                    likes += 1;
                    localStorage.setItem(likesKey, likes);
                    localStorage.setItem(likedKey, 'true');
                    $(this).addClass('liked');
                }
                $('#man-likes-detail').text(likes);
            });`;

    const newBlock = `            // View and Like Counters (Google Sheets tracking)
            var baselineViews = 0;
            var baselineLikes = 0;
            
            function loadMetrics() {
                if (COMMENTS_API_URL) {
                    $.getJSON(COMMENTS_API_URL + '?action=get_metrics&increment=true&pageId=' + viewsKey, function(data) {
                        var totalViews = (parseInt(data.views) || 0) + baselineViews;
                        var totalLikes = (parseInt(data.likes) || 0) + baselineLikes;
                        $('#man-views-detail').text(totalViews);
                        $('#man-likes-detail').text(totalLikes);
                    }).fail(loadLocalFallback);
                } else {
                    loadLocalFallback();
                }
            }
            
            function loadLocalFallback() {
                var views = parseInt(localStorage.getItem(viewsKey) || '0');
                if (!sessionStorage.getItem(viewsKey + '_session')) {
                    views += 1;
                    localStorage.setItem(viewsKey, views);
                    sessionStorage.setItem(viewsKey + '_session', 'true');
                }
                var likes = parseInt(localStorage.getItem(likesKey) || '0');
                $('#man-views-detail').text(views + baselineViews);
                $('#man-likes-detail').text(likes + baselineLikes);
            }
            
            loadMetrics();
        
            // Like Interaction
            $('#like-btn').click(function() {
                if (localStorage.getItem(likedKey) === 'true') {
                    alert('Você já curtiu este artigo!');
                    return;
                }
                
                if (COMMENTS_API_URL) {
                    $.ajax({
                        url: COMMENTS_API_URL + '?action=like&pageId=' + viewsKey,
                        method: 'POST',
                        success: function(data) {
                            localStorage.setItem(likedKey, 'true');
                            $('#like-btn').addClass('liked');
                            loadMetrics();
                        }
                    });
                } else {
                    var likes = parseInt(localStorage.getItem(likesKey) || '0') + 1;
                    localStorage.setItem(likesKey, likes);
                    localStorage.setItem(likedKey, 'true');
                    $('#like-btn').addClass('liked');
                    loadMetrics();
                }
            });
            
            if (localStorage.getItem(likedKey) === 'true') {
                $('#like-btn').addClass('liked');
            }`;

    if (content.includes(oldBlock)) {
        content = content.replace(oldBlock, newBlock);
        fs.writeFileSync(manFile, content, 'utf8');
        console.log("Successfully updated manutencao-computadores.html metrics.");
    } else {
        console.log("Could not find targets in manutencao-computadores.html");
    }
}
