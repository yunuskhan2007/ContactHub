const API_URL = "https://contacthub-4si7.onrender.com/api/contacts";
let allFavorites = [];
const token = localStorage.getItem("token");

/* ===========================================
   ContactHub - Favorites
=========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initViewToggle();

    initSearch();

    initFilters();

    loadFavorites();

});

//FIlter

function renderFavorites(contacts) {

    const container = document.getElementById("favoritesContainer");
    const count = document.getElementById("favoriteCount");

    container.innerHTML = "";

    if (!contacts.length) {

        container.innerHTML =
            `<p class="empty-state">No favorite contacts found.</p>`;

        return;

    }

    contacts.forEach(contact => {

        container.innerHTML += createContactCard(contact);

    });

    initFavorite();
    initDelete();
    initView();
    initEdit();

}

/* ===========================================
   GRID / LIST VIEW
=========================================== */

function initViewToggle() {

    const gridBtn = document.getElementById("gridViewBtn");
    const listBtn = document.getElementById("listViewBtn");
    const container = document.getElementById("favoritesContainer");

    if (!gridBtn || !listBtn || !container) return;

    if (listBtn.classList.contains("active")) {

        container.classList.remove("contacts-grid");
        container.classList.add("contacts-list");

    } else {

        container.classList.remove("contacts-list");
        container.classList.add("contacts-grid");

    }

    gridBtn.addEventListener("click", () => {

        container.classList.remove("contacts-list");
        container.classList.add("contacts-grid");

        gridBtn.classList.add("active");
        listBtn.classList.remove("active");

    });

    listBtn.addEventListener("click", () => {

        container.classList.remove("contacts-grid");
        container.classList.add("contacts-list");

        listBtn.classList.add("active");
        gridBtn.classList.remove("active");

    });

}

/* ===========================================
   SEARCH
=========================================== */

function initSearch() {

    const search = document.getElementById("contactSearch");

    if (!search) return;

    search.addEventListener("keyup", () => {

        const value = search.value.toLowerCase();

        const cards = document.querySelectorAll(".contact-card");

        cards.forEach(card => {

            const text = card.innerText.toLowerCase();

            card.style.display =
                text.includes(value) ? "" : "none";

        });

    });

}

/* ===========================================
   FILTERS
=========================================== */

function initFilters() {

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const group = button.textContent.trim();

            if (group === "All") {

                renderFavorites(allFavorites);

            } else {

                const filtered = allFavorites.filter(contact =>
                    contact.group &&
                    contact.group.toLowerCase() === group.toLowerCase()
                );

                renderFavorites(filtered);

            }

        });

    });

}

/* ===========================================
   FAVORITE
=========================================== */

function initFavorite() {

    document.querySelectorAll(".favorite-btn").forEach(button => {

        button.onclick = async function () {

            try {

                const id = this.dataset.id;

                const response = await fetch(

                    `${API_URL}/${id}/favorite`,

                    {

                        method: "PATCH",

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

                showToast("Removed from favorites", "success");

                loadFavorites();

            }

            catch (error) {

                console.error(error);

                showToast("Unable to update favorite.", "error");

            }

        };

    });

}

/* ===========================================
   DELETE
=========================================== */

function initDelete() {

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.onclick = async function () {

             const result = await Swal.fire({
    title: "Delete Contact?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel"
});

if (!result.isConfirmed) return;
            try {

                const id = this.dataset.id;

                const response = await fetch(

                    `${API_URL}/${id}`,

                    {

                        method: "DELETE",

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

                showToast("Contact deleted.", "success");

                loadFavorites();

            }

            catch (error) {

                console.error(error);

            }

        };

    });

}

/* ===========================================
   VIEW
=========================================== */

function initView() {

    document.querySelectorAll(".view-btn").forEach(button => {

        button.addEventListener("click", (e) => {

            e.stopPropagation();

            window.location.href =
                `viewContacts.html?id=${button.dataset.id}`;

        });

    });

}

/* ===========================================
   EDIT
=========================================== */

function initEdit() {

    document.querySelectorAll(".edit-btn").forEach(button => {

        button.addEventListener("click", (e) => {

            e.stopPropagation();

            window.location.href =
                `editContact.html?id=${button.dataset.id}`;

        });

    });

}

/* ===========================================
   LOAD FAVORITES
=========================================== */

async function loadFavorites() {

    if (!token) {

        window.location.href = "login.html";
        return;

    }

    try {

        const response = await fetch(API_URL, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {

            showToast(data.message, "error");
            return;

        }

        // Store all favorite contacts
        allFavorites = data.contacts.filter(contact => contact.favorite);

        // Update total count
        document.getElementById("favoriteCount").textContent = allFavorites.length;

        // Render cards
        renderFavorites(allFavorites);

    }

    catch (error) {

        console.error(error);
        showToast("Unable to load favorite contacts.", "error");

    }

}