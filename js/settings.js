const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const API_URL = "https://contacthub-4si7.onrender.com/api";

const profilePreview = document.getElementById("profilePreview");
const profileImage = document.getElementById("profileImage");
const uploadBtn = document.getElementById("uploadBtn");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const about = document.getElementById("about");

const saveProfile = document.getElementById("saveProfile");

// ===========================
// LOAD PROFILE
// ===========================

async function loadProfile() {

    try {

        const response = await fetch(`${API_URL}/profile`, {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const user = await response.json();

        fullName.value = user.fullName || "";
        email.value = user.email || "";
        phone.value = user.phone || "";
        address.value = user.address || "";
        about.value = user.about || "";

        if (user.profileImage) {

            profilePreview.src = user.profileImage;

        } else {

            profilePreview.src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4F46E5&color=fff`;

        }

    } catch (err) {

        console.error(err);

        showToast("Unable to load profile", "error");

    }

}
// ===========================
// UPLOAD IMAGE
// ===========================

uploadBtn.addEventListener("click", () => {

    profileImage.click();

});

profileImage.addEventListener("change", async () => {

    const file = profileImage.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    try {

        const response = await fetch(`${API_URL}/upload-image`, {

            method: "POST",

            headers: {

                Authorization: `Bearer ${token}`

            },

            body: formData

        });

        const data = await response.json();

        profilePreview.src = data.image;

        showToast("Profile photo updated", "success");

    }

    catch (err) {

        console.error(err);

        showToast("Upload failed", "error");

    }

});

// ===========================
// SAVE PROFILE
// ===========================

saveProfile.addEventListener("click", async () => {

    try {

        const response = await fetch(`${API_URL}/profile`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                fullName: fullName.value,

                phone: phone.value,

                address: address.value,

                about: about.value

            })

        });

        const data = await response.json();

        showToast(data.message, "success");

    }

    catch (err) {

        console.error(err);

        showToast("Unable to update profile", "error");

    }

});
// ===========================
// DELETE IMAGE
// ===========================

const deleteBtn = document.getElementById("deleteImageBtn");

if (deleteBtn) {

    deleteBtn.addEventListener("click", async () => {

        const response = await fetch("https://contacthub-4si7.onrender.com/api/users/profile-image",
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.ok) {

            profilePreview.src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.value)}&background=4F46E5&color=fff`;

            showToast("Profile image removed", "success");

        } else {

            showToast(data.message || "Delete failed", "error");

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

    eye.addEventListener("click", () => {

        if (input.type === "password") {

            input.type = "text";

            eye.classList.remove("fa-eye");
            eye.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            eye.classList.remove("fa-eye-slash");
            eye.classList.add("fa-eye");

        }

    });

}
// ===========================
// CHANGE PASSWORD
// ===========================

const changePasswordBtn = document.getElementById("changePassword");

if (changePasswordBtn) {

    changePasswordBtn.addEventListener("click", async () => {

        const currentPassword = document.getElementById("currentPassword").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast("Please fill all fields.", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        try {

            const response = await fetch(`${API_URL}/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.message || "Unable to update password.", "error");
                return;
            }

            showToast("Password updated successfully!", "success");

            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";

        } catch (err) {

            console.error(err);
            showToast("Something went wrong.", "error");

        }

    });

}

/* ---------- Settings ---------- */

togglePassword("currentPassword", "toggleCurrentPassword");

togglePassword("newPassword", "toggleNewPassword");

togglePassword("confirmPassword", "toggleConfirmPassword");

// ===========================
// INIT
// ===========================

loadProfile();