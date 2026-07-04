const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar';
const blogDir = path.join(rootDir, 'blog');

// 1. Revert blog.html to local metrics loader
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
                try {
                    var views = parseInt(localStorage.getItem(postKey) || baseViews);
                    var likes = parseInt(localStorage.getItem(postKey.replace('_views', '_likes')) || baseLikes);
                    $(viewsEl).text(views);
                    $(likesEl).text(likes);
                } catch(e) {
                    $(viewsEl).text(baseViews);
                    $(likesEl).text(baseLikes);
                }
            }`;

    if (content.includes(oldFunc)) {
        content = content.replace(oldFunc, newFunc);
        fs.writeFileSync(blogHtmlPath, content, 'utf8');
        console.log("Successfully reverted blog.html metrics to local storage");
    } else {
        console.log("Could not find POST metrics block in blog.html");
    }
}

// 2. Revert individual articles to local metrics & original GET/POST comments
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

        // Extract viewsKey, commentsKey, likesKey, likedKey block
        const marker = "            var viewsKey = ";
        const markerIndex = content.indexOf(marker);
        const scriptCloseIndex = content.indexOf("</script>", markerIndex);

        if (markerIndex !== -1 && scriptCloseIndex !== -1) {
            let keyText = content.substring(markerIndex, scriptCloseIndex);

            // Recreate original working block for metrics & comments
            let viewsEl = 'ia-views-detail';
            let likesEl = 'ia-likes-detail';
            let baseViews = 100;
            let baseLikes = 52;
            let prefix = 'ia';

            if (file === 'monitoramento-ativo.html') {
                viewsEl = 'mon-views-detail';
                likesEl = 'mon-likes-detail';
                baseViews = 100;
                baseLikes = 30;
                prefix = 'mon';
            } else if (file === 'manutencao-computadores.html') {
                viewsEl = 'man-views-detail';
                likesEl = 'man-likes-detail';
                baseViews = 0;
                baseLikes = 0;
                prefix = 'man';
            } else if (file === 'template.html') {
                viewsEl = 'article-views-detail';
                likesEl = 'article-likes-detail';
                baseViews = 100;
                baseLikes = 30;
                prefix = 'article';
            }

            const replacementScriptBlock = `var viewsKey = 'blog_views_${file.replace('.html', '').replace('-', '_')}';
            var commentsKey = 'blog_comments_${file.replace('.html', '').replace('-', '_')}';
            var likesKey = 'blog_likes_${file.replace('.html', '').replace('-', '_')}';
            var likedKey = 'blog_liked_${file.replace('.html', '').replace('-', '_')}';

            // Increment visualizador (Local Storage)
            var views = 100;
            try {
                views = parseInt(localStorage.getItem(viewsKey) || ${baseViews});
                views += 1;
                localStorage.setItem(viewsKey, views);
            } catch(e) {
                views = ${baseViews} + 1;
            }
            $('#${viewsEl}').text(views);

            // Likes Engine (Local Storage)
            var likes = ${baseLikes};
            try {
                likes = parseInt(localStorage.getItem(likesKey) || ${baseLikes});
                if (!localStorage.getItem(likesKey)) localStorage.setItem(likesKey, ${baseLikes});
            } catch(e) {}
            $('#${likesEl}').text(likes);

            try {
                if (localStorage.getItem(likedKey) === 'true') {
                    $('#like-btn').addClass('liked');
                }
            } catch(e) {}

            $('#like-btn').click(function() {
                try {
                    if (localStorage.getItem(likedKey) === 'true') {
                        likes -= 1;
                        localStorage.setItem(likesKey, likes);
                        localStorage.setItem(likedKey, 'false');
                        $(this).removeClass('liked');
                    } else {
                        likes += 1;
                        localStorage.setItem(likesKey, likes);
                        localStorage.setItem(likedKey, 'true');
                        $(this).addClass('liked');
                    }
                    $('#${likesEl}').text(likes);
                } catch(e) {
                    // Fallback visual in case storage is blocked
                    $(this).toggleClass('liked');
                }
            });

            // Comments Engine
            var COMMENTS_API_URL = 'https://script.google.com/macros/s/AKfycbxjIQEv4uWt8uEXWq3_9pR_-_bm4BIKzDChL8Vo1k9YTCY5r2DUVVOqkBl3zQpYnmfbhQ/exec';

            function loadComments() {
                if (COMMENTS_API_URL) {
                    $.getJSON(COMMENTS_API_URL + '?pageId=' + commentsKey, function(comments) {
                        renderComments(comments);
                    }).fail(function() {
                        var comments = [];
                        try {
                            comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                        } catch(e) {}
                        renderComments(comments);
                    });
                } else {
                    var comments = [];
                    try {
                        comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                    } catch(e) {}
                    renderComments(comments);
                }
            }

            function renderComments(comments) {
                var list = $('#comments-list');
                list.find('.comment-item-box').remove();
                if (comments.length > 0) {
                    $('#no-comments').hide();
                    comments.forEach(function(c) {
                        var dateStr = c.date || 'Recente';
                        var commentHtml = \`
                            <div class="comment-item-box" style="border-left: 2px solid var(--color-accent-yellow); background: rgba(255,255,255,0.01); padding: 15px 20px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap;">
                                    <strong style="color: white; font-family: 'Outfit', sans-serif; font-size: 0.95rem;">\${c.author}</strong>
                                    <span style="font-size: 0.75rem; color: var(--color-text-muted);">\${dateStr}</span>
                                </div>
                                <p style="margin: 0; color: var(--color-text-body); font-size: 0.9rem; line-height: 1.5;">\${c.text}</p>
                            </div>
                        \`;
                        list.append(commentHtml);
                    });
                } else {
                    $('#no-comments').show();
                }
            }

            loadComments();

            $('#comment-form').submit(function(e) {
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
                        $.ajax({
                            url: COMMENTS_API_URL,
                            method: 'POST',
                            data: commentData,
                            beforeSend: function() {
                                $('#comment-form button[type="submit"]').prop('disabled', true).text('Enviando...');
                            }
                        }).done(function() {
                            $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> Comentário enviado com sucesso! Atualizando...</div>');
                            $('#author-name').val('');
                            $('#comment-text').val('');
                            setTimeout(function() {
                                window.location.reload();
                            }, 1600);
                        }).fail(function() {
                            // Local fallback
                            var comments = [];
                            try {
                                comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                                comments.push(commentData);
                                localStorage.setItem(commentsKey, JSON.stringify(comments));
                            } catch(err) {}
                            $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> Comentário enviado com sucesso! (Modo Local)</div>');
                            $('#author-name').val('');
                            $('#comment-text').val('');
                            setTimeout(function() {
                                window.location.reload();
                            }, 1200);
                        }).always(function() {
                            $('#comment-form button[type="submit"]').prop('disabled', false).text('Enviar Comentário');
                        });
                    } else {
                        var comments = [];
                        try {
                            comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                            comments.push(commentData);
                            localStorage.setItem(commentsKey, JSON.stringify(comments));
                        } catch(err) {}
                        
                        $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> Comentário enviado com sucesso!</div>');
                        $('#author-name').val('');
                        $('#comment-text').val('');
                        setTimeout(function() {
                            window.location.reload();
                        }, 1000);
                    }
                }
            });
            `;

            content = content.replace(keyText, replacementScriptBlock);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully reverted individual page: ${file}`);
        }
    }
});

// 3. Revert depoimentos.html
const depHtmlPath = path.join(rootDir, 'depoimentos.html');
if (fs.existsSync(depHtmlPath)) {
    let content = fs.readFileSync(depHtmlPath, 'utf8');

    // Revert loadTestimonials
    const oldDepLoad = `            function loadTestimonials() {
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

    const newDepLoad = `            function loadTestimonials() {
                if (DEPOIMENTOS_API_URL) {
                    $.getJSON(DEPOIMENTOS_API_URL, function(cloudData) {
                        currentTestimonials = cloudData.concat(window.testimonialsData);
                        processAndRender();
                    }).fail(function() {
                        currentTestimonials = window.testimonialsData;
                        processAndRender();
                    });
                } else {`;

    // Revert submit
    const oldDepSubmit = `                    if (DEPOIMENTOS_API_URL) {
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

    const newDepSubmit = `                    if (DEPOIMENTOS_API_URL) {
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

    if (content.includes(oldDepLoad)) {
        content = content.replace(oldDepLoad, newDepLoad);
    }
    if (content.includes(oldDepSubmit)) {
        content = content.replace(oldDepSubmit, newDepSubmit);
    }

    fs.writeFileSync(depHtmlPath, content, 'utf8');
    console.log("Successfully reverted depoimentos.html to original GET/POST");
}
