// Sample product data
const products = [
    {
        id: 1,
        name: "Nến Thơm vỏ sò hai tầng",
        price: 120000,
        image: "img/doublevoso.jpg",
        description: "Nến thơm vỏ sò hai tầng với chất liệu làm 100% từ thiên nhiên, cực kì thân thiện phù hợp với mọi lứa tuổi",
        
        category: "nam & nu"
    },
    {
        id: 2,
        name: "Vòng tay vỏ sò",
        price: 25000,
        image: "img/lactay.jpg",
        description: "Vòng tay vỏ sò, được thiết kế cực kì tinh xão, làm toát lên vẻ thanh táo và sự nhẹ nhàng cho người sử dụng nó",
          category: "nam & nu"
    },
    {
        id: 3,
        name: "Nến thơm vỏ sò một tầng",
        price: 399000,
        image: "img/ngoctrai2.jpg",
        description: "Nến thơm vỏ sò một tầng thiết kế thanh lịch, phù hợp cho việc thư giãn và trang trí phòng ốc",
        category: "nam & nu"
    },
    // {
    //     id: 4,
    //     name: "Áo thun unisex",
    //     price: 199000,
    //     image: "img/product-4.jpg",
    //     description: "Áo thun unisex form rộng thời trang, nhiều màu sắc trẻ trung",
    //     category: "unisex"
    // },
    // {
    //     id: 5,
    //     name: "Áo khoác denim",
    //     price: 599000,
    //     image: "img/product-5.jpg",
    //     description: "Áo khoác denim phong cách cá tính, dễ phối đồ",
    //     category: "unisex"
    // },
    // {
    //     id: 6,
    //     name: "Chân váy xếp ly",
    //     price: 299000,
    //     image: "img/product-6.jpg",
    //     description: "Chân váy xếp ly nữ thanh lịch, kiểu dáng Hàn Quốc",
    //     category: "nu"
    // },
];

// Cart functionality
let cart = [];

// Function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Function to render products
function renderProducts(filteredProducts = products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    
    // Lấy danh sách sản phẩm yêu thích từ localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    filteredProducts.forEach(product => {
        const isWishlisted = wishlist.includes(product.id);
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id}, event)">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="product-overlay">
                    <button onclick="addToCart(${product.id}, event)" class="add-to-cart-btn">
                        <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${formatPrice(product.price)}</p>
            </div>
        `;
        
        // Thêm sự kiện click để chuyển đến trang chi tiết
        productCard.addEventListener('click', () => {
            window.location.href = `product-detail.html?id=${product.id}`;
        });
        
        productGrid.appendChild(productCard);
    });
}

// Function to add product to cart
function addToCart(productId, event) {
    // Ngăn chặn sự kiện click lan truyền lên phần tử cha
    if (event) {
        event.stopPropagation();
    }

    // Chuyển hướng đến trang chi tiết sản phẩm
    window.location.href = `product-detail.html?id=${productId}`;
}

// Function to show cart notification
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Đã thêm sản phẩm vào giỏ hàng!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => {
            return total + (item && item.quantity ? item.quantity : 0);
        }, 0);
        cartCount.textContent = totalItems;
    }
}

// Function to save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Search functionality
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filteredProducts);
}

// Filter products by category
function filterByCategory(category) {
    if (category === 'all') {
        renderProducts();
    } else {
        const filteredProducts = products.filter(product => 
            product.category === category
        );
        renderProducts(filteredProducts);
    }
}

// Thêm biến để quản lý trạng thái đăng nhập
let isLoggedIn = false;
let currentUser = null;

// Thêm hàm xử lý tìm kiếm và hiển thị kết quả
function initializeSearch() {
    const searchIcon = document.querySelector('.search-icon');
    const navbar = document.querySelector('.navbar');
    
    // Tạo search box và search results
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <input type="text" placeholder="Tìm kiếm sản phẩm...">
            <i class="fas fa-times"></i>
        </div>
        <div class="search-results"></div>
    `;
    searchContainer.style.display = 'none';
    navbar.appendChild(searchContainer);

    const searchBox = searchContainer.querySelector('.search-box');
    const searchInput = searchBox.querySelector('input');
    const searchResults = searchContainer.querySelector('.search-results');

    // Xử lý click vào icon search
    searchIcon.addEventListener('click', () => {
        searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
        if (searchContainer.style.display === 'block') {
            searchInput.focus();
        }
    });

    // Xử lý đóng search box
    searchBox.querySelector('.fa-times').addEventListener('click', () => {
        searchContainer.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    // Xử lý tìm kiếm khi nhập
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length > 0) {
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
            displaySearchResults(filteredProducts, query);
        } else {
            searchResults.innerHTML = '';
        }
    });

    // Đóng kết quả tìm kiếm khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target) && !searchIcon.contains(e.target)) {
            searchContainer.style.display = 'none';
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });
}

// Thêm hàm hiển thị kết quả tìm kiếm
function displaySearchResults(results, query) {
    const searchResults = document.querySelector('.search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <p>Không tìm thấy sản phẩm nào phù hợp với "${query}"</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="goToProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}">
            <div class="search-result-info">
                <h4>${highlightText(product.name, query)}</h4>
                <p class="search-result-description">${highlightText(product.description, query)}</p>
                <p class="search-result-price">${formatPrice(product.price)}</p>
            </div>
        </div>
    `).join('');
}

// Hàm highlight từ khóa tìm kiếm
function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Hàm chuyển đến trang sản phẩm (có thể thêm sau)
function goToProduct(productId) {
    // Tạm thời scroll đến phần sản phẩm và highlight sản phẩm được chọn
    const productSection = document.querySelector('#products');
    productSection.scrollIntoView({ behavior: 'smooth' });
    
    // Lọc và hiển thị sản phẩm được chọn
    renderProducts([products.find(p => p.id === productId)]);
}

// Cập nhật hàm xử lý giỏ hàng
function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    
    // Tạo cart preview
    const cartPreview = document.createElement('div');
    cartPreview.className = 'cart-preview';
    cartPreview.innerHTML = `
        <div class="cart-preview-header">
            <h3>Giỏ hàng</h3>
        </div>
        <div class="cart-preview-items"></div>
        <div class="cart-preview-footer">
            <div class="cart-total"></div>
            <button onclick="goToCheckout()" class="cta-button checkout-btn">Thanh toán</button>
        </div>
    `;
    document.body.appendChild(cartPreview);

    let timeout;

    // Xử lý hover vào cart icon
    cartIcon.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        updateCartPreview();
        cartPreview.style.display = 'block';
        
        // Cập nhật vị trí của cart preview
        const iconRect = cartIcon.getBoundingClientRect();
        cartPreview.style.right = `${window.innerWidth - iconRect.right - 10}px`;
    });

    // Xử lý hover vào cart preview
    cartPreview.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
    });

    // Xử lý mouse leave
    const hideCartPreview = () => {
        timeout = setTimeout(() => {
            cartPreview.style.display = 'none';
        }, 300);
    };

    cartIcon.addEventListener('mouseleave', hideCartPreview);
    cartPreview.addEventListener('mouseleave', hideCartPreview);

    // Cập nhật vị trí cart preview khi scroll
    window.addEventListener('scroll', () => {
        if (cartPreview.style.display === 'block') {
            const iconRect = cartIcon.getBoundingClientRect();
            cartPreview.style.right = `${window.innerWidth - iconRect.right - 10}px`;
        }
    });

    // Cập nhật vị trí cart preview khi resize window
    window.addEventListener('resize', () => {
        if (cartPreview.style.display === 'block') {
            const iconRect = cartIcon.getBoundingClientRect();
            cartPreview.style.right = `${window.innerWidth - iconRect.right - 10}px`;
        }
    });
}

// Hàm cập nhật preview giỏ hàng
function updateCartPreview() {
    const cartPreview = document.querySelector('.cart-preview');
    const itemsContainer = cartPreview.querySelector('.cart-preview-items');
    const totalElement = cartPreview.querySelector('.cart-total');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    itemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-cart">Giỏ hàng trống</p>';
        totalElement.innerHTML = '';
        cartPreview.querySelector('.checkout-btn').style.display = 'none';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        // Kiểm tra tính hợp lệ của dữ liệu
        if (!item || !item.name || !item.price || !item.quantity || !item.image) {
            return; // Bỏ qua item không hợp lệ
        }

        total += item.price * item.quantity;
        itemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='img/default-product.jpg'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-details">
                        <span class="cart-item-size">Size: ${item.size}</span>
                        <span class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</span>
                    </p>
                </div>
                <button onclick="removeFromCart(${item.id}, '${item.size}')" class="remove-item">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });

    if (total > 0) {
        totalElement.innerHTML = `Tổng cộng: ${formatPrice(total)}`;
        cartPreview.querySelector('.checkout-btn').style.display = 'block';
    } else {
        totalElement.innerHTML = '';
        cartPreview.querySelector('.checkout-btn').style.display = 'none';
    }
}

// Function to remove item from cart
function removeFromCart(productId, size) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật hiển thị
    updateCartCount();
    updateCartPreview();
}

// Thêm hàm để xử lý lỗi ảnh
function handleImageError(img) {
    img.onerror = null; // Tránh lặp vô hạn
    img.src = 'img/default-product.jpg'; // Ảnh mặc định khi lỗi
}

// Thêm xử lý user account
function initializeUserAccount() {
    const userIcon = document.querySelector('.user-icon');
    
    // Tạo user menu
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
        <div class="user-menu-content">
            ${isLoggedIn ? `
                <div class="user-info">
                    <p>Xin chào, ${currentUser?.name || 'User'}</p>
                </div>
                <ul>
                    <li><a href="#"><i class="fas fa-user"></i> Tài khoản của tôi</a></li>
                    <li><a href="#"><i class="fas fa-shopping-bag"></i> Đơn hàng</a></li>
                    <li><a href="#"><i class="fas fa-heart"></i> Yêu thích</a></li>
                    <li><a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                </ul>
            ` : `
                <form class="login-form" onsubmit="login(event)">
                    <input type="email" placeholder="Email" required>
                    <input type="password" placeholder="Mật khẩu" required>
                    <button type="submit" class="cta-button">Đăng nhập</button>
                </form>
                <p class="register-link">
                    Chưa có tài khoản? <a href="#" onclick="showRegisterForm()">Đăng ký</a>
                </p>
            `}
        </div>
    `;
    document.body.appendChild(userMenu);

    // Xử lý click vào user icon
    userIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && e.target !== userIcon) {
            userMenu.style.display = 'none';
        }
    });
}

// Hàm xử lý đăng nhập
function login(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    // Thêm logic xác thực đăng nhập ở đây
    isLoggedIn = true;
    currentUser = { name: email.split('@')[0] };
    initializeUserAccount();
    document.querySelector('.user-menu').style.display = 'none';
}

// Hàm x lý đăng xuất
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    isLoggedIn = false;
    currentUser = null;
    showLoginForm(); // Hiển thị form đăng nhập sau khi đăng xuất
    alert('Đã đăng xuất thành công!');
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    // Chỉ render products nếu đang ở trang index
    if (document.querySelector('.product-grid')) {
        renderProducts();
    }
    
    loadCartFromLocalStorage();
    initializeSearch();
    initializeCart();
    initializeUserAccount();
    updateCartCount();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Thêm vào đầu file
const USERS_KEY = 'fashion_store_users';
const CURRENT_USER_KEY = 'fashion_store_current_user';

// Hàm kiểm tra user đã tồn tại
function isUserExists(email) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.some(user => user.email === email);
}

// Hàm đăng ký user mới
function register(userData) {
    if (isUserExists(userData.email)) {
        throw new Error('Email đã được sử dụng');
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const newUser = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
}

// Hàm hiển thị form đăng ký
function showRegisterForm() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.innerHTML = `
        <div class="user-menu-content">
            <form class="register-form" onsubmit="handleRegister(event)">
                <h3>Đăng ký tài khoản</h3>
                <input type="text" name="fullName" placeholder="Họ và tên" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Mật khẩu" required>
                <input type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" required>
                <button type="submit" class="cta-button">Đăng ký</button>
            </form>
            <p class="login-link">
                Đã có tài khoản? <a href="#" onclick="showLoginForm()">Đăng nhập</a>
            </p>
        </div>
    `;
}

// Hàm xử lý đăng ký
function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    if (formData.get('password') !== formData.get('confirmPassword')) {
        alert('Mật khẩu không khớp');
        return;
    }

    try {
        const userData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            password: formData.get('password') // Trong thực tế nên m hóa mật khẩu
        };
        
        const newUser = register(userData);
        login(newUser);
        alert('Đăng ký thành công!');
    } catch (error) {
        alert(error.message);
    }
}

// Cập nhật hàm login
function login(userData) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    isLoggedIn = true;
    currentUser = userData;
    initializeUserAccount();
    document.querySelector('.user-menu').style.display = 'none';
}

// Cập nhật lại hàm initializeUserAccount
function initializeUserAccount() {
    // Load user data from localStorage
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
    }
    
    const userIcon = document.querySelector('.user-icon');
    
    // Tạo user menu nếu chưa tồn tại
    let userMenu = document.querySelector('.user-menu');
    if (!userMenu) {
        userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        document.body.appendChild(userMenu);
    }

    let timeout;

    // Xử lý hover vào user icon
    userIcon.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        updateUserMenu(); // Cập nhật nội dung menu trước khi hiển thị
        const iconRect = userIcon.getBoundingClientRect();
        userMenu.style.right = `${window.innerWidth - iconRect.right - 10}px`;
        userMenu.style.display = 'block';
    });

    // Xử lý hover vào user menu
    userMenu.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
    });

    // Xử lý mouse leave
    const hideUserMenu = () => {
        timeout = setTimeout(() => {
            userMenu.style.display = 'none';
        }, 300);
    };

    userIcon.addEventListener('mouseleave', hideUserMenu);
    userMenu.addEventListener('mouseleave', hideUserMenu);

    // Cập nhật vị trí user menu khi scroll
    window.addEventListener('scroll', () => {
        if (userMenu.style.display === 'block') {
            const iconRect = userIcon.getBoundingClientRect();
            userMenu.style.right = `${window.innerWidth - iconRect.right - 10}px`;
        }
    });

    // Cập nhật vị trí user menu khi resize window
    window.addEventListener('resize', () => {
        if (userMenu.style.display === 'block') {
            const iconRect = userIcon.getBoundingClientRect();
            userMenu.style.right = `${window.innerWidth - iconRect.right - 10}px`;
        }
    });

    // Khởi tạo nội dung menu ban đầu
    updateUserMenu();
}

// Thêm hàm mới để cập nhật nội dung user menu
function updateUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) return;

    if (isLoggedIn && currentUser) {
        userMenu.innerHTML = `
            <div class="user-menu-content">
                <div class="user-info">
                    <p><i class="fas fa-user-circle"></i> ${currentUser.fullName || currentUser.email}</p>
                </div>
                <ul>
                    <li>
                        <a href="account.html">
                            <i class="fas fa-user"></i>
                            <span>Tài khoản của tôi</span>
                        </a>
                    </li>
                    <li>
                        <a href="account.html#orders">
                            <i class="fas fa-shopping-bag"></i>
                            <span>Đơn hàng của tôi</span>
                        </a>
                    </li>
                    <li>
                        <a href="account.html#wishlist">
                            <i class="fas fa-heart"></i>
                            <span>Sản phẩm yêu thích</span>
                        </a>
                    </li>
                    <li>
                        <a href="account.html#address">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Sổ địa chỉ</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Đăng xuất</span>
                        </a>
                    </li>
                </ul>
            </div>
        `;
    } else {
        userMenu.innerHTML = `
            <div class="user-menu-content">
                <div class="auth-links">
                    <a href="auth.html" class="cta-button">
                        <i class="fas fa-sign-in-alt"></i> Đăng nhập
                    </a>
                    <p class="register-link">
                        Chưa có tài khoản?<a href="auth.html?tab=register">Đăng ký ngay</a>
                    </p>
                </div>
            </div>
        `;
    }
}

// Thêm hàm hiển thị form đăng nhập
function showLoginForm() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.innerHTML = `
        <div class="user-menu-content">
            <form class="login-form" onsubmit="handleLogin(event)">
                <h3>Đăng nhập</h3>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Mật khẩu" required>
                <button type="submit" class="cta-button">Đăng nhập</button>
            </form>
            <p class="register-link">
                Chưa có tài khoản? <a href="#" onclick="showRegisterForm()">Đăng ký</a>
            </p>
        </div>
    `;
}

// Cập nhật hàm xử lý đăng nhập
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    // Kiểm tra thông tin đăng nhập từ localStorage
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        isLoggedIn = true;
        currentUser = user;
        initializeUserAccount();
        document.querySelector('.user-menu').style.display = 'none';
        alert('Đăng nhập thành công!');
    } else {
        alert('Email hoặc mật khẩu không đúng!');
    }
}

// Thêm CSS cho form đăng nhập/đăng ký
const style = document.createElement('style');
style.textContent = `
    .user-menu-content h3 {
        margin-bottom: 1rem;
        text-align: center;
    }

    .login-form, .register-form {
        display: grid;
        gap: 1rem;
        padding: 1rem;
    }

    .login-form input, .register-form input {
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 100%;
    }

    .login-form button, .register-form button {
        width: 100%;
        border: none;
        cursor: pointer;
    }

    .register-link, .login-link {
        text-align: center;
        margin-top: 1rem;
        padding-bottom: 1rem;
    }

    .register-link a, .login-link a {
        color: #ff4d4d;
        text-decoration: none;
        font-weight: bold;
    }

    .register-link a:hover, .login-link a:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(style);

// Thêm hàm chuyển hướng đến trang thanh toán
function goToCheckout() {
    // Kiểm tra đăng nhập trước khi chuyển đến trang thanh toán
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) {
        alert('Vui lòng đăng nhập để tiếp tục thanh toán');
        document.querySelector('.user-icon').click(); // Mở form đăng nhập
        return;
    }

    // Kiểm tra giỏ hàng có sản phẩm không
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống');
        return;
    }

    // Chuyển hướng đến trang thanh toán
    window.location.href = 'checkout.html';
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    validateCart();
    updateCartCount();
});

// Thêm hàm kiểm tra tính hợp lệ của giỏ hàng
function validateCart() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => 
        item && 
        item.id && 
        item.name && 
        item.price && 
        item.quantity && 
        item.image
    );
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to toggle wishlist
function toggleWishlist(productId, event) {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
    
    // Kiểm tra đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('fashion_store_current_user'));
    if (!currentUser) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
        window.location.href = 'auth.html';
        return;
    }

    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const btn = event.currentTarget;
    
    if (wishlist.includes(productId)) {
        // Xóa khỏi wishlist
        wishlist = wishlist.filter(id => id !== productId);
        btn.classList.remove('active');
    } else {
        // Thêm vào wishlist
        wishlist.push(productId);
        btn.classList.add('active');
        
        // Hiển thị thông báo
        showNotification('Đã thêm vào danh sách yêu thích!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}