document.addEventListener('DOMContentLoaded', () => {
    // Load user data
    const currentUser = JSON.parse(localStorage.getItem('fashion_store_current_user'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    // Function to format price
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Update user info
    document.querySelector('.user-name').textContent = currentUser.fullName;
    
    // Fill profile form
    const profileForm = document.getElementById('profile-form');
    profileForm.fullName.value = currentUser.fullName;
    profileForm.email.value = currentUser.email;
    profileForm.phone.value = currentUser.phone || '';
    profileForm.birthday.value = currentUser.birthday || '';

    // Add sections for orders, address, and wishlist
    const accountContent = document.querySelector('.account-content');
    accountContent.innerHTML = `
        <!-- Profile Section -->
        <section id="profile" class="account-section">
            <h2>Thông tin cá nhân</h2>
            <form id="profile-form" class="account-form">
                <div class="form-group">
                    <label>Họ và tên</label>
                    <input type="text" name="fullName" value="${currentUser.fullName}" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="${currentUser.email}" required disabled>
                </div>
                <div class="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" name="phone" value="${currentUser.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Ngày sinh</label>
                    <input type="date" name="birthday" value="${currentUser.birthday || ''}">
                </div>
                <button type="submit" class="cta-button">Cập nhật thông tin</button>
            </form>
        </section>

        <!-- Orders Section -->
        <section id="orders" class="account-section">
            <h2>Đơn hàng của tôi</h2>
            <div class="orders-list">
                ${getOrdersHTML()}
            </div>
        </section>

        <!-- Address Section -->
        <section id="address" class="account-section">
            <h2>Sổ địa chỉ</h2>
            <div class="address-list">
                ${getAddressesHTML()}
            </div>
            <button onclick="addNewAddress()" class="cta-button">Thêm địa chỉ mới</button>
        </section>

        <!-- Wishlist Section -->
        <section id="wishlist" class="account-section">
            <h2>Sản phẩm yêu thích</h2>
            <div class="wishlist-grid">
                ${getWishlistHTML()}
            </div>
        </section>

        <!-- Password Section -->
        <section id="password" class="account-section">
            <h2>Đổi mật khẩu</h2>
            <form id="password-form" class="account-form">
                <div class="form-group">
                    <label>Mật khẩu hiện tại</label>
                    <input type="password" name="currentPassword" required>
                </div>
                <div class="form-group">
                    <label>Mật khẩu mới</label>
                    <input type="password" name="newPassword" required>
                </div>
                <div class="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input type="password" name="confirmPassword" required>
                </div>
                <button type="submit" class="cta-button">Cập nhật mật khẩu</button>
            </form>
        </section>
    `;

    // Helper function to get orders HTML
    function getOrdersHTML() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const userOrders = orders.filter(order => order.customer.email === currentUser.email);

        if (userOrders.length === 0) {
            return '<p class="empty-message">Bạn chưa có đơn hàng nào</p>';
        }

        return userOrders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-id">Đơn hàng #${order.orderId}</div>
                    <div class="order-date">${new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                    <div class="order-status ${getStatusClass(order.status)}">
                        ${getStatusText(order.status)}
                    </div>
                </div>
                <div class="order-products">
                    ${order.items.map(item => `
                        <div class="order-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="product-info">
                                <h4>${item.name}</h4>
                                <p>Số lượng: ${item.quantity}</p>
                                <p>Giá: ${formatPrice(item.price)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-details">
                    <div class="shipping-info">
                        <h4>Thông tin giao hàng</h4>
                        <p><strong>Người nhận:</strong> ${order.customer.fullName}</p>
                        <p><strong>Số điện thoại:</strong> ${order.customer.phone}</p>
                        <p><strong>Địa chỉ:</strong> ${order.customer.address}</p>
                    </div>
                    <div class="payment-info">
                        <h4>Thông tin thanh toán</h4>
                        <p><strong>Phương thức:</strong> ${getPaymentMethod(order.paymentMethod)}</p>
                        <p><strong>Tạm tính:</strong> ${formatPrice(order.total - 30000)}</p>
                        <p><strong>Phí vận chuyển:</strong> ${formatPrice(30000)}</p>
                        <p class="order-total"><strong>Tổng cộng:</strong> ${formatPrice(order.total)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Handle menu navigation
    document.querySelectorAll('.account-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active states
            document.querySelectorAll('.account-section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelectorAll('.account-menu li').forEach(item => {
                item.classList.remove('active');
            });
            
            document.getElementById(targetId).classList.add('active');
            link.parentElement.classList.add('active');
        });
    });

    // Check for URL hash on load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetLink = document.querySelector(`a[href="#${targetId}"]`);
        if (targetLink) {
            targetLink.click();
        }
    } else {
        // Show profile section by default
        document.getElementById('profile').classList.add('active');
        document.querySelector('a[href="#profile"]').parentElement.classList.add('active');
    }
});

// Helper functions
function getStatusClass(status) {
    const statusClasses = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipping': 'status-shipping',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
}

function getStatusText(status) {
    const statusTexts = {
        'pending': 'Chờ xác nhận',
        'processing': 'Đang xử lý',
        'shipping': 'Đang giao hàng',
        'completed': 'Đã giao hàng',
        'cancelled': 'Đã hủy'
    };
    return statusTexts[status] || 'Chờ xác nhận';
}

function getPaymentMethod(method) {
    const methods = {
        'cod': 'Thanh toán khi nhận hàng',
        'bank': 'Chuyển khoản ngân hàng'
    };
    return methods[method] || method;
}

function getAddressesHTML() {
    return '<p class="empty-message">Chưa có địa chỉ nào</p>';
}

function getWishlistHTML() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.length === 0) {
        return '<p class="empty-message">Chưa có sản phẩm yêu thích</p>';
    }

    return `
        <div class="wishlist-grid">
            ${wishlist.map(productId => {
                const product = products.find(p => p.id === productId);
                if (!product) return '';
                
                return `
                    <div class="wishlist-item">
                        <button class="remove-wishlist" onclick="removeFromWishlist(${product.id})">
                            <i class="fas fa-times"></i>
                        </button>
                        <img src="${product.image}" alt="${product.name}">
                        <div class="wishlist-item-info">
                            <h4>${product.name}</h4>
                            <p class="price">${formatPrice(product.price)}</p>
                            <button onclick="window.location.href='product-detail.html?id=${product.id}'" 
                                    class="view-product">
                                Xem sản phẩm
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Cập nhật lại giao diện
    document.querySelector('#wishlist').innerHTML = `
        <h2>Sản phẩm yêu thích</h2>
        ${getWishlistHTML()}
    `;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}