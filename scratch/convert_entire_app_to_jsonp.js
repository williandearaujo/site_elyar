const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar';
const blogDir = path.join(rootDir, 'blog');

// 1. Convert blog.html loadPostMetrics to JSONP
const blogHtmlPath = path.join(rootDir, 'blog.html');
if (fs.existsSync(blogHtmlPath)) {
    let content = fs.readFileSync(blogHtmlPath, 'utf8');

    const oldFunc = `            function loadPostMetrics(postKey, viewsEl, likesEl, baseViews, baseLikes) {
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

    const newFunc = `            function loadPostMetrics(postKey, viewsEl, likesEl, baseViews, baseLikes) {
                if (COMMENTS_API_URL) {
                    $.ajax({
                        url: COMMENTS_API_URL,
                        dataType: 'jsonp',
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

    if (content.includes(oldFunc)) {
        content = content.replace(oldFunc, newFunc);
        fs.writeFileSync(blogHtmlPath, content, 'utf8');
        console.log("Successfully updated blog.html to JSONP");
    } else {
        console.log("Target block not found in blog.html");
    }
}

// 2. Convert individual articles to JSONP
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

        // Locate view/like details tags
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

        // Replace loadMetrics, loadComments, like click and comment form submit
        const oldLoadMetrics = `            function loadMetrics() {
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

        const newLoadMetrics = `            function loadMetrics() {
                if (COMMENTS_API_URL) {
                    // Fetch and increment view count on load via JSONP (CORS-proof)
                    $.ajax({
                        url: COMMENTS_API_URL,
                        dataType: 'jsonp',
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

        const oldLoadComments = `            function loadComments() {
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

        const newLoadComments = `            function loadComments() {
                if (COMMENTS_API_URL) {
                    $.ajax({
                        url: COMMENTS_API_URL,
                        dataType: 'jsonp',
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

        const oldLikeClick = `            // Like Interaction
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
                } else {`;

        const newLikeClick = `            // Like Interaction
            $('#like-btn').click(function() {
                if (safeGetLocal(likedKey, 'false') === 'true') {
                    alert('Você já curtiu este artigo!');
                    return;
                }
                
                if (COMMENTS_API_URL) {
                    $.ajax({
                        url: COMMENTS_API_URL,
                        dataType: 'jsonp',
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
                } else {`;

        const oldFormSubmit = `            $('#comment-form').submit(function(e) {
                e.preventDefault();
                var author = $('#author-name').val().trim();
                var text = $('#comment-text').val().trim();
                
                if (author && text) {
                    var now = new Date();
                    var dateFormatted = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    
                    var commentData = {
                        pageId: commentsKey,
                        author: author,
                        text: text,
                        date: dateFormatted
                    };
 
                    if (COMMENTS_API_URL) {
                        // Send to Google Sheets
                        $.ajax({
                            url: COMMENTS_API_URL,
                            method: 'POST',
                            data: commentData,
                            beforeSend: function() {
                                $('#comment-form button[type="submit"]').prop('disabled', true).text('Enviando...');
                            }
                        }).done(function() {
                            // Show beautiful success feedback
                            $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> Comentário enviado com sucesso! Atualizando comentários...</div>');
                            $('#author-name').val('');
                            $('#comment-text').val('');
                            setTimeout(function() {
                                window.location.reload();
                            }, 1600);
                        }).always(function() {
                            $('#comment-form button[type="submit"]').prop('disabled', false).text('Enviar Comentário');
                        });`;

        const newFormSubmit = `            $('#comment-form').submit(function(e) {
                e.preventDefault();
                var author = $('#author-name').val().trim();
                var text = $('#comment-text').val().trim();
                
                if (author && text) {
                    var now = new Date();
                    var dateFormatted = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    
                    var commentData = {
                        action: 'add_comment',
                        pageId: commentsKey,
                        author: author,
                        text: text,
                        date: dateFormatted
                    };
 
                    if (COMMENTS_API_URL) {
                        // Send to Google Sheets
                        $.ajax({
                            url: COMMENTS_API_URL,
                            dataType: 'jsonp',
                            data: commentData,
                            beforeSend: function() {
                                $('#comment-form button[type="submit"]').prop('disabled', true).text('Enviando...');
                            },
                            success: function(data) {
                                // Show beautiful success feedback
                                $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> Comentário enviado com sucesso! Atualizando comentários...</div>');
                                $('#author-name').val('');
                                $('#comment-text').val('');
                                setTimeout(function() {
                                    window.location.reload();
                                }, 1600);
                            },
                            error: function() {
                                var comments = JSON.parse(safeGetLocal(commentsKey, '[]'));
                                comments.push({
                                    pageId: commentsKey,
                                    author: author,
                                    text: text,
                                    date: dateFormatted
                                });
                                safeSetLocal(commentsKey, JSON.stringify(comments));
                                $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> Comentário enviado com sucesso! (Modo Local)</div>');
                                $('#author-name').val('');
                                $('#comment-text').val('');
                                setTimeout(function() {
                                    window.location.reload();
                                }, 1000);
                            }
                        }).always(function() {
                            $('#comment-form button[type="submit"]').prop('disabled', false).text('Enviar Comentário');
                        });`;

        if (content.includes(oldLoadMetrics)) {
            content = content.replace(oldLoadMetrics, newLoadMetrics);
        }
        if (content.includes(oldLoadComments)) {
            content = content.replace(oldLoadComments, newLoadComments);
        }
        if (content.includes(oldLikeClick)) {
            content = content.replace(oldLikeClick, newLikeClick);
        }
        if (content.includes(oldFormSubmit)) {
            content = content.replace(oldFormSubmit, newFormSubmit);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully migrated individual page to JSONP: ${file}`);
    }
});

// 3. Convert depoimentos.html to JSONP
const depHtmlPath = path.join(rootDir, 'depoimentos.html');
if (fs.existsSync(depHtmlPath)) {
    let content = fs.readFileSync(depHtmlPath, 'utf8');

    // 3a. Testimonials load method
    const oldDepLoad = `            function loadTestimonials() {
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

    const newDepLoad = `            function loadTestimonials() {
                if (DEPOIMENTOS_API_URL) {
                    $.ajax({
                        url: DEPOIMENTOS_API_URL,
                        dataType: 'jsonp',
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

    // 3b. Testimonials submit method
    const oldDepSubmit = `                    if (DEPOIMENTOS_API_URL) {
                        $.ajax({
                            url: DEPOIMENTOS_API_URL,
                            method: 'POST',
                            data: testimonialData,
                            beforeSend: function() {
                                $('#new-testimonial-form button[type="submit"]').prop('disabled', true).text('Enviando...');
                            }
                        }).done(function() {
                            showSuccessFeedback();
                        }).fail(function() {
                            alert('Erro de conexão com o banco de dados. Tentando salvar localmente...');
                            saveLocal(testimonialData);
                        }).always(function() {`;

    const newDepSubmit = `                    if (DEPOIMENTOS_API_URL) {
                        $.ajax({
                            url: DEPOIMENTOS_API_URL,
                            dataType: 'jsonp',
                            data: {
                                action: 'add_testimonial',
                                name: name,
                                service: service,
                                rating: rating,
                                text: text,
                                date: dateFormatted
                            },
                            beforeSend: function() {
                                $('#new-testimonial-form button[type="submit"]').prop('disabled', true).text('Enviando...');
                            },
                            success: function(data) {
                                showSuccessFeedback();
                            },
                            error: function() {
                                alert('Erro de conexão com o banco de dados. Tentando salvar localmente...');
                                saveLocal(testimonialData);
                            }
                        }).always(function() {`;

    if (content.includes(oldDepLoad)) {
        content = content.replace(oldDepLoad, newDepLoad);
    }
    if (content.includes(oldDepSubmit)) {
        content = content.replace(oldDepSubmit, newDepSubmit);
    }

    fs.writeFileSync(depHtmlPath, content, 'utf8');
    console.log("Successfully updated depoimentos.html to JSONP");
}
