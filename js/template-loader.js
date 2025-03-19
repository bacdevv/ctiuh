/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
	const element = document.querySelector(selector);
	if (!element) return;

	const cached = localStorage.getItem(path);
	if (cached) {
		element.innerHTML = cached;
	}

	fetch(path)
		.then((res) => res.text())
		.then((html) => {
			if (html !== cached) {
				element.innerHTML = html;
				localStorage.setItem(path, html);
			}
		})
		.catch((err) => console.error(`Error loading template ${path}:`, err))
		.finally(() => {
			window.dispatchEvent(new Event("template-loaded"));
		});
}

// Initialize templates after the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
	load("#header-container", "components/header.html");
	load("#footer-container", "components/footer.html");

	// Add scroll-to-top button if not included in footer
	if (!document.querySelector(".scroll-top-btn")) {
		const scrollBtn = document.createElement("button");
		scrollBtn.className = "scroll-top-btn";
		scrollBtn.id = "scrollTopBtn";
		scrollBtn.innerHTML = `<div class="scroll-top-inner">
			<i class="fa-solid fa-angle-up"></i>
			<span class="ripple-circle"></span>
			<span class="ripple-circle"></span>
		</div>`;
		document.body.appendChild(scrollBtn);
	}

	// Event listener to handle post-template loading actions
	window.addEventListener("template-loaded", function () {
		// Initialize active menu state
		const currentPage = window.location.pathname.split("/").pop() || "index.html";
		const menuLinks = document.querySelectorAll(".nav__menu a");

		menuLinks.forEach((link) => {
			if (link.getAttribute("href") === `./${currentPage}`) {
				link.classList.add("menu--active");
			}
		});
	});
});
