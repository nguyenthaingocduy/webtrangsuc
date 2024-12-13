document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    // Load user data
    const currentUser = JSON.parse(localStorage.getItem('fashion_store_current_user'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    // Fill user data
    document.querySelector('[name="fullName"]').value = currentUser.fullName || '';
    document.querySelector('[name="phone"]').value = currentUser.phone || '';
    document.querySelector('[name="email"]').value = currentUser.email || '';

    // Function to format price
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    // Render cart items
    const cartItemsContainer = document.querySelector('.cart-items');
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='img/default-product.jpg'">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-meta">
                        <span class="item-size">Size: ${item.size}</span>
                        <span class="item-price">${formatPrice(item.price)}</span>
                    </div>
                    <div class="item-quantity">
                        <span>Số lượng: ${item.quantity}</span>
                    </div>
                </div>
                <div class="item-total">
                    ${formatPrice(item.price * item.quantity)}
                </div>
            </div>
        `;
    });

    // Update totals
    const shippingFee = subtotal >= 500000 ? 0 : 30000; // Miễn phí ship cho đơn hàng từ 500k
    document.querySelector('.subtotal .amount').textContent = formatPrice(subtotal);
    document.querySelector('.shipping .amount').textContent = formatPrice(shippingFee);
    document.querySelector('.total .amount').textContent = formatPrice(subtotal + shippingFee);

    // Handle checkout
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate form
        const formData = new FormData(e.target);
        if (!formData.get('fullName') || !formData.get('phone') || !formData.get('address')) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng');
            return;
        }

        try {
            const orderData = {
                orderId: `ORD${Date.now()}`,
                items: cart,
                customer: {
                    fullName: formData.get('fullName'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    address: formData.get('address'),
                    note: formData.get('note')
                },
                paymentMethod: formData.get('payment'),
                subtotal: subtotal,
                shippingFee: shippingFee,
                total: subtotal + shippingFee,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Save order to localStorage
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear cart
            localStorage.removeItem('cart');

            // Show success message
            alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
            
            // Redirect to orders page
            window.location.href = 'account.html#orders';
        } catch (error) {
            alert('Có lỗi xảy ra khi đặt hàng: ' + error.message);
        }
    });

    // Add event listener for payment method change
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            const bankInfo = document.querySelector('.bank-info');
            if (e.target.value === 'bank') {
                if (!bankInfo) {
                    const paymentSection = document.querySelector('.payment-methods');
                    paymentSection.insertAdjacentHTML('afterend', `
                        <div class="bank-info">
                            <h4>Thông tin chuyển khoản</h4>
                            <p><strong>Ngân hàng:</strong> VietComBank</p>
                            <p><strong>Số tài khoản:</strong> 1234567890</p>
                            <p><strong>Chủ tài khoản:</strong> FASHION STORE</p>
                            <p><strong>Nội dung:</strong> [Mã đơn hàng] - [Họ tên người mua]</p>
                        </div>
                    `);
                } else {
                    bankInfo.style.display = 'block';
                }
            } else if (bankInfo) {
                bankInfo.style.display = 'none';
            }
        });
    });
}); 