document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra xem người dùng được chuyển hướng từ trang index không
    const urlParams = new URLSearchParams(window.location.search);
    const fromIndex = urlParams.get('from') === 'index';
    
    if (fromIndex) {
        // Hiển thị thông báo nhắc chọn size
        setTimeout(() => {
            alert('Vui lòng chọn size sản phẩm trước khi thêm vào giỏ hàng');
        }, 500);
    }

    // Lấy ID sản phẩm từ URL (using existing urlParams)
    const productId = urlParams.get('id');

    // Tìm sản phẩm từ danh sách sản phẩm
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
        window.location.href = 'index.html';
        return;
    }

    // Cập nhật breadcrumb
    document.querySelector('.product-name').textContent = product.name;

    // Cập nhật thông tin sản phẩm
    document.title = `${product.name} - TIDAL TREASURES`;
    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.sku-value').textContent = `SP${product.id.toString().padStart(5, '0')}`;
    document.querySelector('.category-value').textContent = getCategoryName(product.category);
    document.querySelector('.product-price').textContent = formatPrice(product.price);
    document.querySelector('.product-description').textContent = product.description;
    document.getElementById('main-product-image').src = product.image;
    document.getElementById('main-product-image').alt = product.name;

    // Xử lý chọn size
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Xử lý số lượng
    const quantityInput = document.querySelector('.quantity-input input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
        }
    });

    // Xử lý thêm vào giỏ hàng
    document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        const selectedSize = document.querySelector('.size-option.active');
        if (!selectedSize) {
            alert('Vui lòng chọn kích thước');
            return;
        }

        const quantity = parseInt(quantityInput.value);
        const cartItem = {
            ...product,
            size: selectedSize.dataset.size,
            quantity: quantity
        };

        // Lấy giỏ hàng hiện tại từ localStorage
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = cart.findIndex(item => 
            item.id === cartItem.id && item.size === cartItem.size
        );

        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã có, cập nhật số lượng
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Nếu sản phẩm chưa có, thêm mới
            cart.push(cartItem);
        }

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Cập nhật số lượng hiển thị trên icon giỏ hàng
        updateCartCount();

        // Hiển thị thông báo
        showNotification('Đã thêm sản phẩm vào giỏ hàng!');
    });

    // Xử lý mua ngay
    document.querySelector('.buy-now-btn').addEventListener('click', () => {
        const selectedSize = document.querySelector('.size-option.active');
        if (!selectedSize) {
            alert('Vui lòng chọn kích thước');
            return;
        }

        const quantity = parseInt(quantityInput.value);
        const cartItem = {
            ...product,
            size: selectedSize.dataset.size,
            quantity: quantity
        };

        // Lưu vào giỏ hàng và chuyển đến trang thanh toán
        localStorage.setItem('cart', JSON.stringify([cartItem]));
        window.location.href = 'checkout.html';
    });
});

// Helper Functions
function getCategoryName(category) {
    const categories = {
        'nam': 'Thời trang nam',
        'nu': 'Thời trang nữ',
        'unisex': 'Unisex'
    };
    return categories[category] || category;
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Cập nhật cart preview nếu đang hiển thị
    const cartPreview = document.querySelector('.cart-preview');
    if (cartPreview && cartPreview.style.display === 'block') {
        updateCartPreview();
    }
}