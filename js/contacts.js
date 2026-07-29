const API_URL = "https://contacthub-4si7.onrender.com/api/contacts";
const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const selectedGroup = params.get("group");
const selectedCompany = params.get("company");
/* ===========================================
   ContactHub - Contacts
=========================================== */
document.addEventListener("DOMContentLoaded", () => {

    initViewToggle();

    initSearch();

    initFilters();

    const sort = document.getElementById("sortContacts");

    if (sort) {

        sort.addEventListener("change", loadContacts);

    }

    loadContacts();

});
/* ===========================================
   GRID / LIST VIEW
=========================================== */

function initViewToggle() {

    const gridBtn = document.getElementById("gridViewBtn");
    const listBtn = document.getElementById("listViewBtn");
    const container = document.getElementById("contactsContainer");

    if (!gridBtn || !listBtn || !container) return;

    // Default View
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

            card.style.display = text.includes(value)
                ? ""
                : "none";

        });

    });

}

/* ===========================================
   FILTER BUTTONS
=========================================== */

function initFilters() {

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            // MongoDB connect hone ke baad
            // actual filtering yaha hogi.

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

                showToast(data.message, "success");

                loadContacts();

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

                const response = await fetch(`${API_URL}/${id}`, {

                    method: "DELETE",

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                });

                const data = await response.json();

                if (!response.ok) {

                    showToast(data.message, "error");

                    return;

                }

                showToast("Contact deleted.", "success");

                loadContacts();

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

            window.location.href = `viewContacts.html?id=${button.dataset.id}`;

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
//Load contacts//

async function loadContacts() {

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

        const container = document.getElementById("contactsContainer");

        const count = document.querySelector(".card-header span");

        container.innerHTML = "";

        if (!data.contacts.length) {

            container.innerHTML = `

                <p class="empty-state">

                    No contacts found.

                </p>

            `;

            count.textContent = "0 Contacts";

            return;

        }

        let contacts = data.contacts;
        const sortOption =
    document.getElementById("sortContacts")?.value || "recent";

if (sortOption === "az") {

    contacts.sort((a, b) =>
        a.name.localeCompare(b.name)
    );

}

else if (sortOption === "za") {

    contacts.sort((a, b) =>
        b.name.localeCompare(a.name)
    );

}

else {

    contacts.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

}

        if (selectedGroup) {

            contacts = contacts.filter(contact =>
                contact.group &&
                contact.group.toLowerCase() === selectedGroup.toLowerCase()
            );

        }
        if (selectedCompany) {

    contacts = contacts.filter(contact =>
        contact.company &&
        contact.company.toLowerCase() === selectedCompany.toLowerCase()
    );

}

count.textContent = `${contacts.length} Contacts`;

contacts.forEach(contact => {

    container.innerHTML += createContactCard(contact);

});

        initFavorite();
        initDelete();
        initView();
        initEdit();

    }

    catch (error) {

        console.error(error);

        showToast("Unable to load contacts.", "error");

    }

}
