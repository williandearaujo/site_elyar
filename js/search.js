$(document).ready(function() {
    // -------------------------------------------------------------
    // 1. DATA INDEX (Static Search Database)
    // -------------------------------------------------------------
    var searchIndex = [
        // Base Pages
        { title: "Início", path: "index.html", category: "Página", desc: "Página inicial da Elyar Serviços. Dashboards de alta performance em Power BI, monitoramento ativo e suporte de TI.", keywords: "inicio home bem vindo principal elyar" },
        { title: "Serviços", path: "servicos.html", category: "Página", desc: "Nossos serviços e soluções corporativas de TI: dashboards, redes, segurança da informação e governança.", keywords: "servicos portfolio solucoes o que fazemos" },
        { title: "Portfólio de BI", path: "portfolio.html", category: "Página", desc: "Demonstrações reais e portfólio de relatórios dinâmicos do Power BI desenvolvidos para empresas.", keywords: "portfolio dashboards exemplos bi business intelligence relatorios" },
        { title: "Blog & Insights", path: "blog.html", category: "Página", desc: "Artigos técnicos, tendências de mercado, IA, monitoramento, hardware e novidades do mundo da TI.", keywords: "blog artigos insights leituras novidades posts" },
        { title: "Contato", path: "contato.html", category: "Página", desc: "Entre em contato conosco. Fale por WhatsApp, envie e-mail ou localize nosso escritório em Guarulhos.", keywords: "contato telefone email falar suporte whatsapp localizacao guarulhos" },
        
        // Services
        { title: "Power BI & Dashboards", path: "servicos/powerbi.html", category: "Serviço", desc: "Desenvolvimento de dashboards de alta performance em Power BI, modelagem de dados, fórmulas DAX e segurança RLS.", keywords: "power bi dashboards kpi modelagem dax sql api dados governanca relatorios" },
        { title: "Monitoramento Ativo (Zabbix & Grafana)", path: "servicos/zabbix.html", category: "Serviço", desc: "Monitoramento ativo de servidores, redes e aplicações. Alertas preventivos via Telegram/WhatsApp para prevenir inatividades.", keywords: "zabbix grafana monitoramento ativo rede servidores alertas preventivos proativo" },
        { title: "Segurança Cibernética (Wazuh SIEM)", path: "servicos/wazuh.html", category: "Serviço", desc: "Segurança da informação baseada em SIEM com Wazuh. Proteção de dados, conformidade LGPD e detecção de ameaças.", keywords: "seguranca wazuh siem antivirus firewall lgpd invasao vulnerabilidades" },
        { title: "Central de Serviços (GLPI ITSM)", path: "servicos/glpi.html", category: "Serviço", desc: "Implantação de central de chamados GLPI, catálogo de serviços, helpdesk e governança de processos de TI baseados em ITIL.", keywords: "glpi chamados suporte helpdesk service desk governanca ti itil ticket central" },
        { title: "Upgrade & Suporte de Hardware", path: "servicos/manutencao.html", category: "Serviço", desc: "Montagem de computadores gamers, upgrades de SSD NVMe e memória RAM, limpeza química e troca de pasta térmica preventiva.", keywords: "manutencao upgrade ssd memoria ram gamer pc limpeza preventiva pasta termica montagem computadores" },
        { title: "Consultoria Especializada de TI", path: "servicos/consultoria.html", category: "Serviço", desc: "Consultoria estratégica de TI, análise de ativos, planejamento de segurança, compliance de licenças e governança.", keywords: "consultoria auditoria licenca planejamento seguranca governanca assessoria" },

         // Blog Posts
        { title: "Inteligência Artificial: Ganhos e Desafios", path: "blog/ia-impacto.html", category: "Blog", desc: "Análise profunda sobre os impactos positivos e negativos da Inteligência Artificial nas empresas e pessoas.", keywords: "ia inteligencia artificial produtividade etica tecnologia generativa chatgpt" },
        { title: "Monitoramento Ativo: O Escudo da TI", path: "blog/monitoramento-ativo.html", category: "Blog", desc: "A importância do monitoramento proativo com Zabbix e Grafana para mitigar os altos custos de servidores indisponíveis.", keywords: "monitoramento ativo zabbix grafana downtime inatividade servidor rede proativo" },
        { title: "Upgrade e Manutenção Preventiva de Computadores", path: "blog/manutencao-computadores.html", category: "Blog", desc: "Como manter o desempenho máximo de computadores gamers e corporativos com upgrades de RAM/SSD e limpeza preventiva.", keywords: "manutencao upgrade ssd memoria ram gamer pc limpeza preventiva pasta termica montagem computadores" }
    ];

    // Helper to normalize strings (remove accents and ignore case)
    function normalizeStr(str) {
        return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Helper to dynamically adjust page path depending on folders
    function getAdjustedPath(targetPath) {
        var inSubfolder = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/servicos/');
        if (inSubfolder) {
            return '../' + targetPath;
        }
        return targetPath;
    }

    // -------------------------------------------------------------
    // 2. INJECT TRIGGER & MODAL INTERFACE
    // -------------------------------------------------------------
    // Append search list item to menu navbar
    var navbarNav = $('ul.nav.navbar-nav');
    if (navbarNav.length > 0 && $('.search-trigger-item').length === 0) {
        var searchLi = $('<li class="search-trigger-item"><a href="#" id="global-search-btn" style="cursor: pointer;"><i class="fa fa-search"></i> Busca</a></li>');
        
        // Find if there is a Whatsapp/Chamados link to insert right before it
        var insertBeforeNode = navbarNav.find('a[href*="wa.me"]').parent();
        if (insertBeforeNode.length === 0) {
            insertBeforeNode = navbarNav.find('a[href*="atlassian"]').parent();
        }
        
        if (insertBeforeNode.length > 0) {
            searchLi.insertBefore(insertBeforeNode);
        } else {
            navbarNav.append(searchLi);
        }
    }

    // Append search overlay markup to body
    if ($('#search-modal').length === 0) {
        var modalHtml = `
        <div id="search-modal" class="search-overlay-modal">
            <div class="search-modal-container">
                <button id="search-modal-close-btn" class="search-modal-close"><i class="fa fa-times"></i></button>
                <h3 style="font-family: 'Outfit', sans-serif; font-weight: 700; color: white; margin-top: 0; margin-bottom: 20px; font-size: 1.3rem;">Busca Global Elyar</h3>
                <div class="search-input-wrapper">
                    <i class="fa fa-search"></i>
                    <input type="text" id="search-query-input" class="search-input-premium" placeholder="Digite o que procura... (ex: Zabbix, Power BI, IA, Contato)" autocomplete="off">
                </div>
                <div id="search-results" class="search-results-list">
                    <div class="search-result-empty">Digite algo para iniciar a busca...</div>
                </div>
            </div>
        </div>
        `;
        $('body').append(modalHtml);
    }

    // -------------------------------------------------------------
    // 3. LISTENERS & EVENTS
    // -------------------------------------------------------------
    // Open Modal Click
    $(document).on('click', '#global-search-btn', function(e) {
        e.preventDefault();
        $('#search-modal').addClass('active');
        setTimeout(function() {
            $('#search-query-input').focus();
        }, 100);
    });

    // Close Modal Click
    $(document).on('click', '#search-modal-close-btn', function() {
        $('#search-modal').removeClass('active');
    });

    // Close Modal clicking outside container
    $(document).on('click', '#search-modal', function(e) {
        if ($(e.target).hasClass('search-overlay-modal')) {
            $('#search-modal').removeClass('active');
        }
    });

    // Close Modal on Esc key press
    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            $('#search-modal').removeClass('active');
        }
    });

    // Search Query Typing Event
    $(document).on('input', '#search-query-input', function() {
        var query = normalizeStr($(this).val().trim());
        var resultsBox = $('#search-results');
        
        if (!query) {
            resultsBox.html('<div class="search-result-empty">Digite algo para iniciar a busca...</div>');
            return;
        }

        var matches = [];
        
        searchIndex.forEach(function(item) {
            var matchTitle = normalizeStr(item.title).includes(query);
            var matchDesc = normalizeStr(item.desc).includes(query);
            var matchKeywords = normalizeStr(item.keywords).includes(query);
            
            if (matchTitle || matchDesc || matchKeywords) {
                matches.push(item);
            }
        });

        if (matches.length === 0) {
            resultsBox.html('<div class="search-result-empty">Nenhum resultado encontrado para a busca. Tente outros termos.</div>');
            return;
        }

        var resultsHtml = '';
        matches.forEach(function(item) {
            var adjustedLink = getAdjustedPath(item.path);
            var badgeColor = 'rgba(238, 215, 15, 0.15)';
            var badgeTextColor = 'var(--color-accent-yellow)';
            
            if (item.category === 'Serviço') {
                badgeColor = 'rgba(0, 150, 255, 0.15)';
                badgeTextColor = '#0096ff';
            } else if (item.category === 'Blog') {
                badgeColor = 'rgba(46, 204, 113, 0.15)';
                badgeTextColor = '#2ecc71';
            }

            resultsHtml += `
                <a href="${adjustedLink}" class="search-result-item">
                    <div class="search-result-header">
                        <span class="search-result-title">${item.title}</span>
                        <span class="search-result-badge" style="background: ${badgeColor}; color: ${badgeTextColor}; border-color: transparent;">${item.category}</span>
                    </div>
                    <p class="search-result-desc">${item.desc}</p>
                </a>
            `;
        });

        resultsBox.html(resultsHtml);
    });
});
