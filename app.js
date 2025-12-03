const API_URL = "https://cedula-rd-server-web.onrender.com";

const cedulaInput = document.getElementById("cedula");
const btn = document.getElementById("btnValidar");

cedulaInput.addEventListener("input", e => {
    let val = e.target.value.replace(/\D/g, '');

    // límite real: 11 dígitos
    val = val.slice(0, 11);

    if (val.length <= 3) {
        e.target.value = val;
    } 
    else if (val.length <= 10) {
        e.target.value = val.slice(0, 3) + "-" + val.slice(3);
    } 
    else {
        e.target.value = 
            val.slice(0, 3) + "-" +
            val.slice(3, 10) + "-" +
            val.slice(10);
    }
});

async function validarCedula() {
    const raw = cedulaInput.value.replace(/\D/g, "");
    const result = document.getElementById("result");

    if (raw.length !== 11) {
        result.style.display = "block";
        result.className = "result error";
        result.innerHTML = "❌ La cédula debe tener 11 dígitos";
        return;
    }

    btn.disabled = true;
    btn.innerHTML = "Validando...";

    try {
        const res = await fetch(`${API_URL}/api/validar/${raw}`);
        const data = await res.json();

        result.style.display = "block";
        result.className = data.valida ? "result success" : "result error";
        result.innerHTML = data.valida
            ? "✔ Cédula válida"
            : "✘ Cédula inválida";

    } catch (err) {
        result.style.display = "block";
        result.className = "result error";
        result.innerHTML = "❌ Error conectando con el servidor";
    }

    btn.disabled = false;
    btn.innerHTML = "Validar";
}
