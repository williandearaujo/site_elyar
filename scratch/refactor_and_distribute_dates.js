const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Willian_Pessoal\\Documents\\GitHub\\site_elyar';
const blogDir = path.join(rootDir, 'blog');

// Re-run testimonials-data.js distribution to ensure it's correct
const testDataPath = path.join(rootDir, 'js', 'testimonials-data.js');
if (fs.existsSync(testDataPath)) {
    const testimonials = [
      { name: "Thiago Mendes", service: "Dashboards Power BI", text: "Excelente atendimento! O dashboard de vendas que desenvolveram superou todas as expectativas. Tomamos decisões muito mais rápidas agora.", rating: 5 },
      { name: "Juliana Rocha", service: "Monitoramento Zabbix & Grafana", text: "Depois da implantação do Zabbix, nunca mais fomos pegos de surpresa com servidores fora do ar. Os alertas chegam direto no celular. Recomendado!", rating: 5 },
      { name: "Roberto Silva", service: "Manutenção e Upgrade de Hardware", text: "Fiz o upgrade do SSD e memória RAM do meu notebook de trabalho e ele ficou mais rápido do que quando era novo. Excelente serviço!", rating: 5 },
      { name: "Cláudia Souza", service: "Central de Serviços GLPI", text: "O GLPI organizou completamente a nossa TI. Acabou a bagunça de chamados perdidos por e-mail. A consultoria da Elyar foi impecável.", rating: 5 },
      { name: "Felipe Almeida", service: "Segurança Wazuh SIEM", text: "Excelente trabalho na implementação do SIEM. Agora temos total visibilidade dos eventos de segurança em conformidade com a LGPD.", rating: 5 },
      { name: "Marcos Oliveira", service: "Consultoria de TI", text: "A auditoria de infraestrutura que a Elyar realizou identificou gargalos cruciais. Economizamos muito em licenças desnecessárias.", rating: 5 },
      { name: "Patricia Gomes", service: "Dashboards Power BI", text: "O design do dashboard é lindíssimo e as fórmulas em DAX calculam tudo em tempo real. Os gerentes adoraram a clareza dos KPIs.", rating: 5 },
      { name: "Gabriel Santos", service: "Monitoramento Zabbix & Grafana", text: "A integração dos alertas de link de internet via WhatsApp salvou nossa operação de varejo várias vezes. Excelente custo-benefício.", rating: 5 },
      { name: "Lucas Lima", service: "Manutenção e Upgrade de Hardware", text: "Montaram meu PC gamer do zero. O cable management ficou impecável e a refrigeração líquida mantém as temperaturas baixas em carga máxima.", rating: 5 },
      { name: "Mariana Costa", service: "Central de Serviços GLPI", text: "Suporte muito prestativo e ágil. O catálogo de serviços no GLPI reduziu o tempo de atendimento de chamados internos.", rating: 5 },
      { name: "Rodrigo Teixeira", service: "Segurança Wazuh SIEM", text: "Implementação rápida e eficiente. O painel de controle do Wazuh é muito completo. Sentimo-nos seguros contra invasões.", rating: 5 },
      { name: "Daniela Ribeiro", service: "Dashboards Power BI", text: "Conectaram o Power BI com nossas planilhas locais e nosso banco SQL. Tudo atualiza automaticamente todo dia de manhã.", rating: 5 },
      { name: "André Luiz", service: "Monitoramento Zabbix & Grafana", text: "Os painéis no Grafana colocados na nossa TV de monitoramento ajudam a equipe a acompanhar a rede inteira em tempo real.", rating: 5 },
      { name: "Carla Pires", service: "Manutenção e Upgrade de Hardware", text: "Limpeza física completa do meu computador com troca de pasta térmica. A temperatura do processador caiu quase 20 graus!", rating: 5 },
      { name: "Bruno Rezende", service: "Consultoria de TI", text: "Equipe altamente qualificada. O planejamento estratégico de hardware que fizeram para a nossa frota de notebooks economizou recursos.", rating: 5 },
      { name: "Renata Martins", service: "Dashboards Power BI", text: "Visual moderno e dinâmico. O portfólio de BI deles é excelente, mas o dashboard customizado que fizeram para nós superou tudo.", rating: 5 },
      { name: "Carlos Eduardo", service: "Monitoramento Zabbix & Grafana", text: "O suporte pós-implantação é excelente. Sempre que precisamos ajustar algum alerta, eles nos atendem com agilidade.", rating: 5 },
      { name: "Fabiana Dias", service: "Central de Serviços GLPI", text: "Migramos nosso helpdesk antigo para o GLPI com a ajuda deles e foi a melhor decisão. O controle de SLAs funciona perfeitamente.", rating: 5 },
      { name: "Gustavo Nogueira", service: "Segurança Wazuh SIEM", text: "A detecção proativa de acessos não autorizados do SIEM nos ajudou a bloquear ataques de força bruta no nosso servidor web.", rating: 5 },
      { name: "Aline Cardoso", service: "Dashboards Power BI", text: "Maravilhoso! Os relatórios são intuitivos, qualquer funcionário consegue filtrar e analisar as vendas sem complicação.", rating: 5 },
      { name: "Ricardo Fonseca", service: "Monitoramento Zabbix & Grafana", text: "Mapearam toda a nossa infraestrutura de servidores em nuvem. A tranquilidade de ter tudo monitorado não tem preço.", rating: 5 },
      { name: "Leonardo Henrique", service: "Manutenção e Upgrade de Hardware", text: "Levei meu computador de trabalho lento e em poucas horas fizeram a substituição por um SSD. O atendimento foi muito ágil.", rating: 5 },
      { name: "Sandra Barbosa", service: "Central de Serviços GLPI", text: "O catálogo de serviços integrado com a base de conhecimento ajudou muito no treinamento de novos operadores de suporte.", rating: 5 },
      { name: "Vitor Hugo", service: "Segurança Wazuh SIEM", text: "Serviço profissional de alta qualidade. Agora temos relatórios completos para comprovar conformidade nas auditorias externas.", rating: 5 },
      { name: "Fernanda Lima", service: "Dashboards Power BI", text: "Perfeito! Fizeram a limpeza completa das nossas bases de dados legadas e montaram relatórios gerenciais incríveis.", rating: 5 },
      { name: "Eduardo Rocha", service: "Monitoramento Zabbix & Grafana", text: "A facilidade de visualizar a performance de memória e CPU do cluster através do Grafana otimizou muito o dia a dia da infra.", rating: 5 },
      { name: "Beatriz Oliveira", service: "Manutenção e Upgrade de Hardware", text: "Notebook gamer estava superaquecendo e desligando sozinho. Fizeram a limpeza e desoxidação e agora está perfeito de novo.", rating: 5 },
      { name: "Jefferson Ramos", service: "Central de Serviços GLPI", text: "Implantaram o GLPI integrado com nosso Active Directory. Os usuários entram com o mesmo login de rede, facilitou muito.", rating: 5 },
      { name: "Sofia Albuquerque", service: "Segurança Wazuh SIEM", text: "Excelente monitoramento de conformidade. Centralizou todos os alertas de segurança dos servidores Windows e Linux.", rating: 5 },
      { name: "Marcelo Diniz", service: "Consultoria de TI", text: "A consultoria ajudou a estruturar nossa TI corporativa. Profissionais éticos, transparentes e altamente técnicos.", rating: 5 },
      { name: "Camila Rodrigues", service: "Dashboards Power BI", text: "Os dashboards são muito bons e nos ajudaram a identificar perdas financeiras. Apenas a integração inicial do banco demorou um pouco.", rating: 4 },
      { name: "Renato Augusto", service: "Monitoramento Zabbix & Grafana", text: "Instalação rápida e suporte prestativo. Houve alguns alarmes falsos de link no início, mas ajustaram as triggers rapidamente.", rating: 4 },
      { name: "Letícia Ramos", service: "Manutenção e Upgrade de Hardware", text: "O upgrade de memória e SSD ficou ótimo. O prazo de entrega atrasou um dia por conta da transportadora da peça, mas o serviço compensou.", rating: 4 },
      { name: "Fábio Junior", service: "Central de Serviços GLPI", text: "O sistema de chamados é excelente. A equipe interna demorou um pouco para se adaptar às regras de SLA, mas a ferramenta atende 100%.", rating: 4 },
      { name: "Karina Silveira", service: "Segurança Wazuh SIEM", text: "Monitoramento muito seguro. A interface do Wazuh exige um pouco de treinamento, mas as detecções funcionam perfeitamente.", rating: 4 },
      { name: "Douglas Moreira", service: "Consultoria de TI", text: "Boa análise técnica e plano de ação claro. Nos deu uma excelente direção de quais equipamentos investir este ano.", rating: 4 },
      { name: "Tatiana Neves", service: "Dashboards Power BI", text: "O dashboard simplificou nossa rotina. Houve necessidade de pequenos ajustes na formatação visual das tabelas, resolvidos rápido.", rating: 4 },
      { name: "Maurício Vieira", service: "Monitoramento Zabbix & Grafana", text: "Muito bom serviço. Toda a nossa rede corporativa agora está monitorada e as telas do Grafana ajudam muito no NOC.", rating: 4 },
      { name: "Vanessa Martins", service: "Manutenção e Upgrade de Hardware", text: "Limpeza de poeira e troca de pasta térmica feitas com qualidade. O barulho de turbina que o PC fazia sumiu completamente.", rating: 4 },
      { name: "Lucas Faria", service: "Central de Serviços GLPI", text: "A estruturação dos chamados via formulários diminuiu os erros de triagem. Excelente consultoria e treinamento de equipe.", rating: 4 },
      { name: "jorge Fernando", service: "Monitoramento Zabbix & Grafana", text: "O monitoramento funciona bem, mas a configuração inicial de alertas no Telegram exigiu alguns testes extras da equipe.", rating: 3 },
      { name: "Eliane Souza", service: "Dashboards Power BI", text: "Os relatórios são dinâmicos e ajudam a gerência. Tivemos dificuldades de atualização automática devido a restrições do nosso firewall local.", rating: 3 },
      { name: "Marcos Vinícius", service: "Manutenção e Upgrade de Hardware", text: "Fizeram um bom serviço de limpeza física, mas tive que reinstalar o driver de som do computador após a limpeza do sistema operacional.", rating: 3 }
    ];

    const startDate = new Date(2025, 4, 1); // 1st May 2025
    const processedTestimonials = testimonials.map((t, index) => {
        const d = new Date(startDate.getTime());
        d.setDate(startDate.getDate() + index * 10);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return {
            name: t.name,
            service: t.service,
            text: t.text,
            rating: t.rating,
            date: `${dd}/${mm}/${yyyy}`
        };
    });

    const newCode = `const testimonialsData = ${JSON.stringify(processedTestimonials, null, 2)};\n\nif (typeof window !== 'undefined') {\n  window.testimonialsData = testimonialsData;\n}\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = testimonialsData;\n}\n`;
    fs.writeFileSync(testDataPath, newCode, 'utf8');
    console.log("Successfully distributed mock dates in testimonials-data.js");
}

// 2. Refactor blog posts scripts for array checks, callbacks instead of done/fail
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

        // Target loadComments
        const oldLoadComments = `            function loadComments() {
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
            }`;

        const newLoadComments = `            function loadComments() {
                if (COMMENTS_API_URL) {
                    $.ajax({
                        url: COMMENTS_API_URL + '?pageId=' + commentsKey,
                        method: 'GET',
                        dataType: 'json',
                        success: function(comments) {
                            renderComments(comments);
                        },
                        error: function() {
                            var comments = [];
                            try {
                                comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                            } catch(e) {}
                            renderComments(comments);
                        }
                    });
                } else {
                    var comments = [];
                    try {
                        comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                    } catch(e) {}
                    renderComments(comments);
                }
            }`;

        // Target renderComments
        const oldRenderComments = `            function renderComments(comments) {
                var list = $('#comments-list');
                list.find('.comment-item-box').remove();
                if (comments.length > 0) {
                    $('#no-comments').hide();
                    comments.forEach(function(c) {`;

        const newRenderComments = `            function renderComments(comments) {
                var list = $('#comments-list');
                list.find('.comment-item-box').remove();
                var commentsArray = Array.isArray(comments) ? comments : [];
                if (commentsArray.length > 0) {
                    $('#no-comments').hide();
                    commentsArray.forEach(function(c) {`;

        // Target comments.forEach inside renderComments (to match commentsArray.forEach)
        const oldForEach = `                    comments.forEach(function(c) {`;
        const newForEach = `                    commentsArray.forEach(function(c) {`;

        // Target comment form submit AJAX
        const oldSubmit = `                    if (COMMENTS_API_URL) {
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
                        });`;

        const newSubmit = `                    if (COMMENTS_API_URL) {
                        $.ajax({
                            url: COMMENTS_API_URL,
                            method: 'POST',
                            data: commentData,
                            beforeSend: function() {
                                $('#comment-form button[type="submit"]').prop('disabled', true).text('Enviando...');
                            },
                            success: function(data) {
                                $('#comment-form').prepend('<div class="alert alert-success" style="background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; margin-bottom: 20px; padding: 15px; border-radius: 6px;"><i class="fa fa-check-circle"></i> Comentário enviado com sucesso! Atualizando...</div>');
                                $('#author-name').val('');
                                $('#comment-text').val('');
                                setTimeout(function() {
                                    window.location.reload();
                                }, 1600);
                            },
                            error: function() {
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
                            },
                            complete: function() {
                                $('#comment-form button[type="submit"]').prop('disabled', false).text('Enviar Comentário');
                            }
                        });`;

        let changed = false;
        if (content.includes(oldLoadComments)) {
            content = content.replace(oldLoadComments, newLoadComments);
            changed = true;
        }
        if (content.includes(oldRenderComments)) {
            content = content.replace(oldRenderComments, newRenderComments);
            // Replace the forEach inside it as well
            content = content.replace(oldForEach, newForEach);
            changed = true;
        }
        if (content.includes(oldSubmit)) {
            content = content.replace(oldSubmit, newSubmit);
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully refactored comments sub-blocks in: ${file}`);
        } else {
            console.log(`No comments sub-blocks matched in: ${file}`);
        }
    }
});
