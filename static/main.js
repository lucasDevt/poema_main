// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ================= CONFIG =================
const firebaseConfig = {
    apiKey: "AIzaSyCfA8zQ7j1yN8KUn5jSAvKK2Y7JNv1ov6Y",
    authDomain: "biblioteca-78f44.firebaseapp.com",
    databaseURL: "https://biblioteca-78f44-default-rtdb.firebaseio.com",
    projectId: "biblioteca-78f44",
    storageBucket: "biblioteca-78f44.firebasestorage.app",
    messagingSenderId: "715514751731",
    appId: "1:715514751731:web:0c65f5f5e79d8e878de586"
};


// ================= INIT =================
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const auth = getAuth(app);


// ================= BUSCAR POEMAS =================
function carregarPoemas() {

    const poemasRef = ref(db, "poemas");

    onValue(poemasRef, (snapshot) => {

        const data = snapshot.val();

        if (!data) {

            document.getElementById("poems-grid").innerHTML =
                "<p>Sem poemas ainda...</p>";

            return;
        }

        // transforma objeto em array
        const poems = Object.values(data);

        renderPoems(poems);

    });

}


// ================= RENDER =================
function renderPoems(poems) {

    const grid = document.getElementById("poems-grid");

    const modalContainer =
        document.getElementById("modal-container");

    grid.innerHTML = "";

    modalContainer.innerHTML = "";

    // mais recentes primeiro
    poems.reverse().forEach(poema => {

        // ================= CARD =================
        const card = document.createElement("a");

        card.href = `#modal-${poema.id}`;

        card.className = "card";

        card.innerHTML = `
            <div class="card-image">
                <img src="${poema.imagem}">
            </div>

            <div class="card-overlay"></div>

            <div class="card-content">
                <h3>${poema.titulo}</h3>

                <p>
                    ${poema.poema.slice(0, 50)}...
                </p>
            </div>
        `;

        grid.appendChild(card);


        // ================= MODAL =================
        const modal = document.createElement("div");

        modal.id = `modal-${poema.id}`;

        modal.className = "modal";

        modal.innerHTML = `
            <div class="modal-content">

                <a href="#" class="close-modal">
                    &times;
                </a>

                <div class="modal-poema-header">

                    <div class="modal-capa">
                        <img src="${poema.imagem}">
                    </div>

                    <div class="modal-info">

                        <h3>${poema.titulo}</h3>

                        <div class="modal-autor">
                            por ${poema.autor}
                        </div>

                    </div>

                </div>

                <div class="poema-texto-modal">
                    ${poema.poema}
                </div>

                <div class="reflexao-modal">

                    <div class="reflexao-item-modal">

                        <h4>✍️ O que eu pensei</h4>

                        <p>${poema.ideia}</p>

                    </div>

                    <div class="reflexao-item-modal">

                        <h4>💡 Ideia</h4>

                        <p>${poema.pensamento}</p>

                    </div>

                </div>

            </div>
        `;

        modalContainer.appendChild(modal);

    });

}


// ================= INIT LOAD =================
window.addEventListener("load", () => {

    carregarPoemas();

});


// ================= MODAL LOGIN =================
const loginBtn =
    document.getElementById("sing-in");

const modal =
    document.getElementById("login-modal");

const closeModal =
    document.getElementById("close-modal");


// abrir
loginBtn.addEventListener("click", () => {

    modal.classList.add("active");

});


// fechar
closeModal.addEventListener("click", () => {

    modal.classList.remove("active");

});


// clicar fora
modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.classList.remove("active");

    }

});


// ================= LOGIN =================
const loginForm =
    document.getElementById("login-form");


loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );

        Swal.fire({
            icon: "success",
            title: "Login realizado!",
            text: "Entrando no painel...",
            confirmButtonColor: "#8b5cf6",
            timer: 1800,
            showConfirmButton: false
        });

        setTimeout(() => {

            window.location.href = "/form";

        }, 1800);

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Acesso negado",
            text: "Você não possui permissão para acessar.",
            confirmButtonColor: "#8b5cf6"
        });

    }

});