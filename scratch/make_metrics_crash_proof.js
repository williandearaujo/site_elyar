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

        // Locate the target loadMetrics, loadLocalFallback and like-btn click handler and replace with crash-proof variants
        const startMarker = '// View and Like Counters (Google Sheets tracking)';
        const endMarker = '// Comments Engine';

        const startIndex = content.indexOf(startMarker);
        const endIndex = content.indexOf(endMarker, startIndex);

        if (startIndex !== -1 && endIndex !== -1) {
            const textToReplace = content.substring(startIndex, endIndex);

            // Determine specific span IDs and baselines based on file name
            let viewsEl = '#ia-views-detail';
            let likesEl = '#ia-likes-detail';
            let baseViews = 100;
            let baseLikes = 52;

            if (file === 'monitoramento-ativo.html') {
                viewsEl = '#mon-views-detail';
                likesEl = '#mon-likes-detail';
                baseViews = 100;
                baseLikes = 30;
            } else if (file === 'manutencao-computadores.html') {
                viewsEl = '#man-views-detail';
                likesEl = '#man-likes-detail';
                baseViews = 0;
                baseLikes = 0;
            } else if (file === 'template.html') {
                viewsEl = '#article-views-detail';
                likesEl = '#article-likes-detail';
                baseViews = 100;
                baseLikes = 30;
            }

            const newMetricsCode = `// View and Like Counters (Google Sheets tracking)
            var baselineViews = ${baseViews};
            var baselineLikes = ${baseLikes};
            
            // Safe Local Storage Helpers for Incognito / Strict Privacy Mode
            function safeGetLocal(key, defaultValue) {
                try {
                    var val = localStorage.getItem(key);
                    return val !== null ? val : defaultValue;
                } catch(e) {
                    return defaultValue;
                }
            }
            function safeSetLocal(key, value) {
                try {
                    localStorage.setItem(key, value);
                } catch(e) {}
            }
            
            function loadMetrics() {
                if (COMMENTS_API_URL) {
                    // Fetch and increment view count on load
                    $.getJSON(COMMENTS_API_URL + '?action=get_metrics&increment=true&pageId=' + viewsKey, function(data) {
                        var totalViews = (parseInt(data.views) || 0) + baselineViews;
                        var totalLikes = (parseInt(data.likes) || 0) + baselineLikes;
                        $('${viewsEl}').text(totalViews);
                        $('${likesEl}').text(totalLikes);
                    }).fail(loadLocalFallback);
                } else {
                    loadLocalFallback();
                }
            }
            
            function loadLocalFallback() {
                var views = parseInt(safeGetLocal(viewsKey, '0'));
                if (!sessionStorage.getItem(viewsKey + '_session')) {
                    views += 1;
                    safeSetLocal(viewsKey, views);
                    try {
                        sessionStorage.setItem(viewsKey + '_session', 'true');
                    } catch(e) {}
                }
                var likes = parseInt(safeGetLocal(likesKey, '0'));
                $('${viewsEl}').text(views + baselineViews);
                $('${likesEl}').text(likes + baselineLikes);
            }
            
            loadMetrics();
        
            // Like Interaction
            $('#like-btn').click(function() {
                if (safeGetLocal(likedKey, 'false') === 'true') {
                    alert('Você já curtiu este artigo!');
                    return;
                }
                
                if (COMMENTS_API_URL) {
                    $.ajax({
                        url: COMMENTS_API_URL,
                        method: 'POST',
                        data: {
                            action: 'like',
                            pageId: viewsKey
                        },
                        success: function(data) {
                            safeSetLocal(likedKey, 'true');
                            $('#like-btn').addClass('liked');
                            loadMetrics();
                        },
                        error: function() {
                            // Local fallback if tracking protection blocks Google request
                            var likes = parseInt(safeGetLocal(likesKey, '0')) + 1;
                            safeSetLocal(likesKey, likes);
                            safeSetLocal(likedKey, 'true');
                            $('#like-btn').addClass('liked');
                            loadLocalFallback();
                        }
                    });
                } else {
                    var likes = parseInt(safeGetLocal(likesKey, '0')) + 1;
                    safeSetLocal(likesKey, likes);
                    safeSetLocal(likedKey, 'true');
                    $('#like-btn').addClass('liked');
                    loadMetrics();
                }
            });
            
            if (safeGetLocal(likedKey, 'false') === 'true') {
                $('#like-btn').addClass('liked');
            }

            `;

            content = content.replace(textToReplace, newMetricsCode);

            // Also check for any direct calls to localStorage inside comment-form submit
            content = content.replace(/localStorage\.getItem\(commentsKey\)/g, "safeGetLocal(commentsKey, '[]')");
            content = content.replace(/localStorage\.setItem\(commentsKey,/g, "safeSetLocal(commentsKey,");

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully made metrics and likes crash-proof in: ${file}`);
        } else {
            console.log(`Could not find metrics code markers in: ${file}`);
        }
    }
});
