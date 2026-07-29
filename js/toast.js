function showToast(message,type="info"){

    let container=document.querySelector(".toast-container");

    if(!container){

        container=document.createElement("div");

        container.className="toast-container";

        document.body.appendChild(container);

    }

    const toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.innerHTML=`
        <span>${message}</span>
        <button>&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        removeToast(toast);

    },4000);

    toast.querySelector("button").onclick=()=>{

        removeToast(toast);

    };

}

function removeToast(toast){

    toast.classList.remove("show");

    setTimeout(()=>{

        toast.remove();

    },300);

}