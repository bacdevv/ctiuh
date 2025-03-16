"use strict";

// Cache DOM queries for better performance
const $window = $(window);
const $document = $(document);
const $body = $("body");

// Debounce utility to limit function calls
const debounce = (func, wait) => {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
};

// Window load handler
$window.on("load", () => {
	$(".loader").fadeOut();
	$("#preloder")
		.delay(400)
		.fadeOut("slow", () => animateElements());
});

const animateElements = () => {
	$(".modern-header").addClass("loaded");
	setTimeout(() => $(".hero__section").addClass("loaded"), 300);
	appearOnScroll();
};

const appearOnScroll = () => {
	const $animatedElements = $(".animate-on-scroll");

	const checkIfInView = () => {
		const windowHeight = $window.height();
		const windowTop = $window.scrollTop();
		const windowBottom = windowTop + windowHeight;

		$animatedElements.each(function () {
			const $el = $(this);
			const elTop = $el.offset().top;
			const elBottom = elTop + $el.outerHeight();

			if (elBottom >= windowTop && elTop <= windowBottom) {
				$el.addClass("animated");
			}
		});
	};

	$window.on("scroll resize", debounce(checkIfInView, 100)).trigger("scroll");
};

// Initialize everything when document is ready
$(() => {
	initHeader();
	initProgressBars();
	initHoverEffects();
	initLightbox();
	initVideoControls();
	initSliders();
});

const initHeader = () => {
	const $header = $(".modern-header");

	$window
		.on(
			"scroll",
			debounce(() => {
				const scrolled = $window.scrollTop() > 100;
				$header.toggleClass("scrolled", scrolled).toggleClass("transparent", !scrolled);
			}, 50)
		)
		.trigger("scroll");
};

const initProgressBars = () => {
	$(".progress-bar-style").each(function () {
		const progress = $(this).data("progress");
		const $bar = $(this).find(".bar-inner");
		const $heading = $(this).siblings("h6");

		if (!$heading.find("span").length) {
			$heading.append(`<span>${progress}%</span>`);
		}

		$window.on(
			"scroll",
			debounce(() => {
				const viewportBottom = $window.scrollTop() + $window.height();
				const elementBottom = $(this).offset().top + $(this).outerHeight();

				if (viewportBottom > elementBottom) {
					$bar.css("width", `${progress}%`);
				}
			}, 50)
		);
	});
};

const initHoverEffects = () => {
	// Menu hover effects
	$(".nav__menu > li > a").hover(
		function () {
			$(this).parent().siblings().find("a").addClass("dimmed");
		},
		function () {
			$(this).parent().siblings().find("a").removeClass("dimmed");
		}
	);

	// Gallery hover effects
	$(".gallery__item").hover(
		function () {
			$(this).siblings().addClass("dimmed-item");
		},
		function () {
			$(this).siblings().removeClass("dimmed-item");
		}
	);
};

const initLightbox = () => {
	if ($.fn.fresco) {
		$(".fresco").fresco({
			thumbnails: true,
			keyboard: true,
			loop: true,
			touchScroll: true,
			clickContent: false,
			thumbnailsPosition: "bottom",
		});
	}
};

// Video controls functionality
const initVideoControls = () => {
	const video = document.getElementById("aboutVideo");
	if (!video) return;

	const playPauseBtn = document.querySelector(".play-pause-btn");
	const muteBtn = document.querySelector(".mute-btn");
	const volumeSlider = document.querySelector(".volume-slider");
	const progressBar = document.querySelector(".progress");
	const progressContainer = document.querySelector(".progress-bar");

	// Play and pause video
	playPauseBtn?.addEventListener("click", () => {
		if (video.paused) {
			video.play();
			playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
		} else {
			video.pause();
			playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
		}
	});

	// Mute/unmute video
	muteBtn?.addEventListener("click", () => {
		video.muted = !video.muted;
		muteBtn.innerHTML = video.muted
			? '<i class="fa fa-volume-off"></i>'
			: '<i class="fa fa-volume-up"></i>';
	});

	// Adjust video volume
	volumeSlider?.addEventListener("input", () => {
		video.volume = volumeSlider.value;
		video.muted = video.volume === 0;
		muteBtn.innerHTML = video.muted
			? '<i class="fa fa-volume-off"></i>'
			: '<i class="fa fa-volume-up"></i>';
	});

	// Update progress bar as video plays
	video.addEventListener("timeupdate", () => {
		if (progressBar) {
			const percent = (video.currentTime / video.duration) * 100;
			progressBar.style.width = percent + "%";
		}
	});

	// Allow clicking on progress container to seek
	progressContainer?.addEventListener("click", (e) => {
		const rect = progressContainer.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const newTime = (clickX / rect.width) * video.duration;
		video.currentTime = newTime;
	});

	// Continue playing when video is clicked
	video.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		video.play();
	});

	// Auto-play video when scrolled into view
	const checkVideoVisibility = () => {
		const rect = video.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0 && video.paused) {
			video.play();
		}
	};

	window.addEventListener("scroll", debounce(checkVideoVisibility, 100));
};

// Initialize all sliders
const initSliders = () => {
	// Hero slider initialization
	const hero_slider = $(".hero-slider");

	if (hero_slider.length) {
		hero_slider.slick({
			dots: false,
			infinite: true,
			speed: 700,
			slidesToShow: 1,
			centerMode: true,
			variableWidth: true,
			arrows: false,
			asNavFor: ".hero-text-slider",
			autoplay: true,
			pauseOnHover: false,
			autoplaySpeed: 5000,
			responsive: [
				{
					breakpoint: 991,
					settings: {
						centerMode: false,
						variableWidth: false,
						adaptiveHeight: true,
						fade: true,
						cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
					},
				},
				{
					breakpoint: 480,
					settings: {
						centerMode: false,
						variableWidth: false,
						adaptiveHeight: true,
						fade: true,
					},
				},
			],
		});

		// Handle header appearance based on scroll position
		$window.on(
			"scroll",
			debounce(function () {
				if ($window.width() <= 991) {
					const headerHeight = $(".modern-header").outerHeight();
					const heroSectionHeight = $(".hero__section").outerHeight();
					const scrolledPastHero = $window.scrollTop() > heroSectionHeight - headerHeight;

					$(".modern-header").toggleClass("scrolled", scrolledPastHero);
				}
			}, 50)
		);

		// Navigation buttons for hero slider
		const updateSliderNavVisibility = () => {
			$(".hero-slider-nav").toggle($window.width() > 767);
		};

		// Initial call and window resize handler
		updateSliderNavVisibility();
		$window.on("resize", debounce(updateSliderNavVisibility, 100));

		// Slider navigation and click handlers
		$(".hero-slider-nav .prev-slide").on("click", () => hero_slider.slick("slickPrev"));
		$(".hero-slider-nav .next-slide").on("click", () => hero_slider.slick("slickNext"));

		// Handle slide click - either open lightbox or advance to next slide
		hero_slider.on("click", ".slick-slide", function (e) {
			// If Fresco is available and screen is larger than mobile, let Fresco handle it
			if ($.fn.fresco && $window.width() > 767) {
				return true; // Allow the fresco lightbox to open
			}

			// For mobile or when Fresco isn't available, advance to next slide
			e.preventDefault();
			hero_slider.slick("slickNext");
		});

		// Text slider initialization
		$(".hero-text-slider").slick({
			dots: false,
			infinite: false,
			speed: 500,
			arrows: false,
			asNavFor: ".hero-slider",
			fade: true,
			cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
		});
	}

	// Blog slider initialization
	const blog_slider = $(".blog__slider");

	if (blog_slider.length) {
		blog_slider.slick({
			dots: false,
			infinite: true,
			speed: 300,
			arrows: false,
			centerMode: true,
			centerPadding: "190px",
			slidesToShow: 2,
			autoplay: true,
			pauseOnHover: false,
			responsive: [
				{
					breakpoint: 991,
					settings: {
						centerPadding: "0",
						slidesToShow: 2,
						slidesToScroll: 2,
					},
				},
				{
					breakpoint: 480,
					settings: {
						centerMode: false,
						slidesToShow: 1,
						slidesToScroll: 1,
						centerPadding: "0",
					},
				},
			],
		});
	}
};

// Initialize scroll-to-top functionality
$(() => {
	const $scrollTopBtn = $("#scrollTopBtn");
	let scrollingTimer;

	// Check scroll position on page load and scroll
	const checkScrollPosition = debounce(() => {
		$scrollTopBtn.toggleClass("show", $window.scrollTop() > 300);
	}, 50);

	checkScrollPosition();

	$window.on("scroll", () => {
		checkScrollPosition();

		// Add class when scrolling
		$body.addClass("is-scrolling");

		// Clear previous timeout
		clearTimeout(scrollingTimer);

		// Set new timeout
		scrollingTimer = setTimeout(() => {
			$body.removeClass("is-scrolling");
		}, 250);
	});

	// Scroll to top when button is clicked
	$scrollTopBtn.on("click", (e) => {
		e.preventDefault();
		$body.addClass("scrolling-to-top");

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});

		// Remove class after animation completes
		setTimeout(() => {
			$body.removeClass("scrolling-to-top");
		}, 300);
	});
});

// Set up for common website functionalities
(function ($) {
	// Background image setup
	$(".set-bg").each(function () {
		const bg = $(this).data("setbg");
		$(this).css("background-image", `url(${bg})`);
	});

	// Mobile navigation
	$(".nav-switch").on("click", (e) => {
		e.preventDefault();
		$(".slicknav_btn").click();
	});

	$(".nav__menu").slicknav({
		appendTo: ".main__menu",
		openedSymbol: '<i class="fa fa-angle-up"></i>',
		closedSymbol: '<i class="fa fa-angle-right"></i>',
	});

	// Close mobile menu when clicking outside
	$document.on("click", (e) => {
		if ($(e.target).closest(".slicknav_menu, .nav-switch").length === 0) {
			$(".nav__menu").slicknav("close");
		}
	});

	// Search functionality
	$(".search-switch").on("click", (e) => {
		e.preventDefault();
		$(".search-model").fadeIn(400);
		setTimeout(() => $("#search-input").focus(), 500);
	});

	$(".search-close-switch").on("click", () => {
		$(".search-model").fadeOut(400, () => $("#search-input").val(""));
	});
})(jQuery);
