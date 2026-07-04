const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar';
const blogDir = path.join(rootDir, 'blog');

// 1. Update blog.html loadPostMetrics to use POST
const blogHtmlPath = path.join(rootDir, 'blog.html');
if (fs.existsSync(blogHtmlPath)) {
    let content = fs.readFileSync(blogHtmlPath, 'utf8');

    const oldMetricsFunction = `            function loadPostMetrics(postKey, viewsEl, likesEl, baseViews, baseLikes) {
                if (COMMENTS_API_URL) {
                    $.getJSON(COMMENTS_API_URL + '?action=get_metrics&pageId=' + postKey + '&cb=' + new Date().getTime(), function(data) {
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
            }`;

    const newMetricsFunction = `            function loadPostMetrics(postKey, viewsEl, likesEl, baseViews, baseLikes) {
                if (COMMENTS_API_URL) {
                    $.ajax({
                        url: COMMENTS_API_URL,
                        method: 'POST',
                        data: {
                            action: 'get_metrics',
                            pageId: postKey
                        },
                        success: function(data) {
                            var views = (parseInt(data.views) || 0) + baseViews;
                            var likes = (parseInt(data.likes) || 0) + baseLikes;
                            $(viewsEl).text(views);
                            $(likesEl).text(likes);
                        },
                        error: function() {
                            try {
                                $(viewsEl).text(localStorage.getItem(postKey + '_views') || baseViews);
                                $(likesEl).text(localStorage.getItem(postKey + '_likes') || baseLikes);
                            } catch(e) {
                                $(viewsEl).text(baseViews);
                                $(likesEl).text(baseLikes);
                            }
                        }
                    });
                } else {
                    try {
                        $(viewsEl).text(localStorage.getItem(postKey + '_views') || baseViews);
                        $(likesEl).text(localStorage.getItem(postKey + '_likes') || baseLikes);
                    } catch(e) {
                        $(viewsEl).text(baseViews);
                        $(likesEl).text(baseLikes);
                    }
                }
            }`;

    if (content.includes(oldMetricsFunction)) {
        content = content.replace(oldMetricsFunction, newMetricsFunction);
        fs.writeFileSync(blogHtmlPath, content, 'utf8');
        console.log("Successfully updated blog.html metrics to POST");
    } else {
        console.log("Target block not found in blog.html");
    }
}

// 2. Update individual articles metrics and comments calls to POST
const articleFiles = [
    'ia-impacto.html',
    'monitoramento-ativo.html',
    'manutencao-computadores.html',
    'template.html'
];

articleFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Target span IDs
        let viewsEl = '#ia-views-detail';
        let likesEl = '#ia-likes-detail';
        if (file === 'monitoramento-ativo.html') {
            viewsEl = '#mon-views-detail';
            likesEl = '#mon-likes-detail';
        } else if (file === 'manutencao-computadores.html') {
            viewsEl = '#man-views-detail';
            likesEl = '#man-likes-detail';
        } else if (file === 'template.html') {
            viewsEl = '#article-views-detail';
            likesEl = '#article-likes-detail';
        }

        // 2a. Update metrics GET to POST
        const oldGetMetrics = `            function loadMetrics() {
                if (COMMENTS_API_URL) {
                    // Fetch and increment view count on load
                    $.getJSON(COMMENTS_API_URL + '?action=get_metrics&increment=true&pageId=' + viewsKey + '&cb=' + new Date().getTime(), function(data) {
                        var totalViews = (parseInt(data.views) || 0) + baselineViews;
                        var totalLikes = (parseInt(data.likes) || 0) + baselineLikes;
                        $('${viewsEl}').text(totalViews);
                        $('${likesEl}').text(totalLikes);
                    }).fail(loadLocalFallback);
                } else {
                    loadLocalFallback();
                }
            }`;

        const newGetMetrics = `            function loadMetrics() {
                if (COMMENTS_API_URL) {
                    // Fetch and increment view count on load via POST to avoid CORS GET redirect blocks
                    $.ajax({
                        url: COMMENTS_API_URL,
                        method: 'POST',
                        data: {
                            action: 'get_metrics',
                            increment: 'true',
                            pageId: viewsKey
                        },
                        success: function(data) {
                            var totalViews = (parseInt(data.views) || 0) + baselineViews;
                            var totalLikes = (parseInt(data.likes) || 0) + baselineLikes;
                            $('${viewsEl}').text(totalViews);
                            $('${likesEl}').text(totalLikes);
                        },
                        error: loadLocalFallback
                    });
                } else {
                    loadLocalFallback();
                }
            }`;

        // 2b. Update comments GET to POST
        const oldGetComments = `            function loadComments() {
                if (COMMENTS_API_URL) {
                    $.getJSON(COMMENTS_API_URL + '?pageId=' + commentsKey, function(comments) {
                        renderComments(comments);
                    }).fail(function() {
                        // Fallback to local storage on error
                        var comments = JSON.parse(safeGetLocal(commentsKey, '[]'));
                        renderComments(comments);
                    });
                } else {
                    var comments = JSON.parse(safeGetLocal(commentsKey, '[]'));
                    renderComments(comments);
                }
            }`;

        const newGetComments = `            function loadComments() {
                if (COMMENTS_API_URL) {
                    $.ajax({
                        url: COMMENTS_API_URL,
                        method: 'POST',
                        data: {
                            action: 'get_comments',
                            pageId: commentsKey
                        },
                        success: function(comments) {
                            var parsedComments = typeof comments === 'string' ? JSON.parse(comments) : comments;
                            renderComments(parsedComments);
                        },
                        error: function() {
                            try {
                                var comments = JSON.parse(safeGetLocal(commentsKey, '[]'));
                                renderComments(comments);
                            } catch(e) {
                                renderComments([]);
                            }
                        }
                    });
                } else {
                    try {
                        var comments = JSON.parse(safeGetLocal(commentsKey, '[]'));
                        renderComments(comments);
                    } catch(e) {
                        renderComments([]);
                    }
                }
            }`;

        if (content.includes(oldGetMetrics)) {
            content = content.replace(oldGetMetrics, newGetMetrics);
        }
        if (content.includes(oldGetComments)) {
            content = content.replace(oldGetComments, newGetComments);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully migrated metrics/comments load to POST in: ${file}`);
    }
});

// 3. Update depoimentos.html to use POST
const depHtmlPath = path.join(rootDir, 'depoimentos.html');
if (fs.existsSync(depHtmlPath)) {
    let content = fs.readFileSync(depHtmlPath, 'utf8');

    const oldDepGet = `            function loadTestimonials() {
                if (DEPOIMENTOS_API_URL) {
                    $.getJSON(DEPOIMENTOS_API_URL, function(cloudData) {
                        // Merge cloud testimonials with local static data (cloud first)
                        currentTestimonials = cloudData.concat(window.testimonialsData);
                        processAndRender();
                    }).fail(function() {
                        currentTestimonials = window.testimonialsData;
                        processAndRender();
                    });
                } else {`;

    const newDepGet = `            function loadTestimonials() {
                if (DEPOIMENTOS_API_URL) {
                    $.ajax({
                        url: DEPOIMENTOS_API_URL,
                        method: 'POST',
                        data: {
                            action: 'get_testimonials'
                        },
                        success: function(cloudData) {
                            var parsedData = typeof cloudData === 'string' ? JSON.parse(cloudData) : cloudData;
                            currentTestimonials = parsedData.concat(window.testimonialsData);
                            processAndRender();
                        },
                        error: function() {
                            currentTestimonials = window.testimonialsData;
                            processAndRender();
                        }
                    });
                } else {`;

    if (content.includes(oldDepGet)) {
        content = content.replace(oldDepGet, newDepGet);
        fs.writeFileSync(depHtmlPath, content, 'utf8');
        console.log("Successfully updated depoimentos.html testimonials retrieval to POST");
    } else {
        console.log("Target block not found in depoimentos.html");
    }
}
