document.addEventListener('DOMContentLoaded', () => {
    // Initialize product slider
    initializeSearch();
    initializeCart();
    initializeUserAccount();
    updateCartCount();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Add parallax effect
    addParallaxEffect();

    // Xử lý sự kiện cho các nút trong gallery
    document.querySelectorAll('.gallery-item').forEach(item => {
        const productId = item.getAttribute('data-id');
        
        // Xử lý nút Chi tiết
        const detailBtn = item.querySelector('.detail-btn');
        if (detailBtn) {
            detailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = `product-detail.html?id=${productId}`;
            });
        }

        // Xử lý nút Mua ngay
        const buyNowBtn = item.querySelector('.buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleBuyNow(productId);
            });
        }
    });
});

// Hàm xử lý mua ngay
function handleBuyNow(productId) {
    // Kiểm tra đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('fashion_store_current_user'));
    if (!currentUser) {
        alert('Vui lòng đăng nhập để mua hàng');
        window.location.href = 'auth.html';
        return;
    }

    // Tìm sản phẩm
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        alert('Không tìm thấy sản phẩm');
        return;
    }

    // Tạo đơn hàng mới với 1 sản phẩm
    const cartItem = {
        ...product,
        quantity: 1
    };

    // Lưu vào giỏ hàng
    localStorage.setItem('cart', JSON.stringify([cartItem]));

    // Chuyển đến trang thanh toán
    window.location.href = 'checkout.html';
}

function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.trend-hero');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.backgroundPositionY = `${scrolled * speed}px`;
        });
    });
}