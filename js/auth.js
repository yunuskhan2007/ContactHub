/* ===========================================
   ContactHub Authentication
=========================================== */

const API_URL = "https://contacthub-4si7.onrender.com/api";

/* ===========================================
   VALIDATION HELPERS
=========================================== */

function clearErrors() {

    document.querySelectorAll(".error-message").forEach(error => {
        error.textContent = "";
    });

    document.querySelectorAll(".input-error").forEach(input => {
        input.classList.remove("input-error");
    });

}

function showError(inputId, message) {

    const input = document.getElementById(inputId);

    if (!input) return;

    input.classList.add("input-error");

    let error = document.getElementById(`${inputId}-error`);

    if (!error) {

        error = document.createElement("small");

        error.className = "error-message";

        error.id = `${inputId}-error`;

        input.insertAdjacentElement("afterend", error);

    }

    error.textContent = message;

}

function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function validatePassword(password) {

    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_!#$%^&*])[A-Za-z\d@_!#$%^&*]{6,}$/.test(password);

}

function setButtonLoading(button, loadingText) {

    button.dataset.originalText = button.innerHTML;

    button.disabled = true;

    button.innerHTML = loadingText;

}

function resetButton(button) {

    button.disabled = false;

    button.innerHTML = button.dataset.originalText;

}

/* ===========================================
   LIVE VALIDATION
=========================================== */

document.querySelectorAll("input").forEach(input => {

    input.addEventListener("input", () => {

        input.classList.remove("input-error");

        const error = document.getElementById(`${input.id}-error`);

        if (error) {

            error.textContent = "";

        }

    });

});
/* ===========================================
   LOGIN
=========================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        clearErrors();

        const submitBtn = loginForm.querySelector("button[type='submit']");

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        let hasError = false;

        if (!email) {

            showError("email", "Email is required");
            hasError = true;

        }
        else if (!validateEmail(email)) {

            showError("email", "Enter a valid email address");
            hasError = true;

        }

        if (!password) {

            showError("password", "Password is required");
            hasError = true;

        }

        if (hasError) return;

        setButtonLoading(submitBtn, "Logging in...");

        try {

            const response = await fetch(`${API_URL}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            resetButton(submitBtn);

            if (!response.ok) {

                if (data.message?.toLowerCase().includes("email")) {

                    showError("email", data.message);

                }
                else if (
                    data.message?.toLowerCase().includes("password") ||
                    data.message?.toLowerCase().includes("credentials")
                ) {

                    showError("password", data.message);

                }
                else {

                    showToast(data.message || "Login Failed", "error");

                }

                return;

            }

            localStorage.setItem("token", data.token);

            if (data.user) {

                localStorage.setItem("user", JSON.stringify(data.user));

            }

            showToast("Welcome back 👋", "success");

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1200);

        }

        catch (error) {

            console.error(error);

            resetButton(submitBtn);

            showToast("Unable to connect to server", "error");

        }

    });

}
/* ===========================================
   SIGNUP
=========================================== */

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        clearErrors();

        const submitBtn = signupForm.querySelector("button[type='submit']");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        let hasError = false;

        /* ---------- Required Fields ---------- */

        if (!name) {

            showError("name", "Name is required");
            hasError = true;

        }

        if (!email) {

            showError("email", "Email is required");
            hasError = true;

        }

        if (!phone) {

            showError("phone", "Phone number is required");
            hasError = true;

        }

        if (!password) {

            showError("password", "Password is required");
            hasError = true;

        }

        if (!confirmPassword) {

            showError("confirmPassword", "Please confirm your password");
            hasError = true;

        }

        if (hasError) return;

        /* ---------- Email Validation ---------- */

        if (!validateEmail(email)) {

            showError("email", "Enter a valid email address");
            return;

        }

        /* ---------- Phone Validation ---------- */

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {

            showError("phone", "Enter a valid 10-digit phone number");
            return;

        }

        /* ---------- Password Validation ---------- */

        if (!validatePassword(password)) {

            showError(
                "password",
                "Password must contain uppercase, lowercase, number & special character (@_&)."
            );

            return;

        }

        /* ---------- Confirm Password ---------- */

        if (password !== confirmPassword) {

            showError("confirmPassword", "Passwords do not match");
            return;

        }

        setButtonLoading(submitBtn, "Creating Account...");

        try {

            const response = await fetch(`${API_URL}/signup`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    fullName: name,
                    email,
                    phone,
                    password

                })

            });

            const data = await response.json();

            resetButton(submitBtn);

            if (!response.ok) {

                const message = data.message?.toLowerCase() || "";

                if (message.includes("email")) {

                    showError("email", data.message);

                }
                else if (message.includes("phone")) {

                    showError("phone", data.message);

                }
                else if (message.includes("password")) {

                    showError("password", data.message);

                }
                else {

                    showToast(data.message || "Signup Failed", "error");

                }

                return;

            }

            showToast("Account Created Successfully!", "success");

            setTimeout(() => {

                window.location.href = "login.html";

            }, 1200);

        }

        catch (error) {

            console.error(error);

            resetButton(submitBtn);

            showToast("Unable to connect to server", "error");

        }

    });

}

/* ===========================================
   SHOW / HIDE PASSWORD
=========================================== */

function togglePassword(inputId, eyeId) {

    const input = document.getElementById(inputId);
    const eye = document.getElementById(eyeId);

    if (!input || !eye) return;

    eye.onclick = function () {

        if (input.getAttribute("type") === "password") {

            input.setAttribute("type", "text");
            eye.className = "fa-solid fa-eye-slash";

        } else {

            input.setAttribute("type", "password");
            eye.className = "fa-solid fa-eye";

        }

    };

}

/* ---------- Login ---------- */

togglePassword("password", "togglePassword");

/* ---------- Signup ---------- */

togglePassword("password", "togglePassword");
togglePassword("confirmPassword", "toggleConfirmPassword");