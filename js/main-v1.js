jQuery(function($) {'use strict';

	// Navigation Scroll
	$(window).scroll(function(event) {
		Scroll();
	});

	$('.navbar-collapse ul li a').on('click', function() {  
		if (this.hash && $(this.hash).length > 0) {
			$('html, body').animate({scrollTop: $(this.hash).offset().top - 5}, 1000);
			return false;
		}
	});

	// User define function
	function Scroll() {
		var contentTop      =   [];
		var contentBottom   =   [];
		var winTop      =   $(window).scrollTop();
		var rangeTop    =   200;
		var rangeBottom =   500;
		$('.navbar-collapse').find('.scroll a').each(function(){
			var href = $(this).attr('href');
			if (href && href.indexOf('#') === 0 && $(href).length > 0) {
				contentTop.push( $(href).offset().top);
				contentBottom.push( $(href).offset().top + $(href).height() );
			}
		});
		$.each( contentTop, function(i){
			if ( winTop > contentTop[i] - rangeTop ){
				$('.navbar-collapse li.scroll')
				.removeClass('active')
				.eq(i).addClass('active');			
			}
		});
	}

	if ($('#tohash').length > 0) {
		$('#tohash').on('click', function(){
			if (this.hash && $(this.hash).length > 0) {
				$('html, body').animate({scrollTop: $(this.hash).offset().top - 5}, 1000);
				return false;
			}
		});
	}

	// accordian
	$('.accordion-toggle').on('click', function(){
		$(this).closest('.panel-group').children().each(function(){
			$(this).find('>.panel-heading').removeClass('active');
		});
	 	$(this).closest('.panel-heading').toggleClass('active');
	});

	//Slider
	$(document).ready(function() {
		if ($("#main-slider").length > 0 && $.fn.owlCarousel) {
			var time = 7; // time in seconds
			var $progressBar,
			  $bar, 
			  $elem, 
			  isPause, 
			  tick,
			  percentTime;
		 
			//Init the carousel
			$("#main-slider").find('.owl-carousel').owlCarousel({
			  slideSpeed : 500,
			  paginationSpeed : 500,
			  singleItem : true,
			  navigation : true,
			  navigationText: [
				"<i class='fa fa-angle-left'></i>",
				"<i class='fa fa-angle-right'></i>"
			  ],
			  afterInit : progressBar,
			  afterMove : moved,
			  startDragging : pauseOnDragging,
			  transitionStyle : "fadeUp"
			});
		 
			//Init progressBar where elem is $("#owl-demo")
			function progressBar(elem){
			  $elem = elem;
			  buildProgressBar();
			  start();
			}
		 
			//create div#progressBar and div#bar then append to $(".owl-carousel")
			function buildProgressBar(){
			  $progressBar = $("<div>",{
				id:"progressBar"
			  });
			  $bar = $("<div>",{
				id:"bar"
			  });
			  $progressBar.append($bar).appendTo($elem);
			}
		 
			function start() {
			  percentTime = 0;
			  isPause = false;
			  tick = setInterval(interval, 10);
			}
		 
			function interval() {
			  if(isPause === false){
				percentTime += 1 / time;
				$bar.css({
				   width: percentTime+"%"
				 });
				if(percentTime >= 100){
				  $elem.trigger('owl.next')
				}
			  }
			}
		 
			//pause while dragging 
			function pauseOnDragging(){
			  isPause = true;
			}
		 
			//moved callback
			function moved(){
			  clearTimeout(tick);
			  start();
			}
		}
	});

	//Initiat WOW JS
	if (typeof WOW !== 'undefined') {
		new WOW().init();
	}
	
	//smoothScroll
	if (typeof smoothScroll !== 'undefined') {
		smoothScroll.init();
	}

	// portfolio filter
	$(window).load(function(){'use strict';
		var $portfolio_selectors = $('.portfolio-filter >li>a');
		var $portfolio = $('.portfolio-items');
		
		if ($portfolio.length > 0 && $.fn.isotope) {
			$portfolio.isotope({
				itemSelector : '.portfolio-item',
				layoutMode : 'fitRows'
			});
			
			$portfolio_selectors.on('click', function(){
				$portfolio_selectors.removeClass('active');
				$(this).addClass('active');
				var selector = $(this).attr('data-filter');
				$portfolio.isotope({ filter: selector });
				return false;
			});
		}
	});

	$(document).ready(function() {
		//Animated Progress
		if ($.fn.bind) {
			$('.progress-bar').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
				if (visible) {
					$(this).css('width', $(this).data('width') + '%');
					$(this).unbind('inview');
				}
			});

			$('.animated-number').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
				var $this = $(this);
				if (visible) {
					$this.animateNumbers($this.data('digit'), false, $this.data('duration')); 
					$this.unbind('inview');
				}
			});
		}

		//Animated Number Helper
		$.fn.animateNumbers = function(stop, commas, duration, ease) {
			return this.each(function() {
				var $this = $(this);
				var start = parseInt($this.text().replace(/,/g, ""));
				commas = (commas === undefined) ? true : commas;
				$({value: start}).animate({value: stop}, {
					duration: duration == undefined ? 1000 : duration,
					easing: ease == undefined ? "swing" : ease,
					step: function() {
						$this.text(Math.floor(this.value));
						if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
					},
					complete: function() {
						if (parseInt($this.text()) !== stop) {
							$this.text(stop);
							if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
						}
					}
				});
			});
		};
		// Custom Premium Counter via Native requestAnimationFrame & IntersectionObserver
		var counterSec = document.querySelector('.metrics-section');
		if (counterSec) {
			var animateValue = function(obj, start, end, duration, decimals) {
				var startTimestamp = null;
				var step = function(timestamp) {
					if (!startTimestamp) startTimestamp = timestamp;
					var progress = Math.min((timestamp - startTimestamp) / duration, 1);
					var currentVal = progress * (end - start) + start;
					if (decimals) {
						obj.innerHTML = parseFloat(currentVal).toFixed(1);
					} else {
						obj.innerHTML = Math.floor(currentVal);
					}
					if (progress < 1) {
						window.requestAnimationFrame(step);
					} else {
						if (decimals) {
							obj.innerHTML = parseFloat(end).toFixed(1);
						} else {
							obj.innerHTML = Math.floor(end);
						}
					}
				};
				window.requestAnimationFrame(step);
			};

			var observer = new IntersectionObserver(function(entries, observer) {
				entries.forEach(function(entry) {
					if (entry.isIntersecting) {
						var numbers = entry.target.querySelectorAll('.metric-number');
						numbers.forEach(function(num) {
							var target = parseFloat(num.getAttribute('data-target')) || 0;
							var decimals = num.getAttribute('data-decimals') ? true : false;
							animateValue(num, 0, target, 2000, decimals);
						});
						observer.unobserve(entry.target);
					}
				});
			}, { threshold: 0.1 });
			observer.observe(counterSec);
		}
	});

	// Contact form
	var form = $('#main-contact-form');
	if (form.length > 0) {
		form.submit(function(event){
			event.preventDefault();
			var form_status = $('<div class="form_status"></div>');
			
			// Submit via AJAX to FormSubmit.co
			$.ajax({
				url: 'https://formsubmit.co/ajax/contato@elyar.com.br',
				method: 'POST',
				dataType: 'json',
				headers: {
					'Accept': 'application/json'
				},
				data: form.serialize(),
				beforeSend: function(){
					form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Enviando mensagem por e-mail...</p>').fadeIn() );
				}
			}).done(function(data){
				if (data.success === "true" || data.success === true) {
					form_status.html('<p class="text-success">Obrigado pelo contato! Sua mensagem foi enviada por e-mail com sucesso.</p>').delay(6000).fadeOut();
					form[0].reset();
				} else {
					var serverMsg = data.message || "";
					// Check if it is the first submit requesting activation
					if (serverMsg.toLowerCase().includes('activate') || serverMsg.toLowerCase().includes('first') || serverMsg.toLowerCase().includes('confirmation')) {
						form_status.html('<p class="text-warning" style="color: #ffc107; font-weight: 600;"><i class="fa fa-exclamation-triangle"></i> Ativação necessária! Verifique a caixa de entrada de contato@elyar.com.br para ativar o formulário.</p>');
					} else {
						form_status.html('<p class="text-danger">Erro: ' + (serverMsg || 'Falha ao enviar o e-mail.') + ' Tente novamente ou use o WhatsApp.</p>').delay(8000).fadeOut();
					}
				}
			}).fail(function(xhr) {
				var errResponse = xhr.responseJSON || {};
				var errMsg = errResponse.message || "";
				if (errMsg.toLowerCase().includes('activate') || errMsg.toLowerCase().includes('first') || errMsg.toLowerCase().includes('confirmation')) {
					form_status.html('<p class="text-warning" style="color: #ffc107; font-weight: 600;"><i class="fa fa-exclamation-triangle"></i> Ativação necessária! Verifique a caixa de entrada de contato@elyar.com.br para ativar o formulário.</p>');
				} else {
					form_status.html('<p class="text-danger">Erro de conexão. Tente novamente ou fale conosco via WhatsApp.</p>').delay(8000).fadeOut();
				}
			});
		});
	}

	//Pretty Photo
	if ($.fn.prettyPhoto) {
		$("a[rel^='prettyPhoto']").prettyPhoto({
			social_tools: false
		});
	}

	//Google Map
	if ($('#google-map').length > 0 && typeof google !== 'undefined') {
		var latitude = $('#google-map').data('latitude');
		var longitude = $('#google-map').data('longitude');
		var zoom = $('#google-map').data('zoom') || 14;
		var initialize_map = function() {
			var myLatlng = new google.maps.LatLng(latitude,longitude);
			var mapOptions = {
				zoom: parseInt(zoom, 10),
				scrollwheel: false,
				center: myLatlng
			};
			var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
			var marker = new google.maps.Marker({
				position: myLatlng,
				map: map
			});
		};
		google.maps.event.addDomListener(window, 'load', initialize_map);
	}

	// =============================================================
	// UNIFIED MASTER HEADER, FOOTER, AND SEARCH ENGINE
	// =============================================================
	$(document).ready(function() {
		var path = window.location.pathname;
		var isSub = path.includes('/blog/') || path.includes('/servicos/');
		var prefix = isSub ? '../' : '';
		
		var activeTab = '';
		if (path.includes('index.html') || path === '/' || path.endsWith('/site_elyar/') || path.endsWith('/')) activeTab = 'home';
		else if (path.includes('servicos.html') || path.includes('/servicos/')) activeTab = 'servicos';
		else if (path.includes('portfolio.html')) activeTab = 'portfolio';
		else if (path.includes('blog.html') || path.includes('/blog/')) activeTab = 'blog';
		else if (path.includes('contato.html')) activeTab = 'contato';
		else if (path.includes('depoimentos.html')) activeTab = 'depoimentos';

		// Inject Unified Header
		if ($('#header').length > 0) {
			var headerHtml = `
			<nav id="main-menu" class="navbar navbar-default navbar-fixed-top" role="banner">
				<div class="container">
					<div class="navbar-header">
						<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar" style="background-color: white;"></span>
							<span class="icon-bar" style="background-color: white;"></span>
							<span class="icon-bar" style="background-color: white;"></span>
						</button>
						<a class="navbar-brand-wrapper" href="${prefix}index.html" style="text-decoration: none;">
							<div style="width: 48px; height: 48px; overflow: hidden; border-radius: 10px; display: inline-flex; align-items: center; justify-content: flex-start; flex-shrink: 0;">
								<img src="${prefix}images/logo_real.png" alt="logo" style="height: 48px; width: auto; max-width: none; object-fit: cover; object-position: left;">
							</div>
							<span class="logo-text-elyar" style="text-transform: none;">Elyar</span>
						</a>
					</div>
					
					<div class="collapse navbar-collapse navbar-right">
						<ul class="nav navbar-nav">
							<li class="${activeTab === 'home' ? 'active' : ''}"><a href="${prefix}index.html">Início</a></li>
							<li class="${activeTab === 'servicos' ? 'active' : ''}"><a href="${prefix}servicos.html">Serviços</a></li>
							<li class="${activeTab === 'portfolio' ? 'active' : ''}"><a href="${prefix}portfolio.html">Portfólio BI</a></li>
							<li class="${activeTab === 'blog' ? 'active' : ''}"><a href="${prefix}blog.html">Blog</a></li>
							<li class="${activeTab === 'depoimentos' ? 'active' : ''}"><a href="${prefix}depoimentos.html">Depoimentos</a></li>
							<li class="${activeTab === 'contato' ? 'active' : ''}"><a href="${prefix}contato.html">Contato</a></li>
							<li class="search-trigger-item"><a href="#" id="global-search-btn" style="cursor: pointer;"><i class="fa fa-search"></i> Busca</a></li>
							<li><a href="https://elyar.atlassian.net/servicedesk/customer/portal/1" target="_blank">Chamados</a></li>
							<li><a href="https://wa.me/5511977371257?text=Ol%C3%A1,%20estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20Elyar%20Servi%C3%A7os" target="_blank" style="color: var(--color-accent-yellow) !important;"><i class="fa fa-whatsapp"></i> WhatsApp</a></li>
						</ul>
					</div>
				</div>
			</nav>
			`;
			$('#header').html(headerHtml);
		}

		// Inject Unified Footer
		if ($('#footer').length > 0) {
			var footerHtml = `
			<div class="container">
				<div class="footer-premium-grid">
					<!-- Col 1 -->
					<div class="footer-col">
						<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
							<div style="width: 38px; height: 38px; overflow: hidden; border-radius: 8px; display: inline-flex; align-items: center; justify-content: flex-start; flex-shrink: 0;">
								<img src="${prefix}images/logo_real.png" alt="logo" style="height: 38px; width: auto; max-width: none; object-fit: cover; object-position: left;">
							</div>
							<span style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 22px; color: white; letter-spacing: 1.5px;">Elyar</span>
						</div>
						<p class="footer-desc">
							Desenvolvimento de painéis em Power BI de alto impacto visual e consultoria técnica especializada em infraestrutura de hardware.
						</p>
						<ul class="footer-social-list">
							<li><a href="https://www.instagram.com/elyarservicos" target="_blank" aria-label="Instagram"><i class="fa fa-instagram"></i></a></li>
							<li><a href="https://www.linkedin.com/company/elyar/" target="_blank" aria-label="LinkedIn"><i class="fa fa-linkedin"></i></a></li>
						</ul>
					</div>
					<!-- Col 2 -->
					<div class="footer-col">
						<h4>Navegação</h4>
						<ul>
							<li><a href="${prefix}index.html">Início</a></li>
							<li><a href="${prefix}servicos.html">Serviços</a></li>
							<li><a href="${prefix}portfolio.html">Portfólio BI</a></li>
							<li><a href="${prefix}blog.html">Blog</a></li>
							<li><a href="${prefix}depoimentos.html">Depoimentos</a></li>
							<li><a href="${prefix}contato.html">Contato</a></li>
						</ul>
					</div>
					<!-- Col 3 -->
					<div class="footer-col">
						<h4>Soluções</h4>
						<ul>
							<li><a href="${prefix}servicos/powerbi.html">Dashboards Power BI</a></li>
							<li><a href="${prefix}servicos/zabbix.html">Monitoramento Zabbix</a></li>
							<li><a href="${prefix}servicos/wazuh.html">Segurança SIEM Wazuh</a></li>
							<li><a href="${prefix}servicos/manutencao.html">Suporte e Hardware</a></li>
						</ul>
					</div>
					<!-- Col 4 -->
					<div class="footer-col">
						<h4>Contato</h4>
						<ul>
							<li><i class="fa fa-map-marker" style="color: var(--color-accent-yellow); margin-right: 8px;"></i> Guarulhos, São Paulo</li>
							<li><i class="fa fa-envelope" style="color: var(--color-accent-yellow); margin-right: 8px;"></i> contato@elyar.com.br</li>
							<li><i class="fa fa-phone" style="color: var(--color-accent-yellow); margin-right: 8px;"></i> (11) 9.7737-1257</li>
						</ul>
					</div>
				</div>
				
				<div class="footer-bottom-premium">
					<p>&copy; 2026 Elyar Serviços. Todos os direitos reservados.</p>
					<p>Criado por <a href="${prefix}index.html" style="color: var(--color-accent-yellow); text-decoration: underline;">Elyar Serviços</a></p>
				</div>
			</div>
			`;
			$('#footer').html(footerHtml);
		}

		// Inject Search Modal
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

		// Search Index data
		var searchIndex = [
			{ title: "Início", path: "index.html", category: "Página", desc: "Página inicial da Elyar Serviços. Dashboards de alta performance em Power BI, monitoramento ativo e suporte de TI.", keywords: "inicio home bem vindo principal elyar" },
			{ title: "Serviços", path: "servicos.html", category: "Página", desc: "Nossos serviços e soluções corporativas de TI: dashboards, redes, segurança da informação e governança.", keywords: "servicos portfolio solucoes o que fazemos" },
			{ title: "Portfólio de BI", path: "portfolio.html", category: "Página", desc: "Demonstrações reais e portfólio de relatórios dinâmicos do Power BI desenvolvidos para empresas.", keywords: "portfolio dashboards exemplos bi business intelligence relatorios" },
			{ title: "Blog & Insights", path: "blog.html", category: "Página", desc: "Artigos técnicos, tendências de mercado, IA, monitoramento, hardware e novidades do mundo da TI.", keywords: "blog artigos insights leituras novidades posts" },
			{ title: "Depoimentos de Clientes", path: "depoimentos.html", category: "Página", desc: "Avaliações e depoimentos de empresas e profissionais atendidos pela Elyar Serviços.", keywords: "depoimentos feedback avaliacoes elogios clientes" },
			{ title: "Contato", path: "contato.html", category: "Página", desc: "Entre em contato conosco. Fale por WhatsApp, envie e-mail ou localize nosso escritório em Guarulhos.", keywords: "contato telefone email falar suporte whatsapp localizacao guarulhos" },
			
			{ title: "Power BI & Dashboards", path: "servicos/powerbi.html", category: "Serviço", desc: "Desenvolvimento de dashboards de alta performance em Power BI, modelagem de dados, fórmulas DAX e segurança RLS.", keywords: "power bi dashboards kpi modelagem dax sql api dados governanca relatorios" },
			{ title: "Monitoramento Ativo (Zabbix & Grafana)", path: "servicos/zabbix.html", category: "Serviço", desc: "Monitoramento ativo de servidores, redes e aplicações. Alertas preventivos via Telegram/WhatsApp para prevenir inatividades.", keywords: "zabbix grafana monitoramento ativo rede servidores alertas preventivos proativo" },
			{ title: "Segurança Cibernética (Wazuh SIEM)", path: "servicos/wazuh.html", category: "Serviço", desc: "Segurança da informação baseada em SIEM com Wazuh. Proteção de dados, conformidade LGPD e detecção de ameaças.", keywords: "seguranca wazuh siem antivirus firewall lgpd invasao vulnerabilidades" },
			{ title: "Central de Serviços (GLPI ITSM)", path: "servicos/glpi.html", category: "Serviço", desc: "Implantação de central de chamados GLPI, catálogo de serviços, helpdesk e governança de processos de TI baseados em ITIL.", keywords: "glpi chamados suporte helpdesk service desk governanca ti itil ticket central" },
			{ title: "Upgrade & Suporte de Hardware", path: "servicos/manutencao.html", category: "Serviço", desc: "Montagem de computadores gamers, upgrades de SSD NVMe e memória RAM, limpeza química e troca de pasta térmica preventiva.", keywords: "manutencao upgrade ssd memoria ram gamer pc limpeza preventiva pasta termica montagem computadores" },
			{ title: "Consultoria Especializada de TI", path: "servicos/consultoria.html", category: "Serviço", desc: "Consultoria estratégica de TI, análise de ativos, planejamento de segurança, compliance de licenças e governança.", keywords: "consultoria auditoria licenca planejamento seguranca governanca assessoria" },

			{ title: "Inteligência Artificial: Ganhos e Desafios", path: "blog/ia-impacto.html", category: "Blog", desc: "Análise profunda sobre os impactos positivos e negativos da Inteligência Artificial nas empresas e pessoas.", keywords: "ia inteligencia artificial produtividade etica tecnologia generativa chatgpt" },
			{ title: "Monitoramento Ativo: O Escudo da TI", path: "blog/monitoramento-ativo.html", category: "Blog", desc: "A importância do monitoramento proativo com Zabbix e Grafana para mitigar os altos custos de servidores indisponíveis.", keywords: "monitoramento ativo zabbix grafana downtime inatividade servidor rede proativo" },
			{ title: "Upgrade e Manutenção Preventiva de Computadores", path: "blog/manutencao-computadores.html", category: "Blog", desc: "Como manter o desempenho máximo de computadores gamers e corporativos com upgrades de RAM/SSD e limpeza preventiva.", keywords: "manutencao upgrade ssd memoria ram gamer pc limpeza preventiva pasta termica montagem computadores" }
		];

		function normalizeStr(str) {
			return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		}

		function getAdjustedPath(targetPath) {
			var inSubfolder = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/servicos/');
			if (inSubfolder) {
				return '../' + targetPath;
			}
			return targetPath;
		}

		// Search modal listeners
		$(document).on('click', '#global-search-btn', function(e) {
			e.preventDefault();
			$('#search-modal').addClass('active');
			setTimeout(function() {
				$('#search-query-input').focus();
			}, 100);
		});

		$(document).on('click', '#search-modal-close-btn', function() {
			$('#search-modal').removeClass('active');
		});

		$(document).on('click', '#search-modal', function(e) {
			if ($(e.target).hasClass('search-overlay-modal')) {
				$('#search-modal').removeClass('active');
			}
		});

		$(document).keyup(function(e) {
			if (e.key === "Escape") {
				$('#search-modal').removeClass('active');
			}
		});

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

});