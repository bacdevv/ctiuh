"use strict";
const $window = $(window),
	$document = $(document),
	$body = $("body"),
	debounce = (e, t) => {
		let o;
		return function (...s) {
			clearTimeout(o), (o = setTimeout(() => e.apply(this, s), t));
		};
	};
$window.on("load", () => {
	$(".loader").fadeOut(),
		$("#preloder")
			.delay(400)
			.fadeOut("slow", () => animateElements());
});
const animateElements = () => {
		$(".modern-header").addClass("loaded"),
			setTimeout(() => $(".hero__section").addClass("loaded"), 300),
			appearOnScroll();
	},
	appearOnScroll = () => {
		const e = $(".animate-on-scroll");
		$window
			.on(
				"scroll resize",
				debounce(() => {
					const t = $window.height(),
						o = $window.scrollTop(),
						s = o + t;
					e.each(function () {
						const e = $(this),
							t = e.offset().top;
						t + e.outerHeight() >= o && t <= s && e.addClass("animated");
					});
				}, 100)
			)
			.trigger("scroll");
	};
$(() => {
	initHeader(),
		initProgressBars(),
		initHoverEffects(),
		initLightbox(),
		initVideoControls(),
		initSliders();
});
const initHeader = () => {
		const e = $(".modern-header");
		$window
			.on("scroll", () => {
				const t = $window.scrollTop() > 0;
				e.toggleClass("scrolled", t);
				// Remove the transparent class when scrolled
				e.toggleClass("transparent", !t);
			})
			.trigger("scroll");
	},
	initProgressBars = () => {
		const e = $(".progress-bar-style");
		e.each(function () {
			const e = $(this).data("progress"),
				t = $(this).find(".bar-inner"),
				o = $(this).siblings("h6");
			o.find("span").length || o.append(`<span>${e}%</span>`),
				$(this).data("progressBarData", { progress: e, $bar: t });
		});
		const t = debounce(() => {
			const t = $window.scrollTop() + $window.height();
			e.each(function () {
				const e = $(this).data("progressBarData"),
					o = $(this).offset().top + $(this).outerHeight();
				t > o && e.$bar.css("width", e.progress + "%");
			});
		}, 50);
		$window.on("scroll", t), t();
	},
	initHoverEffects = () => {
		$(".nav__menu > li > a").hover(
			function () {
				$(this).parent().siblings().find("a").addClass("dimmed");
			},
			function () {
				$(this).parent().siblings().find("a").removeClass("dimmed");
			}
		),
			$(".gallery__item").hover(
				function () {
					$(this).siblings().addClass("dimmed-item");
				},
				function () {
					$(this).siblings().removeClass("dimmed-item");
				}
			);
	},
	initLightbox = () => {
		$.fn.fresco &&
			$(".fresco").fresco({
				thumbnails: !0,
				keyboard: !0,
				loop: !0,
				touchScroll: !0,
				clickContent: !1,
				thumbnailsPosition: "bottom",
			});
	},
	initVideoControls = () => {
		const e = document.getElementById("aboutVideo");
		if (!e) return;
		const t = document.querySelector(".play-pause-btn"),
			o = document.querySelector(".mute-btn"),
			s = document.querySelector(".volume-slider"),
			i = document.querySelector(".progress");
		if (!(t && o && s && i)) return;
		let n = !1,
			r = !1;
		t.addEventListener("click", () => {
			n ? (e.pause(), (t.textContent = "Play")) : (e.play(), (t.textContent = "Pause")),
				(n = !n);
		}),
			o.addEventListener("click", () => {
				r
					? ((e.muted = !1), (o.textContent = "Mute"))
					: ((e.muted = !0), (o.textContent = "Unmute")),
					(r = !r);
			}),
			s.addEventListener("input", () => {
				e.volume = s.value;
			}),
			e.addEventListener("timeupdate", () => {
				const t = (e.currentTime / e.duration) * 100;
				i.style.width = `${t}%`;
			});
	},
	initSliders = () => {
		const $heroSlider = $(".hero-slider");
		if ($heroSlider.length) {
			$heroSlider.slick({
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
			// Ensure slider adjusts when window resizes
			$window.on(
				"resize",
				debounce(() => {
					$heroSlider.slick("setPosition");
				}, 100)
			);
			$window.on("scroll", function () {
				if ($window.width() <= 991) {
					const e = $(".modern-header").outerHeight(),
						t = $(".hero__section").outerHeight(),
						o = $window.scrollTop() > t - e;
					$(".modern-header").toggleClass("scrolled", o);
				}
			});
			const t = () => {
				$(".hero-slider-nav").toggle($window.width() > 767);
			};
			t(),
				$window.on("resize", debounce(t, 100)),
				$(".hero-slider-nav .prev-slide").on("click", () => $heroSlider.slick("slickPrev")),
				$(".hero-slider-nav .next-slide").on("click", () => $heroSlider.slick("slickNext")),
				// Update click event: clicking on a slide navigates to that slide
				$heroSlider.off("click", ".slick-slide").on("click", ".slick-slide", function (t) {
					// Prevent default action only if we're handling the click ourselves
					const clickedSlide = $(this);
					const slideIndex = clickedSlide.data("slick-index");

					// If we have a valid slide index, go to that slide
					if (typeof slideIndex !== "undefined") {
						t.preventDefault();
						$heroSlider.slick("slickGoTo", slideIndex);
					}
				}),
				$(".hero-text-slider").slick({
					dots: !1,
					infinite: !1,
					speed: 500,
					arrows: !1,
					asNavFor: ".hero-slider",
					fade: !0,
					cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
				});
		}
		const t = $(".blog__slider");
		t.length &&
			t.slick({
				dots: !1,
				infinite: !0,
				speed: 300,
				arrows: !1,
				centerMode: !0,
				centerPadding: "190px",
				slidesToShow: 2,
				autoplay: !0,
				pauseOnHover: !1,
				responsive: [
					{
						breakpoint: 991,
						settings: { centerPadding: "0", slidesToShow: 2, slidesToScroll: 2 },
					},
					{
						breakpoint: 480,
						settings: {
							centerMode: !1,
							slidesToShow: 1,
							slidesToScroll: 1,
							centerPadding: "0",
						},
					},
				],
			});
	};
$(() => {
	const e = $("#scrollTopBtn");
	let t;
	const o = debounce(() => {
		e.toggleClass("show", $window.scrollTop() > 300);
	}, 50);
	o(),
		$window.on("scroll", () => {
			o(),
				$body.addClass("is-scrolling"),
				clearTimeout(t),
				(t = setTimeout(() => {
					$body.removeClass("is-scrolling");
				}, 250));
		}),
		e.on("click", (e) => {
			e.preventDefault(),
				$body.addClass("scrolling-to-top"),
				window.scrollTo({ top: 0, behavior: "smooth" }),
				setTimeout(() => {
					$body.removeClass("scrolling-to-top");
				}, 300);
		});
}),
	(function (e) {
		e(".set-bg").each(function () {
			const t = e(this).data("setbg");
			e(this).css("background-image", `url(${t})`);
		}),
			e(".nav-switch").on("click", function (t) {
				t.preventDefault();
				e(".slicknav_btn").trigger("click");
			}),
			e(".nav__menu").slicknav({
				appendTo: ".main__menu",
				openedSymbol: '<i class="fa fa-angle-up"></i>',
				closedSymbol: '<i class="fa fa-angle-right"></i>',
			}),
			$document.on("click", (t) => {
				0 === e(t.target).closest(".slicknav_menu, .nav-switch").length &&
					e(".nav__menu").slicknav("close");
			}),
			e(".search-switch").on("click", (t) => {
				t.preventDefault(),
					e(".search-model").fadeIn(400),
					setTimeout(() => e("#search-input").focus(), 500);
			}),
			e(".search-close-switch").on("click", () => {
				e(".search-model").fadeOut(400, () => e("#search-input").val(""));
			});
	})(jQuery);
