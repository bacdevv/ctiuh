/**
 * Mobile Slider Fix
 * Fixes issues with slideshow navigation on mobile devices
 */

(function ($) {
	// Run when document is ready
	$(document).ready(function () {
		// Check if we're on mobile
		const isMobile = window.innerWidth <= 768;

		if (isMobile) {
			// Add fullscreen class to body for additional styling options
			$("body").addClass("mobile-fullscreen-slider");

			// Fix mobile slides
			setTimeout(function () {
				// Get the slider element
				const $heroSlider = $(".hero-slider");

				if ($heroSlider.length && $.fn.slick) {
					// Make all slides visible on mobile (not hidden)
					$(".slide-item").removeClass("desktop-only").removeClass("mobile-hidden");

					// Set slide items to fill viewport
					$(".slide-item, .slide-item img").css({
						height: "100vh",
						width: "100vw",
						"object-fit": "cover",
					});

					// Reinitialize slick with mobile-optimized settings for fullscreen
					if ($heroSlider.hasClass("slick-initialized")) {
						$heroSlider.slick("unslick");
					}

					$heroSlider.slick({
						dots: false,
						infinite: true,
						speed: 500,
						slidesToShow: 1,
						slidesToScroll: 1,
						adaptiveHeight: false, // Changed to false for fullscreen
						fade: true,
						cssEase: "ease-out",
						arrows: false,
						asNavFor: ".hero-text-slider",
						autoplay: true,
						pauseOnHover: false,
						autoplaySpeed: 5000,
						lazyLoad: "ondemand",
						centerMode: false,
						variableWidth: false,
						draggable: true,
						swipe: true,
						touchMove: true,
						accessibility: true,
					});

					// Add a simple indicator for the active slide
					// Create indicators container if it doesn't exist
					if ($(".slider-indicators").length === 0) {
						const $indicatorsContainer = $('<div class="slider-indicators"></div>');
						const slideCount = $heroSlider.slick("getSlick").slideCount;

						// Create indicator dots
						for (let i = 0; i < slideCount; i++) {
							$indicatorsContainer.append(
								`<span class="dot ${i === 0 ? "active" : ""}"></span>`
							);
						}

						// Append indicators after the slider
						$heroSlider.after($indicatorsContainer);

						// Update indicators when slide changes
						$heroSlider.on("afterChange", function (event, slick, currentSlide) {
							$(".slider-indicators .dot").removeClass("active");
							$(".slider-indicators .dot").eq(currentSlide).addClass("active");
						});
					}

					// Force show slide descriptions
					$(".slide-desc").css("display", "block");

					// Fix navigation buttons to work correctly
					$(".hero-slider-nav .prev-slide")
						.off("click")
						.on("click", function (e) {
							e.preventDefault();
							e.stopPropagation();
							$heroSlider.slick("slickPrev");
						});

					$(".hero-slider-nav .next-slide")
						.off("click")
						.on("click", function (e) {
							e.preventDefault();
							e.stopPropagation();
							$heroSlider.slick("slickNext");
						});

					// Make sure empty/blank slides don't appear
					$heroSlider.on(
						"beforeChange",
						function (event, slick, currentSlide, nextSlide) {
							// Force reload images if they didn't load properly
							const $nextSlideElement = $(slick.$slides[nextSlide]);
							const $img = $nextSlideElement.find("img");

							if ($img.length && !$img[0].complete) {
								const mobileSrc = $nextSlideElement.attr("data-mobile-src");
								if (mobileSrc) {
									$img.attr("src", mobileSrc);
								}
							}

							// Force opacity on slide description
							setTimeout(function () {
								$(".slide-desc").css("opacity", "1");
							}, 100);
						}
					);

					// Set slider to position after initialization
					$heroSlider.slick("setPosition");

					// Initial force show of slide descriptions
					setTimeout(function () {
						$(".slide-desc").css({
							opacity: "1",
							transform: "translate(-50%, 0)",
							display: "block",
						});
					}, 300);
				}
			}, 500);
		}
	});

	// Handle orientation change specifically
	$(window).on("orientationchange", function () {
		setTimeout(function () {
			if ($(".hero-slider").length && $(".hero-slider").hasClass("slick-initialized")) {
				$(".hero-slider").slick("setPosition");

				// Reapply fullscreen dimensions
				$(".slide-item, .slide-item img").css({
					height: "100vh",
					width: "100vw",
					"object-fit": "cover",
				});
			}
		}, 200);
	});

	// Handle window resize events
	$(window).on("resize", function () {
		const isMobile = window.innerWidth <= 768;

		if (isMobile) {
			// Ensure proper slider position on resize
			setTimeout(function () {
				if ($(".hero-slider").length && $(".hero-slider").hasClass("slick-initialized")) {
					$(".hero-slider").slick("setPosition");

					// Reapply fullscreen dimensions
					$(".slide-item, .slide-item img").css({
						height: "100vh",
						width: "100vw",
						"object-fit": "cover",
					});
				}
			}, 200);
		}
	});

	// Fix for when clicking navigation buttons multiple times
	$(document).on("click", ".hero-slider-nav button", function () {
		// Force refresh the slider after navigation
		setTimeout(function () {
			if ($(".hero-slider").length && $(".hero-slider").hasClass("slick-initialized")) {
				$(".hero-slider").slick("setPosition");
			}
		}, 50);
	});
})(jQuery);
