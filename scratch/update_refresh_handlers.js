const fs = require('fs');
const path = require('path');

const blogDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar\\blog';
const blogFiles = [
    'ia-impacto.html',
    'monitoramento-ativo.html',
    'manutencao-computadores.html',
    'template.html'
];

const depoimentosFile = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar\\depoimentos.html';

// 1. Update Blog files comment submission handler
blogFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Target the done and always callbacks for comment submission
        const oldDoneSection = `.done(function() {
                            $('#author-name').val('');
                            $('#comment-text').val('');
                            loadComments();
                        }).always(function() {`;

        const newDoneSection = `.done(function() {
                            // Show beautiful success feedback
                            $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> Comentário enviado com sucesso! Atualizando comentários...</div>');
                            $('#author-name').val('');
                            $('#comment-text').val('');
                            setTimeout(function() {
                                window.location.reload();
                            }, 1600);
                        }).always(function() {`;

        // Check for local storage save done section as well
        const oldLocalSaveSection = `// Save in LocalStorage
                        var comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                        comments.push(commentData);
                        localStorage.setItem(commentsKey, JSON.stringify(comments));
                        
                        $('#author-name').val('');
                        $('#comment-text').val('');
                        loadComments();`;

        const newLocalSaveSection = `// Save in LocalStorage
                        var comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                        comments.push(commentData);
                        localStorage.setItem(commentsKey, JSON.stringify(comments));
                        
                        $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> Comentário enviado com sucesso! Atualizando comentários...</div>');
                        $('#author-name').val('');
                        $('#comment-text').val('');
                        setTimeout(function() {
                            window.location.reload();
                        }, 1000);`;

        let updated = false;

        if (content.includes(oldDoneSection)) {
            content = content.replace(oldDoneSection, newDoneSection);
            updated = true;
        }

        if (content.includes(oldLocalSaveSection)) {
            content = content.replace(oldLocalSaveSection, newLocalSaveSection);
            updated = true;
        }

        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated comments feedback and refresh in: ${file}`);
        } else {
            console.log(`Could not find comments code targets in: ${file}`);
        }
    }
});

// 2. Update depoimentos.html testimonial submission handler
if (fs.existsSync(depoimentosFile)) {
    let content = fs.readFileSync(depoimentosFile, 'utf8');

    // Locate the submit handler and replace it with the clean, modal-transforming success alert
    const targetSubmitStart = `            // 7. Form Submission`;
    const targetSaveLocal = `            function saveLocal(data) {`;

    // Let's locate the full block of code starting from '// 7. Form Submission' to the end of saveLocal function
    const startIndex = content.indexOf(targetSubmitStart);
    const saveLocalIndex = content.indexOf(targetSaveLocal, startIndex);
    
    if (startIndex !== -1 && saveLocalIndex !== -1) {
        // Find the end of saveLocal function. It ends at the closing brace of function saveLocal
        const functionEndMarker = 'loadTestimonials();\n            }';
        const functionEndMarkerAlternative = 'loadTestimonials();\r\n            }';
        
        let endIndex = content.indexOf(functionEndMarker, saveLocalIndex);
        let lenToCut = functionEndMarker.length;
        
        if (endIndex === -1) {
            endIndex = content.indexOf(functionEndMarkerAlternative, saveLocalIndex);
            lenToCut = functionEndMarkerAlternative.length;
        }

        if (endIndex !== -1) {
            const cutEnd = endIndex + lenToCut;
            const blockToReplace = content.substring(startIndex, cutEnd);
            
            const newBlock = `            // 7. Form Submission
            $('#new-testimonial-form').submit(function(e) {
                e.preventDefault();
                
                var name = $('#test-author-name').val().trim();
                var service = $('#test-service-select').val();
                var rating = parseInt($('#test-rating-value').val());
                var text = $('#test-comment-text').val().trim();
                
                if (name && text) {
                    var now = new Date();
                    var dateFormatted = now.toLocaleDateString('pt-BR');
                    
                    var testimonialData = {
                        name: name,
                        service: service,
                        rating: rating,
                        text: text,
                        date: dateFormatted
                    };

                    if (DEPOIMENTOS_API_URL) {
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
                        }).always(function() {
                            $('#new-testimonial-form button[type="submit"]').prop('disabled', false).text('Publicar Avaliação');
                        });
                    } else {
                        saveLocal(testimonialData);
                    }
                }
            });

            function showSuccessFeedback() {
                var modalBody = $('#deixar-depoimento-modal .modal-body');
                var modalFooter = $('#deixar-depoimento-modal').find('div[style*="justify-content: flex-end"]');
                
                // Hide input fields and footer buttons
                $('#new-testimonial-form').find('.modal-body > div').hide();
                modalFooter.hide();
                
                // Prepend success alert
                modalBody.prepend('<div class="alert alert-success text-center" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; padding: 20px; font-size: 1.1rem; margin: 0; border-radius: 6px;"><i class="fa fa-check-circle fa-2x" style="display: block; margin-bottom: 10px;"></i> Depoimento enviado com sucesso!<br><span style="font-size: 0.85rem; color: var(--color-text-muted);">Atualizando a página para carregar as novas avaliações...</span></div>');
                
                setTimeout(function() {
                    $('#deixar-depoimento-modal').modal('hide');
                    window.location.reload();
                }, 1800);
            }

            function saveLocal(data) {
                var localSaved = JSON.parse(localStorage.getItem('saved_testimonials') || '[]');
                localSaved.unshift(data); // Add to beginning
                localStorage.setItem('saved_testimonials', JSON.stringify(localSaved));
                
                showSuccessFeedback();
            }`;

            content = content.replace(blockToReplace, newBlock);
            fs.writeFileSync(depoimentosFile, content, 'utf8');
            console.log("Successfully updated testimonials submission feedback and refresh in: depoimentos.html");
        } else {
            console.log("Could not find the end of saveLocal function in depoimentos.html");
        }
    } else {
        console.log("Could not locate targets in depoimentos.html");
    }
}
