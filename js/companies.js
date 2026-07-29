// ==========================================
// ELEMENTS
// ==========================================

const companiesGrid = document.querySelector(".companies-grid");
const searchInput = document.getElementById("companySearch");

const totalCompanies = document.getElementById("totalCompanies");
const totalEmployees = document.getElementById("totalEmployees");
const topCompany = document.getElementById("topCompany");
const largestCount = document.getElementById("largestCount");

// ==========================================
// AUTH
// ==========================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// ==========================================
// DATA
// ==========================================

let allCompanies = [];

// ==========================================
// LOAD COMPANIES
// ==========================================

async function loadCompanies() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/contacts",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        const contacts = data.contacts || [];

        const companyMap = {};

        contacts.forEach(contact => {

            const company = contact.company?.trim();

            if (!company) return;

            if (!companyMap[company]) {

                companyMap[company] = [];

            }

            companyMap[company].push(contact);

        });

        allCompanies = Object.keys(companyMap).map(company => ({

            name: company,
            contacts: companyMap[company],
            count: companyMap[company].length

        }));

        updateStats(contacts);

        renderCompanies(allCompanies);

    }

    catch (err) {

        console.error(err);

    }

}

// ==========================================
// STATS
// ==========================================

function updateStats(contacts) {

    totalCompanies.textContent = allCompanies.length;

    totalEmployees.textContent = contacts.length;

    if (allCompanies.length === 0) {

        topCompany.textContent = "-";
        largestCount.textContent = "0";
        return;

    }

    const largest = [...allCompanies].sort((a, b) => b.count - a.count)[0];

    topCompany.textContent = largest.name;

    largestCount.textContent = largest.count;

}

// ==========================================
// RENDER
// ==========================================

function renderCompanies(companies) {

    companiesGrid.innerHTML = "";

    if (companies.length === 0) {

        companiesGrid.innerHTML = `

        <div class="empty-state">

            <h3>No Companies Found</h3>

        </div>

        `;

        return;

    }

    companies.forEach(company => {

        companiesGrid.innerHTML += `

        <div class="company-card">

            <div class="company-header">

                <div class="company-icon">

                    <i class="fa-solid fa-building"></i>

                </div>

                <div class="company-info">

                    <h3>${company.name}</h3>

                    <p>${company.count} Contacts</p>

                </div>

            </div>

            <div class="company-details">

                <div class="detail-row">

                    <span class="detail-title">

                        Contacts

                    </span>

                    <span class="detail-value">

                        ${company.count}

                    </span>

                </div>

            </div>

            <div class="company-actions">

                <button
                    class="edit-btn view-btn"
                    data-company="${company.name}">

                    View Contacts

                </button>

            </div>

        </div>

        `;

    });

    document.querySelectorAll(".view-btn").forEach(button => {

        button.addEventListener("click", () => {

            const company = button.dataset.company;

            window.location.href =
                `contacts.html?company=${encodeURIComponent(company)}`;

        });

    });

}

// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = allCompanies.filter(company =>
        company.name.toLowerCase().includes(value)
    );

    renderCompanies(filtered);

});

// ==========================================
// INIT
// ==========================================

loadCompanies();