/**
 * Mobile Optimization JavaScript
 * This file handles mobile-specific optimizations across all pages
 */

document.addEventListener("DOMContentLoaded", function () {
	// Check if we're on mobile
	const isMobile = window.innerWidth <= 768;

	// Load appropriate CSS
	if (isMobile) {
		// Add mobile-specific CSS
		const mobileCSS = document.createElement("link");
		mobileCSS.rel = "stylesheet";
		mobileCSS.href = "css/custom-mobile.css";
		document.head.appendChild(mobileCSS);

		// Set viewport to prevent zoom on form fields in iOS
		const metaViewport = document.querySelector('meta[name="viewport"]');
		if (metaViewport) {
			metaViewport.setAttribute(
				"content",
				"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
			);
		}

		// Load smaller images for mobile
		document.querySelectorAll("img[data-mobile-src]").forEach(function (img) {
			const mobileSrc = img.getAttribute("data-mobile-src");
			if (mobileSrc) {
				// Show loading placeholder while loading the smaller image
				img.style.opacity = "0.3";

				// Create a new image to preload
				const tempImg = new Image();
				tempImg.onload = function () {
					// Replace image source only after loaded
					img.src = mobileSrc;
					img.style.opacity = "1";
				};
				tempImg.src = mobileSrc;
			}
		});

		// Optimize sliders if they exist
		if (typeof $ !== "undefined" && $.fn.slick) {
			// Give time for the page to settle
			setTimeout(function () {
				// Hero slider optimization
				if ($(".hero-slider").length) {
					$(".hero-slider").slick(
						"slickSetOption",
						{
							centerMode: false,
							variableWidth: false,
							slidesToShow: 1,
							adaptiveHeight: true,
							fade: true,
							cssEase: "ease-out",
							speed: 300,
							lazyLoad: "ondemand",
						},
						true
					);
				}

				// Other sliders optimization
				$(".slick-slider").each(function () {
					if (!$(this).hasClass("hero-slider")) {
						$(this).slick(
							"slickSetOption",
							{
								centerMode: false,
								slidesToShow: 1,
								slidesToScroll: 1,
								adaptiveHeight: true,
							},
							true
						);
					}
				});
			}, 500);
		}

		// Minimize FOUC (Flash of Unstyled Content)
		document.body.style.opacity = "0";
		setTimeout(function () {
			document.body.style.opacity = "1";
			document.body.style.transition = "opacity 0.3s ease";
		}, 300);

		// Optimize non-critical resources
		// Defer loading of non-critical scripts
		const nonCriticalScripts = [
			"https://cdnjs.cloudflare.com/ajax/libs/fresco/1.3.0/js/fresco.min.js",
		];

		nonCriticalScripts.forEach(function (scriptSrc) {
			// Check if script is already loaded
			const scriptExists = Array.from(document.scripts).some(
				(script) => script.src === scriptSrc
			);
			if (!scriptExists) {
				const script = document.createElement("script");
				script.src = scriptSrc;
				script.defer = true;
				document.body.appendChild(script);
			}
		});

		// Add click delay fix for mobile
		document.addEventListener("touchstart", function () {}, { passive: true });

		// Add mobile-specific event listeners
		window.addEventListener("orientationchange", function () {
			// Handle orientation change
			setTimeout(function () {
				if (typeof $ !== "undefined" && $.fn.slick) {
					$(".slick-slider").slick("setPosition");
				}
			}, 200);
		});

		// Optimize long text
		document.querySelectorAll("p:not(.short-text)").forEach(function (p) {
			if (p.textContent.length > 150) {
				p.classList.add("mobile-optimize-text");
			}
		});
	}

	// Handle window resize for responsive behavior
	window.addEventListener(
		"resize",
		throttle(function () {
			const wasDesktop = !isMobile;
			const nowMobile = window.innerWidth <= 768;

			// Only react if we've crossed the threshold
			if ((wasDesktop && nowMobile) || (!wasDesktop && !nowMobile)) {
				// Reload the page for simplicity
				// For production a more sophisticated approach would be better
				// location.reload();

				// Instead of reloading, adjust critical elements
				document.querySelectorAll(".desktop-only").forEach(function (el) {
					el.style.display = nowMobile ? "none" : "";
				});

				// Recalculate sliders
				if (typeof $ !== "undefined" && $.fn.slick) {
					$(".slick-slider").slick("setPosition");
				}
			}
		}, 500)
	);

	// Add to main page class to indicate mobile or desktop
	document.body.classList.add(isMobile ? "mobile-view" : "desktop-view");
});

// Throttle function
function throttle(func, delay) {
	let lastCall = 0;
	return function (...args) {
		const now = new Date().getTime();
		if (now - lastCall < delay) {
			return;
		}
		lastCall = now;
		return func(...args);
	};
}

// Add function to load mobile CSS conditionally
function loadMobileCSS() {
	if (window.innerWidth <= 768 && !document.querySelector('link[href="css/custom-mobile.css"]')) {
		const mobileCSS = document.createElement("link");
		mobileCSS.rel = "stylesheet";
		mobileCSS.href = "css/custom-mobile.css";
		document.head.appendChild(mobileCSS);
	}
}

// Call this function when the DOM is ready
document.addEventListener("DOMContentLoaded", loadMobileCSS);
