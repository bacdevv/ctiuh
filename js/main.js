"use strict";

$(window).on("load", () => {
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
		const windowHeight = $(window).height();
		const windowTop = $(window).scrollTop();
		const windowBottom = windowTop + windowHeight;
		$animatedElements.each(function () {
			const $el = $(this);
			const elTop = $el.offset().top;
			const elBottom = elTop + $el.outerHeight();
			if (elBottom >= windowTop && elTop <= windowBottom) $el.addClass("animated");
		});
	};
	$(window).on("scroll resize", checkIfInView).trigger("scroll");
};

$(() => {
	initHeader();
	initProgressBars();
	initHoverEffects();
	initLightbox();
	initVideoControls(); // initialize video controls
});

const initHeader = () => {
	const $header = $(".modern-header");
	$(window)
		.on("scroll", () => {
			$header
				.toggleClass("scrolled", $(window).scrollTop() > 100)
				.toggleClass("transparent", $(window).scrollTop() <= 100);
		})
		.trigger("scroll");
};

const initProgressBars = () => {
	$(".progress-bar-style").each(function () {
		const progress = $(this).data("progress");
		const $bar = $(this).find(".bar-inner");
		if (!$(this).siblings("h6").find("span").length)
			$(this).siblings("h6").append(`<span>${progress}%</span>`);
		$(window).on("scroll", () => {
			if (
				$(window).scrollTop() + $(window).height() >
				$(this).offset().top + $(this).outerHeight()
			)
				$bar.css("width", `${progress}%`);
		});
	});
};

const initHoverEffects = () => {
	$(".nav__menu > li > a").hover(
		function () {
			$(this).parent().siblings().find("a").addClass("dimmed");
		},
		function () {
			$(this).parent().siblings().find("a").removeClass("dimmed");
		}
	);
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
	if ($.fn.fresco)
		$(".fresco").fresco({
			thumbnails: true,
			keyboard: true,
			loop: true,
			touchScroll: true,
			clickContent: false,
			thumbnailsPosition: "bottom",
		});
};

// Add video controls functionality
const initVideoControls = () => {
	const video = document.getElementById("aboutVideo");
	if (!video) return;

	const playPauseBtn = document.querySelector(".play-pause-btn");
	const muteBtn = document.querySelector(".mute-btn");
	const volumeSlider = document.querySelector(".volume-slider");
	const progressBar = document.querySelector(".progress");
	const progressContainer = document.querySelector(".progress-bar");

	// Play and pause video
	playPauseBtn.addEventListener("click", () => {
		if (video.paused) {
			video.play();
			playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
		} else {
			video.pause();
			playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
		}
	});

	// Mute/unmute video
	muteBtn.addEventListener("click", () => {
		video.muted = !video.muted;
		muteBtn.innerHTML = video.muted
			? '<i class="fa fa-volume-off"></i>'
			: '<i class="fa fa-volume-up"></i>';
	});

	// Adjust video volume
	volumeSlider.addEventListener("input", () => {
		video.volume = volumeSlider.value;
		if (video.volume == 0) {
			video.muted = true;
			muteBtn.innerHTML = '<i class="fa fa-volume-off"></i>';
		} else {
			video.muted = false;
			muteBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
		}
	});

	// Update progress bar as video plays
	video.addEventListener("timeupdate", () => {
		let percent = (video.currentTime / video.duration) * 100;
		progressBar.style.width = percent + "%";
	});

	// Allow clicking on progress container to seek
	progressContainer.addEventListener("click", (e) => {
		const rect = progressContainer.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const newTime = (clickX / rect.width) * video.duration;
		video.currentTime = newTime;
	});

	// --- New: Khi click vào video thì sẽ không dừng mà vẫn phát ---
	video.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		video.play();
	});

	// --- New: Tự động phát video khi lướt tới (sử dụng debounce)
	const checkVideoVisibility = () => {
		const rect = video.getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0 && video.paused) {
			video.play();
		}
	};
	window.addEventListener("scroll", debounce(checkVideoVisibility, 100));
};

// New: Hàm debounce để giảm số lần gọi hàm liên tục
const debounce = (func, wait) => {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
};

// Optimized easing function with arrow syntax
const easeInOutExpo = (t, b, c, d) =>
	t < d / 2
		? (c / 2) * Math.pow(2, 10 * (t / d - 1)) + b
		: (c / 2) * (-Math.pow(2, -10 * (t / d - 1)) + 2) + b;

(function ($) {
	/*------------------
		Background Set
	--------------------*/
	$(".set-bg").each(function () {
		const bg = $(this).data("setbg");
		$(this).css("background-image", `url(${bg})`);
	});

	/*------------------
		Navigation
	--------------------*/
	$(".nav-switch").on("click", function (e) {
		e.preventDefault();
		$(".slicknav_btn").click();
	});

	$(".nav__menu").slicknav({
		appendTo: ".main__menu",
		openedSymbol: '<i class="fa fa-angle-up"></i>',
		closedSymbol: '<i class="fa fa-angle-right"></i>',
	});

	$(document).on("click", function (e) {
		if ($(e.target).closest(".slicknav_menu, .nav-switch").length === 0) {
			$(".nav__menu").slicknav("close");
		}
	});

	/*---------------
		Search
	----------------*/
	$(".search-switch").on("click", function (e) {
		e.preventDefault();
		$(".search-model").fadeIn(400);
		setTimeout(function () {
			$("#search-input").focus();
		}, 500);
	});

	$(".search-close-switch").on("click", function () {
		$(".search-model").fadeOut(400, function () {
			$("#search-input").val("");
		});
	});

	/*-------------------
		Hero Slider
	-------------------*/
	$(".hero-slider").slick({
		dots: false,
		infinite: true, // Đã thay đổi: cho slider đi liên tục
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
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	});

	var hero_slider = $(".hero-slider");

	// Custom navigation buttons
	$(".hero-slider-nav .prev-slide").on("click", function () {
		hero_slider.slick("slickPrev");
	});

	$(".hero-slider-nav .next-slide").on("click", function () {
		hero_slider.slick("slickNext");
	});

	hero_slider.on("click", ".slick-slide", function (e) {
		e.preventDefault();
		var index = $(this).data("slick-index");
		if ($(".slick-slider").slick("slickCurrentSlide") !== index) {
			$(".slick-slider").slick("slickGoTo", index);
		}
	});

	$(".hero-text-slider").slick({
		dots: false,
		infinite: false,
		speed: 500,
		arrows: false,
		asNavFor: ".hero-slider",
		fade: true,
		cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
	});

	/*-------------------
		Blog Slider
	-------------------*/
	$(".blog__slider").slick({
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

	// Thêm hiệu ứng scroll to top
	const $win = $(window);
	var scrollTopBtn = $("#scrollTopBtn"),
		scrollingTimer;

	// Kiểm tra vị trí scroll khi tải trang
	checkScrollPosition();

	// Kiểm tra vị trí scroll khi cuộn trang
	$win.on("scroll", function () {
		// Hiển thị nút khi cuộn xuống
		checkScrollPosition();

		// Thêm class khi đang cuộn
		if (!scrollingTimer) {
			$("body").addClass("is-scrolling");
		}

		// Clear timeout trước đó
		clearTimeout(scrollingTimer);

		// Set timeout mới
		scrollingTimer = setTimeout(function () {
			$("body").removeClass("is-scrolling");
			scrollingTimer = null;
		}, 250);
	});

	// Hàm kiểm tra vị trí scroll
	function checkScrollPosition() {
		if ($(window).scrollTop() > 300) {
			scrollTopBtn.addClass("show");
		} else {
			scrollTopBtn.removeClass("show");
		}
	}

	// Xử lý khi click vào nút
	scrollTopBtn.on("click", function (e) {
		e.preventDefault();
		$("body").addClass("scrolling-to-top");

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});

		// Remove class after animation completes
		setTimeout(() => {
			$("body").removeClass("scrolling-to-top");
		}, 300);
	});
})(jQuery);
