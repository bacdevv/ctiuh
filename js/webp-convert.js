/**
 * Script để kiểm tra và hiển thị hình ảnh WebP nếu trình duyệt hỗ trợ
 * Sử dụng JavaScript thuần để tối đa hiệu suất
 */

// Kiểm tra trình duyệt có hỗ trợ WebP không
function checkWebpSupport() {
	const webpTest = new Image();
	webpTest.onload = function () {
		const webpSupported = webpTest.width > 0 && webpTest.height > 0;
		localStorage.setItem("webpSupport", webpSupported ? "true" : "false");
		if (webpSupported) {
			convertImagesToWebp();
		}
	};
	webpTest.onerror = function () {
		localStorage.setItem("webpSupport", "false");
	};
	webpTest.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
}

// Chuyển đổi đường dẫn hình ảnh sang WebP nếu trình duyệt hỗ trợ
function convertImagesToWebp() {
	const images = document.querySelectorAll("img[data-webp]");
	images.forEach((img) => {
		const webpPath = img.getAttribute("data-webp");
		if (webpPath) {
			img.src = webpPath;
		}
	});
}

// Thực hiện kiểm tra và chuyển đổi
document.addEventListener("DOMContentLoaded", function () {
	const cachedWebpSupport = localStorage.getItem("webpSupport");

	if (cachedWebpSupport === "true") {
		// Đã biết trình duyệt hỗ trợ WebP
		convertImagesToWebp();
	} else if (cachedWebpSupport === null) {
		// Chưa kiểm tra, thực hiện kiểm tra
		checkWebpSupport();
	}

	// Nếu cachedWebpSupport === 'false', không cần làm gì cả
});
