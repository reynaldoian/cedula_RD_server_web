const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("public"));

/**
 * Validación Oficial de Cédula Dominicana (11 dígitos)
 * Algoritmo Módulo 10 (multiplicadores 1,2,...)
 * 
 * Ejemplo: 40223084357
 */
function validarCedula(cedula) {
    // Debe tener exactamente 11 dígitos
    if (!/^\d{11}$/.test(cedula)) {
        return false;
    }

    // Multiplicadores oficiales (11)
    const multiplicadores = [1,2,1,2,1,2,1,2,1,2,1];
    let suma = 0;

    for (let i = 0; i < 11; i++) {
        let valor = Number(cedula[i]) * multiplicadores[i];

        // Si el resultado es mayor que 9 (2 dígitos), sumar dígitos
        // Ejemplo: 16 -> 1 + 6 = 7
        if (valor > 9) {
            valor = Math.floor(valor / 10) + (valor % 10);
        }

        suma += valor;
    }

    // Válida si la suma es múltiplo de 10
    return suma % 10 === 0;
}

// ----------------------
//     Endpoint API
// ----------------------
app.get("/api/validar/:cedula", (req, res) => {
    // Limpiar guiones o caracteres
    const cedula = (req.params.cedula || '').replace(/\D/g, '');

    const valida = validarCedula(cedula);

    res.json({
        cedula: cedula,
        valida: valida,
        mensaje: valida 
            ? "Cédula válida según módulo 10 (República Dominicana)"
            : "Cédula inválida según módulo 10 (República Dominicana)"
    });
});

// ----------------------
//   Estado del servidor
// ----------------------
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Servicio de validación activo",
        timestamp: new Date().toISOString()
    });
});

// ----------------------
//  Iniciar servidor
// ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("==============================================");
    console.log("  🚀 SERVICIO WEB DE VALIDACIÓN DE CÉDULA RD  ");
    console.log("==============================================");
    console.log(`  ➤ Puerto: ${PORT}`);
    console.log(`  ➤ Health: http://localhost:${PORT}/api/health`);
    console.log(`  ➤ Validar: http://localhost:${PORT}/api/validar/00100000001`);
    console.log("==============================================");
});
