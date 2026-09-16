/* =====================================================
   CUADRO COMPARATIVO DE OFERTAS
===================================================== */


/* =====================================================
   DATOS INICIALES
===================================================== */

let proveedores = [
    {
        id: 1,
        nombre: "Proveedor 1"
    },
    {
        id: 2,
        nombre: "Proveedor 2"
    }
];

let renglones = [
    {
        id: 1,
        descripcion: "",
        cantidad: 1,
        precios: {}
    }
];

let siguienteProveedorId = 3;
let siguienteRenglonId = 2;


/* =====================================================
   INICIO
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const fecha = document.getElementById("fecha");

    if (fecha) {
        const hoy = new Date();

        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");

        fecha.value = `${año}-${mes}-${dia}`;
    }

    renderizarTabla();
});


/* =====================================================
   DESCRIPCIÓN GENERAL
===================================================== */

function alternarDescripcion() {

    const contenedor =
        document.getElementById("contenedorDescripcion");

    const boton =
        document.getElementById("btnDescripcion");

    if (!contenedor || !boton) {
        return;
    }


    const estaOculto =
        contenedor.classList.contains("oculto");


    if (estaOculto) {

        contenedor.classList.remove("oculto");

        boton.textContent =
            "− Ocultar descripción";

    } else {

        contenedor.classList.add("oculto");

        boton.textContent =
            "＋ Agregar descripción";
    }
}


/* =====================================================
   RENDERIZAR TABLA
===================================================== */

function renderizarTabla() {

    renderizarCabecera();
    renderizarRenglones();
    calcularResultados();
}


/* =====================================================
   CABECERA
===================================================== */

function renderizarCabecera() {

    const filaProveedores = document.getElementById("filaProveedores");
    const filaSubcolumnas = document.getElementById("filaSubcolumnas");

    filaProveedores.innerHTML = `
        <th rowspan="2" class="col-reng">
            RENG.
        </th>

        <th rowspan="2" class="col-descripcion">
            DESCRIPCIÓN
        </th>

        <th rowspan="2" class="col-cantidad">
            CANT.
        </th>
    `;


    filaSubcolumnas.innerHTML = "";


    proveedores.forEach((proveedor, indice) => {

        const esUltimo = indice === proveedores.length - 1;

        const th = document.createElement("th");

        th.colSpan = 2;
        th.className = "proveedor-header";

        th.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;gap:6px;">

                <input
                    type="text"
                    class="proveedor-nombre"
                    value="${escaparHTML(proveedor.nombre)}"
                    onchange="cambiarNombreProveedor(${proveedor.id}, this.value)"
                >

                ${
                    esUltimo
                    ? `
                    <button
                        class="btn-mas no-print"
                        title="Agregar proveedor"
                        onclick="agregarProveedor()">
                        +
                    </button>
                    `
                    : ""
                }

                ${
                    proveedores.length > 2
                    ? `
                    <button
                        class="btn-eliminar no-print"
                        title="Eliminar proveedor"
                        onclick="eliminarProveedor(${proveedor.id})">
                        ×
                    </button>
                    `
                    : ""
                }

            </div>
        `;

        filaProveedores.appendChild(th);


        const subUnitario = document.createElement("th");
        subUnitario.className = "subheader";
        subUnitario.textContent = "UNITARIO";

        const subTotal = document.createElement("th");
        subTotal.className = "subheader";
        subTotal.textContent = "TOTAL";

        filaSubcolumnas.appendChild(subUnitario);
        filaSubcolumnas.appendChild(subTotal);
    });


    filaProveedores.insertAdjacentHTML(
        "beforeend",
        `
        <th rowspan="2" class="col-ganador">
            PROVEEDOR<br>CONVENIENTE
        </th>

        <th rowspan="2" class="col-total-conveniente">
            TOTAL<br>CONVENIENTE
        </th>

        <th rowspan="2" class="col-acciones no-print">
            +
        </th>
        `
    );
}


/* =====================================================
   RENGLONES
===================================================== */

function renderizarRenglones() {

    const cuerpo = document.getElementById("cuerpoTabla");

    cuerpo.innerHTML = "";


    renglones.forEach((renglon, indice) => {

        const tr = document.createElement("tr");

        let html = "";


        /* RENG */
        html += `
            <td>
                <strong>${indice + 1}</strong>
            </td>
        `;


        /* DESCRIPCIÓN */
        html += `
            <td>
                <input
                    type="text"
                    class="campo descripcion-input"
                    value="${escaparHTML(renglon.descripcion)}"
                    placeholder="Descripción del bien o servicio"
                    onchange="cambiarDescripcion(${renglon.id}, this.value)"
                >
            </td>
        `;


        /* CANTIDAD */
        html += `
            <td>
                <input
                    type="number"
                    min="0"
                    step="any"
                    class="campo cantidad-input"
                    value="${renglon.cantidad}"
                    onchange="cambiarCantidad(${renglon.id}, this.value)"
                >
            </td>
        `;


        /* PRECIOS DE PROVEEDORES */
        proveedores.forEach(proveedor => {

            const precio =
                renglon.precios[proveedor.id] !== undefined
                ? renglon.precios[proveedor.id]
                : "";


            const total =
                precio !== ""
                ? Number(precio) * Number(renglon.cantidad || 0)
                : "";


            html += `
                <td
                    id="unitario-${renglon.id}-${proveedor.id}"
                >

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="campo precio-input"
                        value="${precio}"
                        placeholder="$"
                        onchange="cambiarPrecio(${renglon.id}, ${proveedor.id}, this.value)"
                    >

                </td>
            `;


            html += `
                <td
                    id="total-${renglon.id}-${proveedor.id}"
                >
                    ${
                        total !== ""
                        ? formatearMoneda(total)
                        : ""
                    }
                </td>
            `;
        });


        /* GANADOR */
        html += `
            <td
                id="ganador-${renglon.id}"
                class="ganador-texto"
            >
                —
            </td>
        `;


        /* TOTAL CONVENIENTE */
        html += `
            <td
                id="conveniente-${renglon.id}"
                class="ganador-texto"
            >
                —
            </td>
        `;


        /* ACCIONES */
        html += `
            <td class="no-print">

                <div style="display:flex;gap:4px;justify-content:center;">

                    <button
                        class="btn-mas"
                        title="Agregar renglón"
                        onclick="agregarRenglon()">
                        +
                    </button>

                    ${
                        renglones.length > 1
                        ? `
                        <button
                            class="btn-eliminar"
                            title="Eliminar renglón"
                            onclick="eliminarRenglon(${renglon.id})">
                            ×
                        </button>
                        `
                        : ""
                    }

                </div>

            </td>
        `;


        tr.innerHTML = html;

        cuerpo.appendChild(tr);
    });
}


/* =====================================================
   AGREGAR PROVEEDOR
===================================================== */

function agregarProveedor() {

    proveedores.push({
        id: siguienteProveedorId,
        nombre: `Proveedor ${siguienteProveedorId}`
    });

    siguienteProveedorId++;

    renderizarTabla();
}


/* =====================================================
   ELIMINAR PROVEEDOR
===================================================== */

function eliminarProveedor(id) {

    if (proveedores.length <= 2) {
        alert("Debe existir al menos dos proveedores.");
        return;
    }

    const proveedor = proveedores.find(p => p.id === id);

    if (!confirm(`¿Eliminar ${proveedor.nombre}?`)) {
        return;
    }

    proveedores = proveedores.filter(p => p.id !== id);

    renglones.forEach(renglon => {
        delete renglon.precios[id];
    });

    renderizarTabla();
}


/* =====================================================
   CAMBIAR NOMBRE PROVEEDOR
===================================================== */

function cambiarNombreProveedor(id, nombre) {

    const proveedor = proveedores.find(p => p.id === id);

    if (proveedor) {

        proveedor.nombre =
            nombre.trim() !== ""
            ? nombre.trim()
            : `Proveedor ${id}`;
    }

    calcularResultados();
}


/* =====================================================
   AGREGAR RENGLÓN
===================================================== */

function agregarRenglon() {

    const nuevo = {
        id: siguienteRenglonId,
        descripcion: "",
        cantidad: 1,
        precios: {}
    };

    siguienteRenglonId++;

    renglones.push(nuevo);

    renderizarTabla();


    /* Llevar el usuario hacia el nuevo renglón */
    setTimeout(() => {

        const filas =
            document.querySelectorAll("#cuerpoTabla tr");

        if (filas.length > 0) {

            filas[filas.length - 1].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    }, 100);
}


/* =====================================================
   ELIMINAR RENGLÓN
===================================================== */

function eliminarRenglon(id) {

    if (renglones.length <= 1) {
        alert("Debe existir al menos un renglón.");
        return;
    }

    renglones =
        renglones.filter(renglon => renglon.id !== id);

    renderizarTabla();
}


/* =====================================================
   CAMBIAR DESCRIPCIÓN
===================================================== */

function cambiarDescripcion(id, valor) {

    const renglon =
        renglones.find(r => r.id === id);

    if (renglon) {
        renglon.descripcion = valor;
    }
}


/* =====================================================
   CAMBIAR CANTIDAD
===================================================== */

function cambiarCantidad(id, valor) {

    const renglon =
        renglones.find(r => r.id === id);

    if (!renglon) {
        return;
    }

    renglon.cantidad = Number(valor) || 0;

    renderizarTabla();
}


/* =====================================================
   CAMBIAR PRECIO
===================================================== */

function cambiarPrecio(renglonId, proveedorId, valor) {

    const renglon =
        renglones.find(r => r.id === renglonId);

    if (!renglon) {
        return;
    }

    if (valor === "") {

        delete renglon.precios[proveedorId];

    } else {

        renglon.precios[proveedorId] =
            Number(valor);
    }

    renderizarTabla();
}


/* =====================================================
   CALCULAR RESULTADOS
===================================================== */

function calcularResultados() {

    let totalesProveedores = {};

    proveedores.forEach(proveedor => {
        totalesProveedores[proveedor.id] = 0;
    });


    renglones.forEach(renglon => {

        /* Limpiar celdas ganadoras */

        proveedores.forEach(proveedor => {

            const unitario =
                document.getElementById(
                    `unitario-${renglon.id}-${proveedor.id}`
                );

            const total =
                document.getElementById(
                    `total-${renglon.id}-${proveedor.id}`
                );

            if (unitario) {
                unitario.classList.remove("ganador-celda");
            }

            if (total) {
                total.classList.remove("ganador-celda");
            }
        });


        /* Buscar menor */

        let ofertas = [];


        proveedores.forEach(proveedor => {

            const precio =
                renglon.precios[proveedor.id];


            if (
                precio !== undefined &&
                precio !== "" &&
                Number(precio) >= 0
            ) {

                const total =
                    Number(precio) *
                    Number(renglon.cantidad || 0);


                ofertas.push({
                    proveedor: proveedor,
                    unitario: Number(precio),
                    total: total
                });


                totalesProveedores[proveedor.id] += total;
            }

        });


        const ganadorElemento =
            document.getElementById(
                `ganador-${renglon.id}`
            );

        const convenienteElemento =
            document.getElementById(
                `conveniente-${renglon.id}`
            );


        if (ofertas.length === 0) {

            if (ganadorElemento) {
                ganadorElemento.textContent = "—";
            }

            if (convenienteElemento) {
                convenienteElemento.textContent = "—";
            }

            return;
        }


        /* Menor precio */

        const menor =
            Math.min(
                ...ofertas.map(oferta => oferta.total)
            );


        /* Puede haber empate */

        const ganadores =
            ofertas.filter(
                oferta => oferta.total === menor
            );


        if (ganadores.length === 1) {

            const ganador =
                ganadores[0];


            /* Pintar UNITARIO */
            const unitario =
                document.getElementById(
                    `unitario-${renglon.id}-${ganador.proveedor.id}`
                );


            /* Pintar TOTAL */
            const total =
                document.getElementById(
                    `total-${renglon.id}-${ganador.proveedor.id}`
                );


            if (unitario) {
                unitario.classList.add("ganador-celda");
            }

            if (total) {
                total.classList.add("ganador-celda");
            }


            if (ganadorElemento) {

                ganadorElemento.textContent =
                    ganador.proveedor.nombre;
            }


            if (convenienteElemento) {

                convenienteElemento.textContent =
                    formatearMoneda(ganador.total);
            }

        } else {

            /* EMPATE */

            ganadores.forEach(ganador => {

                const unitario =
                    document.getElementById(
                        `unitario-${renglon.id}-${ganador.proveedor.id}`
                    );

                const total =
                    document.getElementById(
                        `total-${renglon.id}-${ganador.proveedor.id}`
                    );

                if (unitario) {
                    unitario.classList.add("ganador-celda");
                }

                if (total) {
                    total.classList.add("ganador-celda");
                }

            });


            if (ganadorElemento) {

                ganadorElemento.textContent =
                    "EMPATE";
            }


            if (convenienteElemento) {

                convenienteElemento.textContent =
                    formatearMoneda(menor);
            }
        }

    });


    renderizarTotales(totalesProveedores);
    calcularPropuestaConveniente(totalesProveedores);
}


/* =====================================================
   TOTALES POR PROVEEDOR
===================================================== */

function renderizarTotales(totalesProveedores) {

    const pie =
        document.getElementById("pieTabla");

    pie.innerHTML = "";


    const tr = document.createElement("tr");


    tr.innerHTML = `
        <td colspan="3" class="total-general">
            TOTAL
        </td>
    `;


    proveedores.forEach(proveedor => {

        const total =
            totalesProveedores[proveedor.id] || 0;


        tr.innerHTML += `
            <td class="total-proveedor">
                TOTAL
            </td>

            <td class="total-proveedor">
                ${formatearMoneda(total)}
            </td>
        `;
    });


    tr.innerHTML += `
        <td class="total-general">
            PROPUESTA
        </td>

        <td class="total-general">
            —
        </td>

        <td class="no-print"></td>
    `;


    pie.appendChild(tr);
}


/* =====================================================
   PROPUESTA CONVENIENTE GENERAL
===================================================== */

function calcularPropuestaConveniente(totalesProveedores) {

    const resultado =
        document.getElementById("resultadoGeneral");


    if (!resultado) {
        return;
    }


    let proveedoresConTotal =
        proveedores
            .map(proveedor => ({
                proveedor: proveedor,
                total:
                    totalesProveedores[proveedor.id] || 0
            }))
            .filter(item => item.total > 0);


    if (proveedoresConTotal.length === 0) {

        resultado.textContent =
            "Complete los precios para obtener el resultado.";

        return;
    }


    const menor =
        Math.min(
            ...proveedoresConTotal.map(item => item.total)
        );


    const ganadores =
        proveedoresConTotal.filter(
            item => item.total === menor
        );


    if (ganadores.length === 1) {

        resultado.innerHTML = `
            <strong>${escaparHTML(ganadores[0].proveedor.nombre)}</strong>
            —
            ${formatearMoneda(ganadores[0].total)}
        `;

    } else {

        resultado.innerHTML = `
            EMPATE —
            ${ganadores
                .map(item =>
                    escaparHTML(item.proveedor.nombre)
                )
                .join(" / ")}
            —
            ${formatearMoneda(menor)}
        `;
    }
}


/* =====================================================
   FORMATEAR MONEDA
===================================================== */

function formatearMoneda(numero) {

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero || 0);
}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   IMPRIMIR
===================================================== */

function imprimirDocumento() {

    window.print();
}


/* =====================================================
   DESCARGAR PDF
===================================================== */

function descargarPDF() {

    const elemento =
        document.getElementById("documento");


    const opciones = {

        margin: 5,

        filename:
            "Cuadro_Comparativo_de_Ofertas.pdf",

        image: {
            type: "jpeg",
            quality: 0.98
        },

        html2canvas: {
            scale: 2,
            useCORS: true
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "landscape"
        },

        pagebreak: {
            mode: [
                "avoid-all",
                "css",
                "legacy"
            ]
        }
    };


    html2pdf()
        .set(opciones)
        .from(elemento)
        .save();
}
