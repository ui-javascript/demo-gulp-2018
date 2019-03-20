;(function($){

	function jFlex(el, options){

		var base = this;

		base.autoMode = null;
		base.el = el;
		base.$el = $(el);
		base.index = 0;
		base.defaultOptions = {
			autoplay: false,
			fx: 'slide',
			timing: 5000,
			titles: 'top'
		};
		
		base.options = $.extend({}, base.defaultOptions, options);

		function flex(event, autoplay) {

			var idx = (typeof event === 'number') ? event : $(this).index();
			var transform = (!idx) ? '' : 'transform: translate3d(-' + (idx * base.slideWidth) + 'px, 0, 0); ';
			var width = 'width: ' + (base.slideCount * base.slideWidth) + 'px';

			base.index = idx;
			base.$slider.attr('style', transform + width);

			if (typeof event !== 'number' && base.autoMode) {
				clearInterval(base.autoMode);
			}
			
			base.$slideTitles.find('li').attr('class', '');

			if (autoplay) {
				if (idx === 0) {
					base.$slideTitles.find('li:eq(' + (base.slideCount - 1) + ')').attr('class', 'title--auto title--right');
					base.$slideTitles.find('li:eq(' + idx + ')').attr('class', 'title--active title--auto');
				} else {
					base.$slideTitles.find('li:eq(' + (idx - 1) + ')').attr('class', (autoplay) ? 'title--right title--auto' : 'title--right');
					base.$slideTitles.find('li:eq(' + idx + ')').attr('class', (autoplay) ? 'title--active title--auto' : 'title--active');
				}
			} else {
				base.$slideTitles.find('li:eq(' + idx + ')').attr('class', 'title--active');
			}

			// trigger css repaint / reflow
			base.$el.offset().height;

		}

		function playBall(){
			var idx = 0;
			base.autoMode = setInterval(function(){
				idx = (idx === base.slideCount - 1) ? 0 : idx + 1;
				flex(idx, true);
			}, base.options.timing);
			base.$slideTitles.children().first().attr('class', 'title--active title--auto');
		}

		function selectFirstTitle(){
			base.$slideTitles.children().first().attr('class', 'title--active');
		}

		function bindFlex(){
			base.$slideTitles.children().bind('click', flex);
			base.$slides.find('img').bind('dragstart', function(event) { event.preventDefault(); });
			$(window).bind('resize orientationchange', flexSize);
		}

		function bindTouch(){

			var diff = 0,
				direction,
				origMouseX;

			function dragStart(event) {
				if (base.autoMode) {
					clearInterval(base.autoMode);
				}
				var orig = (event.type === 'mousedown') ? event.originalEvent : event.originalEvent.touches[0];
				origMouseX = orig.pageX;
				base.$slider.bind('touchmove', dragMove)
							.bind('mousemove', dragMove)
							.bind('mouseleave', dragOff)
							.bind('mouseup', dragOff)
							.bind('touchend', dragOff)
							.bind('touchcancel', dragOff)
							.removeClass('slides--anim');
				base.$slideTitles.children().removeClass('title--auto');
			}

			function dragMove(event) {
				var origEv = (event.type === 'touchmove') ? event.originalEvent.touches[0] : event.originalEvent;
				var mouseX = origEv.pageX;
				diff = Math.round(mouseX - origMouseX);
				direction = (diff < 0) ? '<' : '>';
				var offset =  (base.index * -base.slideWidth) + diff;
				if (direction === '>' && base.index === 0 ||
					direction === '<' && base.index === (base.slideCount - 1)) {
					return;
				}
				base.$slider.attr('style', 'width: ' + (base.slideWidth * base.slideCount) + 'px; transform: translate3d(' + offset + 'px, 0, 0)');
			}

			function dragOff(event) {
				var newIndex = (direction === '<') ? base.index + 1 : base.index - 1,
					origEv = (event.type === 'touchend' || event.type === 'touchcancel') ? event.originalEvent.changedTouches[0] : event.originalEvent;
				var mouseX = origEv.pageX,
					offset = base.index * base.slideWidth;
				diff = Math.round(mouseX - origMouseX);
				base.$slider.unbind('touchmove', dragMove)
							.unbind('mousemove', dragMove)
							.unbind('mouseleave', dragOff)
							.unbind('mouseup', dragOff)
							.unbind('touchend', dragOff)
							.unbind('touchcancel', dragOff)
							.addClass('slides--anim');
				if (direction === '>' && base.index === 0 ||
					direction === '<' && base.index === (base.slideCount - 1)) {
					return;
				}
				if (diff > 140 || diff < -140) {
					flex(newIndex);
					return;
				}
				base.$slider.attr('style', 'width: ' + (base.slideWidth * base.slideCount) + 'px; transform: translate3d(-' + offset + 'px, 0, 0)');
			}

			base.$slider.bind('touchstart', dragStart);
			base.$slider.bind('mousedown', dragStart);

		}

		function setGlobals(){
			base.$el.addClass('jFlex');
			base.$slider = base.$el.children();
			base.$slides = base.$slider.children();
			base.slideCount = base.$slides.length;
			base.slideWidth = base.$el.width();

			base.$slides.width(base.slideWidth + 'px');
			base.$el.children().width(base.slideCount * base.slideWidth + 'px');

			base.$slideTitles = $('<ul class="slides--titles"></ul>');
		}

		function flexAnimated(){
			base.$slider.addClass('slides--anim');
		}

		function flexSize(){
			var transform = !base.index ? '' : 'transform: translate3d(-' + (base.index * base.slideWidth) + 'px, 0, 0); ';
			base.slideWidth = base.$el.width();
			base.$slider.attr('style', transform + 'width: ' + (base.slideCount * base.slideWidth) + 'px');
			base.$slides.width(base.slideWidth + 'px');
		}

		function flexTitles(){
			var titleLi;
			if (base.options.titles === 'bottom') {
				base.$el.append(base.$slideTitles);
				titleLi = '<li data-title="{{i}}"><span class="title--l"></span><span class="title--t">{{title}}</span></li>';
			} else {
				base.$el.prepend(base.$slideTitles);
				titleLi = '<li data-title="{{i}}"><span class="title--t">{{title}}</span><span class="title--l"></span></li>';
			}
			var titles = '';
			for (var i = 0; i < base.slideCount; i++) {
				var sTitle = $(base.$slides[i]).attr('data-title') ? $(base.$slides[i]).attr('data-title') : '';
				titles += titleLi.replace('{{i}}', i).replace('{{title}}', sTitle);
			}
			base.$slideTitles.append(titles);
			var height = base.$slideTitles.height(),
				length = '6';
			if (base.$slides.length === 2 ||
				base.$slides.length === 3 ||
				base.$slides.length === 4 ||
				base.$slides.length === 5) {
				length = base.$slides.length;
			}
		}

		base.init = function(){

			setGlobals();

			if (base.slideCount < 2) {
				console.error('Your HTML must contain at least two slides to flex.');
				return;
			}

			flexTitles();
			bindFlex();

			if (typeof base.options.fx === 'string' && base.options.fx === 'slide') {
				flexAnimated();
				bindTouch();
			}

			if (base.options.autoplay) {
				playBall();
			} else {
				selectFirstTitle();
			}

		};

		base.init();

	}
	
	$.fn.jFlex = function(options){
		return this.each(function(){
			(new jFlex(this, options));
		});
	};

})(jQuery);