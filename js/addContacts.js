// ===============================
// ELEMENTS
// ===============================
const API_URL = "http://localhost:3000/api/contacts";
const token = localStorage.getItem("token");
const form = document.getElementById("contactForm");

const imageInput = document.getElementById("contactImage");
const previewImage = document.getElementById("previewImage");
const uploadBtn = document.getElementById("uploadBtn");

const nameInput = document.getElementById("contactName");
const emailInput = document.getElementById("contactEmail");
const phoneInput = document.getElementById("contactPhone");
const companyInput = document.getElementById("contactCompany");
const jobInput = document.getElementById("contactJob");
const groupInput = document.getElementById("contactGroup");
const addressInput = document.getElementById("contactAddress");
const notesInput = document.getElementById("contactNotes");
const favoriteInput = document.getElementById("favoriteToggle");

const noteCounter = document.getElementById("noteCounter");
const toast = document.getElementById("toast");
const loader = document.getElementById("loader");

// ===============================
// IMAGE PREVIEW
// ===============================

uploadBtn.addEventListener("click", () => {

    imageInput.click();

});

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        showToast("Please select a valid image.", "error");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

    };

    reader.readAsDataURL(file);

});

// ===============================
// NOTES COUNTER
// ===============================

notesInput.addEventListener("input", () => {

    noteCounter.textContent = `${notesInput.value.length} / 500`;

});

// ===============================
// VALIDATION
// ===============================

function setError(input, message) {

    const error = input.parentElement.querySelector(".error");

    if (error) error.textContent = message;

    input.classList.remove("valid");

    input.classList.add("invalid");

}

function setSuccess(input) {

    const error = input.parentElement.querySelector(".error");

    if (error) error.textContent = "";

    input.classList.remove("invalid");

    input.classList.add("valid");

}

function validateName() {

    const value = nameInput.value.trim();

    if (value.length < 2) {

        setError(nameInput, "Enter a valid name.");

        return false;

    }

    setSuccess(nameInput);

    return true;

}

function validateEmail() {

    const value = emailInput.value.trim();

    if (value === "") {

        setSuccess(emailInput);

        return true;

    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value)) {

        setError(emailInput, "Invalid email.");

        return false;

    }

    setSuccess(emailInput);

    return true;

}

function validatePhone() {

    const value = phoneInput.value.replace(/\D/g, "");

    if (value.length !== 10) {

        setError(phoneInput, "Phone number must contain 10 digits.");

        return false;

    }

    setSuccess(phoneInput);

    return true;

}

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);

// ===============================
// SAVE CONTACT
// ===============================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const validName = validateName();
    const validEmail = validateEmail();
    const validPhone = validatePhone();

    if (!validName || !validEmail || !validPhone) {

        return;

    }

    if (!token) {

        showToast("Please login again.", "error");

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1200);

        return;

    }

    loader.classList.add("active");

    try {

    const formData = new FormData();

    formData.append("name", nameInput.value.trim());
    formData.append("email", emailInput.value.trim());
    formData.append("phone", phoneInput.value.trim());
    formData.append("company", companyInput.value.trim());
    formData.append("job", jobInput.value.trim());
    formData.append("group", groupInput.value || "Others");
    formData.append("address", addressInput.value.trim());
    formData.append("notes", notesInput.value.trim());
    formData.append("favorite", favoriteInput.checked);

    if (imageInput.files.length > 0) {

        formData.append("image", imageInput.files[0]);

    }

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {

            Authorization: `Bearer ${token}`

        },

        body: formData

    });

    const data = await response.json();

    loader.classList.remove("active");

    if (!response.ok) {

        showToast(data.message || "Failed to add contact.", "error");

        return;

    }

    showToast("Contact added successfully!", "success");

    form.reset();

    previewImage.src =
        "https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff";

    noteCounter.textContent = "0 / 500";

    document.querySelectorAll(".valid, .invalid").forEach(input => {

        input.classList.remove("valid");
        input.classList.remove("invalid");

    });

    setTimeout(() => {

        window.location.href = "contacts.html";

    }, 1500);

}

catch (error) {

    console.error(error);

    loader.classList.remove("active");

    showToast("Unable to connect to server.", "error");

}
});

// ===============================
// RESET
// ===============================

form.addEventListener("reset", () => {

    previewImage.src =
        "https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff";

    noteCounter.textContent = "0 / 500";

    document.querySelectorAll(".error").forEach(error => {

        error.textContent = "";

    });

    document.querySelectorAll("input, textarea, select").forEach(input => {

        input.classList.remove("valid");

        input.classList.remove("invalid");

    });

});