const fs = require('fs');
const path = require('path');

const blogDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar\\blog';
const filesToUpdate = [
    'ia-impacto.html',
    'monitoramento-ativo.html',
    'manutencao-computadores.html',
    'template.html'
];

const newCommentsEngine = `
            var COMMENTS_API_URL = ''; // Cole o link do seu Web App do Google Apps Script aqui para comentários persistentes globais!

            // Comments Engine
            function loadComments() {
                if (COMMENTS_API_URL) {
                    $.getJSON(COMMENTS_API_URL + '?pageId=' + commentsKey, function(comments) {
                        renderComments(comments);
                    }).fail(function() {
                        // Fallback to local storage on error
                        var comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                        renderComments(comments);
                    });
                } else {
                    var comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                    renderComments(comments);
                }
            }

            function renderComments(comments) {
                var list = $('#comments-list');
                list.find('.comment-item-box').remove(); // clear listing
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
                        // Send to Google Sheets
                        $.ajax({
                            url: COMMENTS_API_URL,
                            method: 'POST',
                            data: commentData,
                            beforeSend: function() {
                                $('#comment-form button[type="submit"]').prop('disabled', true).text('Enviando...');
                            }
                        }).done(function() {
                            $('#author-name').val('');
                            $('#comment-text').val('');
                            loadComments();
                        }).always(function() {
                            $('#comment-form button[type="submit"]').prop('disabled', false).text('Enviar Comentário');
                        });
                    } else {
                        // Save in LocalStorage
                        var comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                        comments.push(commentData);
                        localStorage.setItem(commentsKey, JSON.stringify(comments));
                        
                        $('#author-name').val('');
                        $('#comment-text').val('');
                        loadComments();
                    }
                }
            });
`;

filesToUpdate.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Locate the segment between "// Comments Engine" and the submit handler close (the end of script)
        // Let's replace the segment starting from "// Comments Engine" to page bottom script closing
        const startMarker = '// Comments Engine';
        const startIndex = content.indexOf(startMarker);
        
        if (startIndex !== -1) {
            // Find where to end the replacement. It should end right before the script tag closing "</script>"
            const endMarker = '});\n    </script>';
            const endMarkerAlternative = '});\r\n    </script>';
            let endIndex = content.indexOf(endMarker, startIndex);
            let markerUsed = endMarker;

            if (endIndex === -1) {
                endIndex = content.indexOf(endMarkerAlternative, startIndex);
                markerUsed = endMarkerAlternative;
            }

            if (endIndex !== -1) {
                const targetToReplace = content.substring(startIndex, endIndex);
                content = content.replace(targetToReplace, startMarker + '\n' + newCommentsEngine + '\n            ');
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Successfully injected persistent comments engine in: ${file}`);
            } else {
                console.log(`Could not find end marker in: ${file}`);
            }
        } else {
            console.log(`Could not find start marker in: ${file}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
