
// Initialize Swiper
const homeSlider = new Swiper('.home-slider', {
    effect: "cube",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
    },
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
});

var cube = new Swiper(".gallery-slider", {
    effect: "cube",
    grabCursor: true,
    slidesPerView: "auto",
    cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 50,
        shadowScale: 1,
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    loop: true,
});

// Modal functions
function showModal(modalId) {
    closeAllModals();
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleIcon = input.nextElementSibling.querySelector('i');

    if (input.type === "password") {
        input.type = "text";
        toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = "password";
        toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Toggle navbar on mobile
function toggleNavbar() {
    document.querySelector('.navbar').classList.toggle('active');
}

// Event booking functions
function Event_open(packageName) {
    if (document.querySelector('.login-btn').textContent == 'Login') {
        showModal('loginModal');
    } else {
        document.getElementById('packageName').textContent = `You have selected the ${packageName} Package`;
        // document.getElementById('booking-name').value = user.name;
        // document.getElementById('booking-email').value = user.email;
        // document.getElementById('booking-name').disabled = true;
        // document.getElementById('booking-email').disabled = true;
        showModal('bookingModal');
    }
}

// Popup functions
function pop(text) {
    document.querySelector('.massage').textContent = text;
    document.getElementsByClassName("popup")[0].style.display = "block";
}

function closePop() {
    const popup = document.querySelector('.popup');
    popup.style.display = "none";
    popup.innerHTML = `<p>
            <center class="alert">Message Sent! 📨</center>
            <br>
            <p class="massage"></p>
            <br>
            <button onclick="closePop()">Close</button>`
}


// Form validation functions
function check() {
    let name = document.getElementsByClassName('input')[0].value;
    let email = document.getElementsByClassName('input')[1].value;
    let number = document.getElementsByClassName('input')[2].value;
    let subject = document.getElementsByClassName('input')[3].value;
    let Query = document.getElementsByTagName('textarea')[0].value;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "" || email === "" || number === "" || subject === "" || query === "") {
        pop("All fields are required");
    } else if (!pattern.test(email)) {
        pop("Please enter a valid email address");
    } else if (number.length !== 10) {
        pop("Please enter a valid 10-digit phone number");
    } else {
        pop('Thank you for reaching out! We will get back to you as soon as possible.');
        // Clear form
        document.querySelector('.contact form').reset();
    }
}

function Event_check() {
    const user = JSON.parse(localStorage.getItem('user'));
    const phone = user.phone;
    const date = document.getElementById('booking-date').value;
    const guests = document.getElementById('booking-guests').value;
    const payment = document.getElementById('booking-payment').value;
    const package = document.getElementById('packageName').textContent.split(' ')[4]; // e.g. "Premium"
    const name = user.name;
    const email = user.email;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const today = new Date();
    const eventDate = new Date(date);

    if (!date || !guests || !payment) {
        pop("Please fill all fields");
    }else if (eventDate < today) {
        pop("Please choose a future date");
    } else {
        fetch('/booking/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, date, guests, payment, package })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    pop("Thanks for choosing our site! Your booking has been confirmed.");
                    closeModal('bookingModal');
                } else {
                    pop('Something went wrong. Try again.');
                }
            })
            .catch(() => pop('Server error.'));

        // Clear form
        document.getElementById('booking-date').value = "";
        document.getElementById('booking-guests').value = "";
        document.getElementById('booking-payment').selectedIndex = 0;
    }
}


function register_check() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-number').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !phone || !password || !confirmPassword) {
        pop('Please fill all fields');
    } else if (!pattern.test(email)) {
        pop("Please enter a valid email address");
    } else if (phone.length !== 10) {
        pop("Please enter a valid 10-digit phone number");
    } else if (password !== confirmPassword) {
        pop('Passwords do not match');
    } else {
        fetch('/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    pop('Registration successful! Please login.');
                    closeModal('registerModal');
                    updateLoginUI();
                } else if (data.status === 'exists') {
                    pop('Email already registered. Please login.');
                } else {
                    pop('Something went wrong. Try again.');
                }
            })
            .catch(() => pop('Server error.'));
    }
}

// Login
function login_check() {
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        pop('Please fill all fields');
    } else {
        fetch('/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    localStorage.setItem('user', JSON.stringify({ name: data.name, email , phone:data.phone}));
                    pop('Login successful!');
                    closeModal('loginModal');
                    updateLoginUI();
                } else if (data.status === 'not_found') {
                    pop('Please register first.');
                } else if (data.status === 'wrong_password') {
                    pop('Incorrect password.');
                } else {
                    pop('Login failed.');
                }
            })
            .catch(() => pop('Server error.'));
    }
}

function updateLoginUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const btn = document.querySelector('.login-btn');

    if (user) {
        btn.textContent = `Hi, ${user.name}`;
        btn.onclick = showLogoutPopup;
        btn.style.backgroundColor = 'transparent';
        btn.style.border = '2px solid var(--accent)';
    } else {
        btn.textContent = 'Login';
        btn.onclick = () => showModal('loginModal');
        btn.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
        btn.style.border = 'none';
    }
}

// Logout
function logout_user() {
    localStorage.removeItem('user');
    document.querySelector('.logout-popup')?.remove();
    const popup = document.querySelector('.popup');
    popup.innerHTML = `<p>
            <center class="alert">Message Sent! 📨</center>
            <br>
            <p class="massage"></p>
            <br>
            <button onclick="closePop()">Close</button>`
    pop('You have been logged out.');
    updateLoginUI();
}

function showLogoutPopup() {
    const popup = document.querySelector('.popup');
    popup.innerHTML = `
        <center class="alert">Logout</center>
        <p class="massage">Do you want to logout?</p>
        <div class="popup-btns">
            <button class="popbtn" onclick="logout_user()">Logout</button>
            <button class="popbtn" onclick="closePop()">Cancel</button>
        </div>
    `;

    popup.style.display = "block";
}


window.addEventListener('load', updateLoginUI);


// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
});