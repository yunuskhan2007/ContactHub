function createContactCard(contact) {

    return `

    <div class="contact-card" data-id="${contact._id}">

        ${contact.favorite ? `

        <span class="favorite-badge">

            <i class="fa-solid fa-star"></i>

        </span>

        ` : ""}

        <img
            src="${contact.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(contact.name) + "&background=4F46E5&color=fff"}"
            alt="${contact.name}">

        <h3>${contact.name}</h3>

        <p>

            <i class="fa-solid fa-phone"></i>

            ${contact.phone}

        </p>

        <p>

            <i class="fa-solid fa-envelope"></i>

            ${contact.email || "-"}

        </p>

        <span class="group-tag">

            ${contact.group || "Others"}

        </span>

       <div class="contact-actions">

    <button
        class="favorite-btn"
        data-id="${contact._id}"
        title="Favorite">

        <i class="${contact.favorite
            ? "fa-solid"
            : "fa-regular"} fa-star"></i>

    </button>

    <button
        class="view-btn"
        data-id="${contact._id}"
        title="View">

        <i class="fa-solid fa-eye"></i>

    </button>

    <button
        class="edit-btn"
        data-id="${contact._id}"
        title="Edit">

        <i class="fa-solid fa-pen"></i>

    </button>

    <button
        class="delete-btn"
        data-id="${contact._id}"
        title="Delete">

        <i class="fa-solid fa-trash"></i>

    </button>

</div>

    `;

}