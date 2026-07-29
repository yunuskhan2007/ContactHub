const API_URL = "https://contacthub-4si7.onrender.com/api/contacts";

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);

const contactId = params.get("id");

// ===============================
// ELEMENTS
// ===============================

const deleteModal = document.getElementById("deleteModal");

const deleteBtn = document.querySelector(
    ".profile-actions button:nth-child(4)"
);

const floatingBtn = document.querySelector(".floating-btn");

const cancelDelete = document.getElementById("cancelDelete");

const confirmDelete = document.getElementById("confirmDelete");

const favoriteBtn = document.querySelector(
    ".profile-actions button:nth-child(3)"
);

// ===============================
// DELETE MODAL
// ===============================

if (deleteBtn && deleteModal) {

    deleteBtn.addEventListener("click", () => {

        deleteModal.classList.add("active");

    });

}

if (cancelDelete && deleteModal) {

    cancelDelete.addEventListener("click", () => {

        deleteModal.classList.remove("active");

    });

}

// ===============================
// CLOSE MODAL
// ===============================

window.addEventListener("click", (e) => {

    if (e.target === deleteModal) {

        deleteModal.classList.remove("active");

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        deleteModal.classList.remove("active");

    }

});

// ===============================
// DELETE CONTACT
// ===============================

if (confirmDelete) {

    confirmDelete.addEventListener("click", () => {

        alert("Contact Deleted Successfully!");

        window.location.href = "contacts.html";

    });

}

// ===============================
// FAVORITE
// ===============================

let favorite = false;

if (favoriteBtn) {

    favoriteBtn.addEventListener("click", () => {

        favorite = !favorite;

        const icon = favoriteBtn.querySelector("i");

        if (favorite) {

            icon.style.color = "#F59E0B";

            favoriteBtn.style.background = "#FEF3C7";

        } else {

            icon.style.color = "";

            favoriteBtn.style.background = "";

        }

    });

}

// ===============================
// CALL BUTTON
// ===============================

const callBtn = document.querySelector(
    ".profile-actions button:nth-child(1)"
);

if (callBtn) {

    callBtn.addEventListener("click", () => {

        window.location.href = "tel:9876543210";

    });

}

// ===============================
// EMAIL BUTTON
// ===============================

const emailBtn = document.querySelector(
    ".profile-actions button:nth-child(2)"
);

if (emailBtn) {

    emailBtn.addEventListener("click", () => {

        window.location.href = "mailto:john@email.com";

    });

}

// ===============================
// FLOATING BUTTON
// ===============================

if (floatingBtn) {

    floatingBtn.addEventListener("mouseenter", () => {

        floatingBtn.style.transform = "scale(1.08)";

    });

    floatingBtn.addEventListener("mouseleave", () => {

        floatingBtn.style.transform = "";

    });

}

// ===============================
// CARD HOVER
// ===============================

const cards = document.querySelectorAll(".info-card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-6px)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});
// ===============================
// EDIT BUTTON
// ===============================

const editBtn = document.getElementById("editBtn");

const floatingEditBtn = document.getElementById("floatingEditBtn");

if (editBtn) {

    editBtn.addEventListener("click", (e) => {

        e.preventDefault();

        window.location.href = `editContact.html?id=${contactId}`;

    });

}

if (floatingEditBtn) {

    floatingEditBtn.addEventListener("click", (e) => {

        e.preventDefault();

        window.location.href = `editContact.html?id=${contactId}`;

    });

}// LOAD //

async function loadContact() {

    try {

        const response = await fetch(

            `${API_URL}/${contactId}`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!response.ok) {

            showToast(data.message, "error");

            return;

        }

        const contact = data.contact;

        document.getElementById("contactImage").src =
            contact.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`;

        document.getElementById("contactName").textContent =
            contact.name;

        document.getElementById("contactPhone").textContent =
            contact.phone || "-";

        document.getElementById("contactEmail").textContent =
            contact.email || "-";

        document.getElementById("contactAddress").textContent =
            contact.address || "-";

        document.getElementById("contactCompany").textContent =
            contact.company || "-";

        document.getElementById("contactJob").textContent =
            contact.job || "-";

        document.getElementById("contactGroup").textContent =
            contact.group || "-";

        document.getElementById("contactGroupBadge").textContent =
            contact.group || "General";

        document.getElementById("contactNotes").textContent =
            contact.notes || "No notes.";

        const icon = favoriteBtn.querySelector("i");

        if (contact.favorite) {

            icon.classList.remove("fa-regular");

            icon.classList.add("fa-solid");

            icon.style.color = "#F59E0B";

        }

    }

    catch (error) {

        console.error(error);

        showToast("Unable to load contact", "error");

    }

}

// ===============================
// PAGE LOAD
// ===============================

window.addEventListener("load", () => {

    document.body.style.opacity = "1";

    loadContact();

});