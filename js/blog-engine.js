// Motor compartilhado de comentarios/likes/views para as paginas do blog.
// Cada pagina de post define no <body>: data-post-id, data-views-seed, data-likes-seed
$(document).ready(function () {
    var $body = $('body');
    var postId = $body.data('post-id');
    if (!postId) return;

    var viewsKey = 'blog_views_' + postId;
    var commentsKey = 'blog_comments_' + postId;
    var likesKey = 'blog_likes_' + postId;
    var likedKey = 'blog_liked_' + postId;
    var viewsSeed = parseInt($body.data('views-seed'), 10) || 0;
    var likesSeed = parseInt($body.data('likes-seed'), 10) || 0;
    var COMMENTS_API_URL = 'https://script.google.com/macros/s/AKfycbxjIQEv4uWt8uEXWq3_9pR_-_bm4BIKzDChL8Vo1k9YTCY5r2DUVVOqkBl3zQpYnmfbhQ/exec';

    // Increment visualizador (Local Storage)
    var views = viewsSeed;
    try {
        views = parseInt(localStorage.getItem(viewsKey) || viewsSeed, 10);
        views += 1;
        localStorage.setItem(viewsKey, views);
    } catch (e) {
        views = viewsSeed + 1;
    }
    $('#article-views-detail').text(views);

    // Likes Engine (Local Storage)
    var likes = likesSeed;
    try {
        likes = parseInt(localStorage.getItem(likesKey) || likesSeed, 10);
        if (!localStorage.getItem(likesKey)) localStorage.setItem(likesKey, likesSeed);
    } catch (e) {}
    $('#article-likes-detail').text(likes);

    try {
        if (localStorage.getItem(likedKey) === 'true') {
            $('#like-btn').addClass('liked');
        }
    } catch (e) {}

    $('#like-btn').click(function () {
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
            $('#article-likes-detail').text(likes);
        } catch (e) {
            // Fallback visual in case storage is blocked
            $(this).toggleClass('liked');
        }
    });

    function loadComments() {
        ElyarApi.request({
            url: COMMENTS_API_URL + '?pageId=' + commentsKey,
            method: 'GET',
            dataType: 'json',
            retries: 1,
            onLoading: function () {
                $('#no-comments').show().text('Carregando comentários...');
            },
            onSuccess: function (comments) {
                renderComments(comments);
            },
            onError: function () {
                var comments = [];
                try {
                    comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                } catch (e) {}
                renderComments(comments);
            }
        });
    }

    function renderComments(comments) {
        var list = $('#comments-list');
        list.find('.comment-item-box').remove();
        var commentsArray = Array.isArray(comments) ? comments : [];
        if (commentsArray.length > 0) {
            $('#no-comments').hide();
            commentsArray.forEach(function (c) {
                var dateStr = c.date || 'Recente';
                var commentHtml = `
                    <div class="comment-item-box" style="border-left: 2px solid var(--color-accent-yellow); background: rgba(255,255,255,0.01); padding: 15px 20px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap;">
                            <strong style="color: white; font-family: 'Outfit', sans-serif; font-size: 0.95rem;">${c.author}</strong>
                            <span style="font-size: 0.75rem; color: var(--color-text-muted);">${dateStr}</span>
                        </div>
                        <p style="margin: 0; color: var(--color-text-body); font-size: 0.9rem; line-height: 1.5;">${c.text}</p>
                    </div>
                `;
                list.append(commentHtml);
            });
        } else {
            $('#no-comments').show().text('Nenhum comentário enviado ainda. Seja o primeiro a opinar!');
        }
    }

    loadComments();

    $('#comment-form').submit(function (e) {
        e.preventDefault();
        var author = $('#author-name').val().trim();
        var text = $('#comment-text').val().trim();

        if (!author || !text) return;

        var now = new Date();
        var dateFormatted = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        var commentData = {
            pageId: commentsKey,
            author: author,
            text: text,
            date: dateFormatted
        };

        function showSuccessAndReload(message, delay) {
            $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> ' + message + '</div>');
            $('#author-name').val('');
            $('#comment-text').val('');
            setTimeout(function () {
                window.location.reload();
            }, delay);
        }

        ElyarApi.request({
            url: COMMENTS_API_URL,
            method: 'POST',
            data: commentData,
            retries: 1,
            onLoading: function () {
                $('#comment-form button[type="submit"]').prop('disabled', true).text('Enviando...');
            },
            onSuccess: function () {
                $('#comment-form button[type="submit"]').prop('disabled', false).text('Enviar Comentário');
                showSuccessAndReload('Comentário enviado com sucesso! Atualizando...', 1600);
            },
            onError: function () {
                $('#comment-form button[type="submit"]').prop('disabled', false).text('Enviar Comentário');
                var comments = [];
                try {
                    comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                    comments.push(commentData);
                    localStorage.setItem(commentsKey, JSON.stringify(comments));
                } catch (err) {}
                showSuccessAndReload('Comentário enviado com sucesso! (Modo Local)', 1200);
            }
        });
    });
});
