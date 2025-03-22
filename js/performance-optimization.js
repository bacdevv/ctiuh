/**
 * File tối ưu hiệu suất cho Căn tin IUH
 * Bao gồm lazy loading, tối ưu animation và tối ưu tài nguyên
 */

// Lazy Loading cho hình ảnh
document.addEventListener("DOMContentLoaded", function () {
	// Lazy loading cho các hình ảnh không nằm trong slider
	const lazyImages = document.querySelectorAll("img:not(.slide-item img):not(.hero-slider img)");

	if ("IntersectionObserver" in window) {
		const imageObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target;
						const src = img.getAttribute("data-src");

						if (src) {
							img.src = src;
							img.removeAttribute("data-src");
							img.classList.add("img-loaded");
						}

						imageObserver.unobserve(img);
					}
				});
			},
			{
				rootMargin: "0px 0px 200px 0px", // Preload hình ảnh trước khi scroll đến
			}
		);

		lazyImages.forEach((img) => {
			if (img.src) {
				img.setAttribute("data-src", img.src);
				img.src =
					'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
				imageObserver.observe(img);
			}
		});
	}

	// Tối ưu animation - Sử dụng requestAnimationFrame
	const animatedElements = document.querySelectorAll(".animate-on-scroll");

	if ("IntersectionObserver" in window) {
		const animationObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						requestAnimationFrame(() => {
							entry.target.classList.add("animated");
						});
						animationObserver.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.1,
			}
		);

		animatedElements.forEach((el) => {
			animationObserver.observe(el);
		});
	}
	// Giảm thiểu repaints và reflows
	function optimizeScrollEvents() {
		let ticking = false;
		window.addEventListener(
			"scroll",
			function () {
				if (!ticking) {
					window.requestAnimationFrame(function () {
						// Đặt code xử lý scroll ở đây
						if (window.scrollY > 100) {
							document.querySelector(".header").classList.add("sticky");
						} else {
							document.querySelector(".header").classList.remove("sticky");
						}
						ticking = false;
					});
					ticking = true;
				}
			},
			{ passive: true }
		);
	}

	optimizeScrollEvents();

	// Tối ưu cho gallery isotope trong gallery.html
	if (document.querySelector(".gallery-items")) {
		const debouncedLayout = debounce(function () {
			if (window.$grid && window.$grid.isotope) {
				window.$grid.isotope("layout");
			}
		}, 250);

		window.addEventListener("resize", debouncedLayout);
	}

	// Mobile slider optimization
	const isMobile = window.innerWidth <= 768;

	if (isMobile) {
		// Use smaller images on mobile
		const slideItems = document.querySelectorAll(".slide-item");
		slideItems.forEach((slide) => {
			const img = slide.querySelector("img");
			const mobileSrc = slide.getAttribute("data-mobile-src");

			if (mobileSrc && img) {
				// Create a new image to preload
				const tempImg = new Image();
				tempImg.onload = function () {
					// Replace image source only after loaded
					img.src = mobileSrc;
				};
				tempImg.src = mobileSrc;
			}
		});

		// Simplify slider initialization on mobile
		if (typeof $ !== "undefined" && $.fn.slick) {
			// Modify slick slider settings for mobile
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
	}

	// Handle window resize
	window.addEventListener(
		"resize",
		throttle(function () {
			const wasMobile = isMobile;
			const nowMobile = window.innerWidth <= 768;

			// Only take action if mobile state changed
			if (wasMobile !== nowMobile) {
				// Reload page for simplicity
				// For production use a more elegant solution
				location.reload();
			}
		}, 500)
	);
});

// Debounce function để giảm thiểu việc gọi hàm quá nhiều lần
function debounce(func, wait) {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}

// Kỹ thuật throttle để hạn chế tần suất gọi hàm
function throttle(func, limit) {
	let lastFunc;
	let lastRan;
	return function () {
		const context = this;
		const args = arguments;
		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(function () {
				if (Date.now() - lastRan >= limit) {
					func.apply(context, args);
					lastRan = Date.now();
				}
			}, limit - (Date.now() - lastRan));
		}
	};
}
