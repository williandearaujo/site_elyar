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
	});

	// Contact form
	var form = $('#main-contact-form');
	if (form.length > 0) {
		form.submit(function(event){
			event.preventDefault();
			var form_status = $('<div class="form_status"></div>');
			
			var name = form.find('input[name="name"]').val();
			var email = form.find('input[name="email"]').val();
			var subject = form.find('input[name="subject"]').val();
			var message = form.find('textarea[name="message"]').val();
			var accessKey = form.find('input[name="access_key"]').val();
			
			// If key is not configured, redirect to WhatsApp with pre-filled message
			if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
				form.prepend( form_status.html('<p><i class="fa fa-whatsapp"></i> Redirecionando para o WhatsApp...</p>').fadeIn() );
				
				var formattedMessage = "*Nova Mensagem de Contato (Site Elyar)*\n\n" +
				                       "*Nome:* " + name + "\n" +
				                       "*E-mail:* " + email + "\n" +
				                       "*Assunto:* " + subject + "\n" +
				                       "*Mensagem:* " + message;
				
				var encodedText = encodeURIComponent(formattedMessage);
				var whatsappUrl = "https://wa.me/5511977371257?text=" + encodedText;
				
				setTimeout(function() {
					window.open(whatsappUrl, '_blank');
					form_status.html('<p class="text-success"><i class="fa fa-check"></i> Aberto no WhatsApp!</p>').delay(3000).fadeOut();
				}, 1000);
				
				return;
			}
			
			// If key is configured, submit via AJAX to Web3Forms
			$.ajax({
				url: 'https://api.web3forms.com/submit',
				method: 'POST',
				dataType: 'json',
				data: form.serialize(),
				beforeSend: function(){
					form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Enviando mensagem...</p>').fadeIn() );
				}
			}).done(function(data){
				if (data.success) {
					form_status.html('<p class="text-success">Obrigado pelo contato! Mensagem enviada com sucesso.</p>').delay(4000).fadeOut();
					form[0].reset();
				} else {
					form_status.html('<p class="text-danger">Erro ao enviar. Tente novamente ou use o WhatsApp.</p>').delay(4000).fadeOut();
				}
			}).fail(function() {
				form_status.html('<p class="text-danger">Erro de conexão. Tente novamente ou use o WhatsApp.</p>').delay(4000).fadeOut();
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

});