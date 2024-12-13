document.addEventListener('DOMContentLoaded', () => {
    // Xử lý chuyển tab
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            document.querySelector(`#${tab.dataset.tab}-form`).classList.add('active');
        });
    });

    // Xử lý đăng nhập
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        
        try {
            // Kiểm tra thông tin đăng nhập từ localStorage
            const users = JSON.parse(localStorage.getItem('fashion_store_users') || '[]');
            const user = users.find(u => 
                u.email === formData.get('email') && 
                u.password === formData.get('password')
            );

            if (user) {
                localStorage.setItem('fashion_store_current_user', JSON.stringify(user));
                alert('Đăng nhập thành công!');
                window.location.href = 'index.html';
            } else {
                alert('Email hoặc mật khẩu không đúng!');
            }
        } catch (error) {
            alert('Có lỗi xảy ra: ' + error.message);
        }
    });

    // Xử lý đăng ký
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);

        if (formData.get('password') !== formData.get('confirmPassword')) {
            alert('Mật khẩu không khớp!');
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem('fashion_store_users') || '[]');
            
            // Kiểm tra email đã tồn tại
            if (users.some(u => u.email === formData.get('email'))) {
                alert('Email đã được sử dụng!');
                return;
            }

            // Tạo user mới
            const newUser = {
                id: Date.now(),
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                password: formData.get('password'),
                createdAt: new Date().toISOString()
            };

            // Lưu vào localStorage
            users.push(newUser);
            localStorage.setItem('fashion_store_users', JSON.stringify(users));
            localStorage.setItem('fashion_store_current_user', JSON.stringify(newUser));

            alert('Đăng ký thành công!');
            window.location.href = 'index.html';
        } catch (error) {
            alert('Có lỗi xảy ra: ' + error.message);
        }
    });
}); 