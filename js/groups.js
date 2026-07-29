const API_URL = "http://localhost:3000/api/contacts";
const token = localStorage.getItem("token");

const GROUPS = [
    {
        name: "Friends",
        icon: "fa-user-group"
    },
    {
        name: "Family",
        icon: "fa-house"
    },
    {
        name: "Work",
        icon: "fa-briefcase"
    },
    {
        name: "Clients",
        icon: "fa-handshake"
    },
    {
        name: "Others",
        icon: "fa-folder"
    }
];

let allGroups = [];

document.addEventListener("DOMContentLoaded", () => {

    loadGroups();

    initSearch();

});

async function loadGroups() {

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

        const contacts = data.contacts;

        allGroups = GROUPS.map(group => {

            const count = contacts.filter(contact =>
                contact.group === group.name
            ).length;

            return {

                ...group,

                count

            };

        });

        renderGroups(allGroups);

        updateStats(allGroups);

    }

    catch (error) {

        console.error(error);

        showToast("Unable to load groups.", "error");

    }

}

function renderGroups(groups) {

    const container = document.getElementById("groupsContainer");

    container.innerHTML = "";

    groups.forEach(group => {

        container.innerHTML += `

        <div class="group-card">

            <div class="group-icon">

                <i class="fa-solid ${group.icon}"></i>

            </div>

            <h3>${group.name}</h3>

            <p>${group.count} Contacts</p>

            <div class="group-actions">

                <button
                    class="edit-btn view-btn"
                    data-group="${group.name}">

                    View Contacts

                </button>

            </div>

        </div>

        `;

    });

    initView();

}

function updateStats(groups) {

    document.getElementById("totalGroups").textContent =
        groups.length;

    document.getElementById("emptyGroups").textContent =
        groups.filter(group => group.count === 0).length;

    const largest =
        groups.reduce((a, b) =>
            a.count > b.count ? a : b
        );

    document.getElementById("largestGroup").textContent =
        `${largest.name} (${largest.count})`;

}

function initView() {

    document.querySelectorAll(".view-btn").forEach(button => {

        button.onclick = function () {

            window.location.href =
                `contacts.html?group=${encodeURIComponent(button.dataset.group)}`;

        };

    });

}

function initSearch() {

    const search =
        document.getElementById("groupSearch");

    if (!search) return;

    search.addEventListener("keyup", () => {

        const value =
            search.value.toLowerCase();

        const filtered =
            allGroups.filter(group =>
                group.name.toLowerCase().includes(value)
            );

        renderGroups(filtered);

    });

}