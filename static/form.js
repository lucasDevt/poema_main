import { initializeApp }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onValue,
    remove,
    update
}
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    getAuth,
    onAuthStateChanged
}
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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


// ================= PROTEGER PAGINA =================
onAuthStateChanged(auth, (user) => {

    if (!user) {

        alert("Faça login primeiro.");

        window.location.href = "/";

    }

});


// ================= FORM =================
document
    .getElementById("poema_form")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        const file_input =
            document.getElementById("imagem");

        const file = file_input.files[0];

        if (file) {

            const header = new FileReader();

            header.onload = function (e) {

                enviar_poema(e.target.result);

            }

            header.readAsDataURL(file);

        } else {

            enviar_poema(
                "https://i.postimg.cc/mkWcdH69/image.png"
            );

        }

    });


// ================= ENVIAR =================
async function enviar_poema(image_final) {

    const new_poema = {

        id: Date.now(),

        titulo:
            document.getElementById("titulo").value,

        autor:
            document.getElementById("autor").value,

        imagem: image_final,

        poema:
            document.getElementById("poema").value,

        ideia:
            document.getElementById("ideia").value,

        pensamento:
            document.getElementById("pensamento").value
    };

    try {

        await push(
            ref(db, "poemas"),
            new_poema
        );

        alert("Poema salvo no banco de dados.");

        document
            .getElementById("poema_form")
            .reset();

    } catch (error) {

        console.error("Erro ao salvar:", error);

        alert("Erro ao salvar no banco.");

    }

}

// painel admin

const painelBtn = document.getElementById("painel")
const adminModal = document.getElementById("admin-modal")
const closeAdmin = document.getElementById("close-admin")

//abrir painel
painelBtn.addEventListener("click", (e)=>{
    e.preventDefault()
    adminModal.classList.add("active")
    carregarPoemasAdmin()
});

// fechar painel
closeAdmin.addEventListener("click", ()=>{
    adminModal.classList.remove("active")
})

// carregar poemas
function carregarPoemasAdmin(){
    const poemasRef = ref(db,"poemas");
    onValue(poemasRef, (snapshot)=>{
        const data = snapshot.val();
        const grid = document.getElementById("admin-poems-grid");
        grid.innerHTML = "";
        if(!data){
            grid.innerHTML = "<p> Nenhum poema cadastrado <p>";
            return
        }
        const poems = Object.entries(data).map(
            ([key,poema])=>({
                firebaseKey:key,
                ...poema
            })
        )
        renderPoemsAdmin(poems)
    })
}

// renderizar poemas
function renderPoemsAdmin(poems){
    const grid = document.getElementById("admin-poems-grid")
    grid.innerHTML = ""
    poems.reverse().forEach(poema =>{
        const card = document.createElement("div")
        card.className = "card"
        card.innerHTML = `
            <div class = "card-image">
            <img src = "${poema.imagem}"/>
            </div>
            <div class = "card-overlay"></div>
            <div class = "card-content">
            <h3>${poema.titulo}</h3>
            <p>${poema.poema.slice(0,50)}...</p>
            <div style = "margin-top:15px; display: flex;">
            <button class = "editar-btn" data-id = "${poema.firebaseKey}">Editar 🖊</button>
            <button class = "deletar-btn" data-id = "${poema.firebaseKey}">Deletar 🗑</button>
            </div>
            </div>
        `;
        grid.appendChild(card)
    })
}

// excluir
document.addEventListener("click", async (e)=>{
    if(e.target.classList.contains("deletar-btn")){
        const id = e.target.dataset.id;
        const confirmar = confirm("Deseja mesmno excluir este poema?")
        if (!confirmar) return;
        try {
            await remove(ref(db,`poemas/${id}`))
            alert("poema excluido")
        } catch (error) {
            console.error(error);
            alert("erro ao excluir")
        }
    }
})

//editar
let poema_editado = null

document.addEventListener("click", (e)=>{
   const btn = e.target.closest(".editar-btn")
   if (!btn) return;
   poema_editado = btn.dataset.id;
   const poemaRef = ref(db,`poemas/${poema_editado}`);
   onValue(poemaRef,(snapshot)=>{
    const poema = snapshot.val();
    if (!poema) return;
    document.getElementById("edit-id").value = poema_editado;
    document.getElementById("edit-titulo").value = poema.titulo || "";
    document.getElementById("edit-autor").value = poema.autor || "";
    document.getElementById("edit-poema").value = poema.poema || "";
    document.getElementById("edit-pensamento").value = poema.pensamento || "";
    document.getElementById("edit-ideia").value = poema.ideia || "";
    document.getElementById("edit-preview").value = poema.imagem || "";
    document.getElementById("editar-modal").classList.add("active")
   },{onlyOnce:true})
})

