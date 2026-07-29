const API_URL = "https://contacthub-4si7.onrender.com/api/contacts";

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);

const contactId = params.get("id");

const form = document.getElementById("editContactForm");

const previewImage = document.getElementById("previewImage");

const imageInput = document.getElementById("contactImage");

const uploadBtn = document.getElementById("uploadBtn");

const noteCounter = document.getElementById("noteCounter");

const contactName = document.getElementById("contactName");

const contactEmail = document.getElementById("contactEmail");

const contactPhone = document.getElementById("contactPhone");

const contactCompany = document.getElementById("contactCompany");

const contactJob = document.getElementById("contactJob");

const contactGroup = document.getElementById("contactGroup");

const contactAddress = document.getElementById("contactAddress");

const contactNotes = document.getElementById("contactNotes");

const favoriteToggle = document.getElementById("favoriteToggle");

const backBtn = document.getElementById("backBtn");

const cancelBtn = document.getElementById("cancelBtn");

if (backBtn) {
    backBtn.href = `viewContacts.html?id=${contactId}`;
}

if (cancelBtn) {
    cancelBtn.href = `viewContacts.html?id=${contactId}`;
}

// Image Upload

uploadBtn.addEventListener("click", () => {

    imageInput.click();

});

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {

        previewImage.src = e.target.result;

    };

    reader.readAsDataURL(file);

});

//Load Contact //

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

        previewImage.src =
            contact.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`;

        contactName.value = contact.name || "";

        contactEmail.value = contact.email || "";

        contactPhone.value = contact.phone || "";

        contactCompany.value = contact.company || "";

        contactJob.value = contact.job || "";

        contactGroup.value = contact.group || "";

        contactAddress.value = contact.address || "";

        contactNotes.value = contact.notes || "";

        favoriteToggle.checked = contact.favorite;

        noteCounter.textContent =
            `${contactNotes.value.length} / 500`;

    }

    catch (err) {

        console.error(err);

    }

}

// Update Contact //

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("name", contactName.value);
        formData.append("email", contactEmail.value);
        formData.append("phone", contactPhone.value);
        formData.append("company", contactCompany.value);
        formData.append("job", contactJob.value);
        formData.append("group", contactGroup.value);
        formData.append("address", contactAddress.value);
        formData.append("notes", contactNotes.value);
        formData.append("favorite", favoriteToggle.checked);

        if (imageInput.files.length > 0) {
            formData.append("image", imageInput.files[0]);
        }

        const response = await fetch(`${API_URL}/${contactId}`, {

            method: "PUT",

            headers: {
                Authorization: `Bearer ${token}`
            },

            body: formData

        });

        const data = await response.json();

        if (!response.ok) {

            showToast(data.message, "error");
            return;

        }

        showToast("Contact Updated Successfully!");

        setTimeout(() => {

            window.location.href = `viewContacts.html?id=${contactId}`;

        }, 1200);

    }

    catch (err) {

        console.error(err);
        showToast("Something went wrong", "error");

    }

});

    contactNotes.addEventListener("input", () => {

    noteCounter.textContent =
        `${contactNotes.value.length} / 500`;

});

document.getElementById("resetBtn").addEventListener("click", () => {
    loadContact();
});

//Load// 
window.addEventListener("load", () => {

    loadContact();

});

