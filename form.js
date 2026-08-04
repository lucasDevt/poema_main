import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCfA8zQ7j1yN8KUn5jSAvKK2Y7JNv1ov6Y",
    authDomain: "biblioteca-78f44.firebaseapp.com",
    databaseURL: "https://biblioteca-78f44-default-rtdb.firebaseio.com",
    projectId: "biblioteca-78f44",
    storageBucket: "biblioteca-78f44.firebasestorage.app",
    messagingSenderId: "715514751731",
    appId: "1:715514751731:web:0c65f5f5e79d8e878de586"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app)

document.getElementById("poema_form").addEventListener("submit", function (e) {
    e.preventDefault();
    const file_input = document.getElementById("imagem");
    const file = file_input.files[0]

    if (file) {
        const header = new FileReader();
        header.onload = function (e) {
            enviar_poema(e.target.result)
        }
        header.readAsDataURL(file)
    } else {
        enviar_poema("https://i.postimg.cc/mkWcdH69/image.png")
    }
})


async function enviar_poema(image_final) {
    const new_poema = {
        id: Date.now(),
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        imagem: image_final,
        poema: document.getElementById("poema").value,
        ideia: document.getElementById("ideia").value,
        pensamento: document.getElementById("pensamento").value
    };

    try {
        await push(ref(db, "poemas"), new_poema);
        alert("Poema salvo no banco de dados.");
        document.getElementById("poema_form").reset();
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar no banco.");
    }
}