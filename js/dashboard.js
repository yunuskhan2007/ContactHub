/* ===========================================
   ContactHub Dashboard
=========================================== */

const token = localStorage.getItem("token");
const API_URL = "http://localhost:3000/api/dashboard";

if (!token) {
    window.location.href = "login.html";
}

/* ===========================================
   INITIALIZE
=========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadDashboard();
    const exportBtn = document.getElementById("exportBtn");

if (exportBtn) {

    exportBtn.addEventListener("click", exportContacts);

}

    initSearch();
    initFloatingButton();
    initNotifications();
    initCardHover();
    initProfile();

});

/* ===========================================
   LOAD DASHBOARD
=========================================== */

async function loadDashboard() {

    try {

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {

            showToast(data.message || "Unable to load dashboard", "error");
            return;

        }

       /* ---------- USER ---------- */

document.getElementById("welcomeText").textContent =
    `Welcome Back 👋 ${data.user.fullName}`;

document.getElementById("profileName").textContent =
    data.user.fullName;

const profileAvatar = document.getElementById("dashboardAvatar");

if (profileAvatar) {

    if (data.user.profileImage) {

        profileAvatar.src = data.user.profileImage;

    } else {

        profileAvatar.src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.fullName)}&background=4F46E5&color=fff`;

    }

}

        /* ---------- STATS ---------- */

        document.getElementById("totalContacts").textContent =
            data.stats.contacts;

        document.getElementById("favoriteContacts").textContent =
            data.stats.favorites;

        document.getElementById("totalGroups").textContent =
            data.stats.groups;

        document.getElementById("addedToday").textContent =
            data.stats.addedToday || 0;

        /* ---------- RECENT CONTACTS ---------- */

        loadRecentContacts(data.recentContacts);

    }

    catch (error) {

        console.error(error);

        showToast("Unable to connect to server", "error");

    }

}

/* ===========================================
   RECENT CONTACTS
=========================================== */

function loadRecentContacts(contacts) {

    const tbody = document.getElementById("recentContactsBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (!contacts || contacts.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No Contacts Found
                </td>
            </tr>
        `;

        return;

    }

    contacts.forEach(contact => {

        tbody.innerHTML += `

            <tr>

                <td>${contact.name}</td>

                <td>${contact.phone}</td>

                <td>${contact.email || "-"}</td>

                <td>

                    <button class="edit-btn">

                        Edit

                    </button>

                </td>

            </tr>

        `;

    });

}

/* ===========================================
   SEARCH CONTACTS
=========================================== */

function initSearch() {

    const searchInput = document.querySelector(".search-box input");

    if (!searchInput) return;

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        const rows = document.querySelectorAll("#recentContactsBody tr");

        rows.forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(value)
                    ? ""
                    : "none";

        });

    });

}

/* ===========================================
   FLOATING BUTTON
=========================================== */

function initFloatingButton() {

    const button = document.querySelector(".floating-btn");

    if (!button) return;

    button.addEventListener("mouseenter", () => {

        button.style.transform = "scale(1.1)";

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform = "scale(1)";

    });

}

/* ===========================================
   NOTIFICATIONS
=========================================== */

function initNotifications() {

    const bell = document.querySelector(".icon-btn");

    if (!bell) return;

    bell.addEventListener("click", () => {

        showToast("No new notifications", "info");

    });

}

/* ===========================================
   CARD HOVER
=========================================== */

function initCardHover() {

    const cards = document.querySelectorAll(".stat-card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-10px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0px)";

        });

    });

}

/* ===========================================
   PROFILE
=========================================== */

function initProfile() {

    const profile = document.querySelector(".profile");

    if (!profile) return;

   profile.addEventListener("click", () => {

    window.location.href = "settings.html";

});

}
async function exportContacts() {

    try {

        const response = await fetch("http://localhost:3000/api/contacts", {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {
            showToast("Unable to export contacts", "error");
            return;
        }

        const contacts = data.contacts;

        const headers = [
            "Name",
            "Email",
            "Phone",
            "Company",
            "Group"
        ];

        const rows = contacts.map(contact => [

            contact.name || "",
            contact.email || "",
            contact.phone || "",
            contact.company || "",
            contact.group || ""

        ]);

        const csv = [

            headers,
            ...rows

        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csv], {

            type: "text/csv"

        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "ContactHub_Contacts.csv";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        showToast("Contacts exported successfully", "success");

    }

    catch (err) {

        console.error(err);

        showToast("Export failed", "error");

    }

}

/* ===========================================
   LOGOUT
=========================================== */

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

}