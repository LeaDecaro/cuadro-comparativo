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
   CONFIGURACIÓN
===================================================== */

let mostrarDescripcion = false;


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
   RENDERIZAR TABLA
===================================================== */

function renderizarTabla() {

    renderizarCabecera();
    renderizarRenglones();
    calcularResultados();
}


/* =====================================================
   DESCRIPCIÓN
===================================================== */

function alternarDescripcion() {

    mostrarDescripcion = !mostrarDescripcion;

    const boton =
        document.getElementById("btnDescripcion");

    if (boton) {

        boton.textContent =
            mostrarDescripcion
            ? "− Ocultar descripción"
            : "＋ Agregar descripción";
    }

    renderizarTabla();
}


/* =====================================================
   CABECERA
===================================================== */

function renderizarCabecera() {

    const filaProveedores =
        document.getElementById("filaProveedores");

    const filaSubcolumnas =
        document.getElementById("filaSubcolumnas");

    filaProveedores.innerHTML = "";
    filaSubcolumnas.innerHTML = "";


    /* RENG */

    filaProveedores.insertAdjacentHTML(
        "beforeend",
        `
        <th rowspan="2" class="col-reng">
            RENG.
        </th>
        `
    );


    /* DESCRIPCIÓN */

    if (mostrarDescripcion) {

        filaProveedores.insertAdjacentHTML(
            "beforeend",
            `
            <th rowspan="2" class="col-descripcion">
                DESCRIPCIÓN
            </th>
            `
        );
    }


    /* CANTIDAD */

    filaProveedores.insertAdjacentHTML(
        "beforeend",
        `
        <th rowspan="2" class="col-cantidad">
            CANT.
        </th>
        `
    );


    /* PROVEEDORES */

    proveedores.forEach((proveedor, indice) => {

        const esUltimo =
            indice === proveedores.length - 1;

        const th =
            document.createElement("th");

        th.colSpan = 2;
        th.className = "proveedor-header";

        th.innerHTML = `
            <div class="proveedor-header-contenido">

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


        /* UNITARIO */

        const subUnitario =
            document.createElement("th");

        subUnitario.className =
            "subheader subheader-unitario";

        subUnitario.textContent =
            "UNITARIO";

        filaSubcolumnas.appendChild(
            subUnitario
        );


        /* TOTAL */

        const subTotal =
            document.createElement("th");

        subTotal.className =
            "subheader subheader-total";

        subTotal.textContent =
            "TOTAL";

        filaSubcolumnas.appendChild(
            subTotal
        );

    });


    /* COLUMNA DE ACCIONES */

    filaProveedores.insertAdjacentHTML(
        "beforeend",
        `
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

    const cuerpo =
        document.getElementById("cuerpoTabla");

    cuerpo.innerHTML = "";


    renglones.forEach((renglon, indice) => {

        const tr =
            document.createElement("tr");

        let html = "";


        /* RENG */

        html += `
            <td class="celda-renglon">
                <strong>${indice + 1}</strong>
            </td>
        `;


        /* DESCRIPCIÓN */

        if (mostrarDescripcion) {

            html += `
                <td class="celda-descripcion">

                    <input
                        type="text"
                        class="campo descripcion-input"
                        value="${escaparHTML(renglon.descripcion)}"
                        placeholder="Descripción"
                        onchange="cambiarDescripcion(${renglon.id}, this.value)"
                    >

                </td>
            `;
        }


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


        /* PROVEEDORES */

        proveedores.forEach(proveedor => {

            const precio =
                renglon.precios[proveedor.id] !== undefined
                ? renglon.precios[proveedor.id]
                : "";


            const total =
                precio !== ""
                ? Number(precio) * Number(renglon.cantidad || 0)
                : "";


            /* UNITARIO */

            html += `
                <td
                    class="celda-precio"
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


            /* TOTAL */

            html += `
                <td
                    class="celda-precio"
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


        /* ACCIONES */

        html += `
            <td class="columna-acciones no-print">

                <div class="acciones-renglon">

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

        alert(
            "Debe existir al menos dos proveedores."
        );

        return;
    }


    const proveedor =
        proveedores.find(
            p => p.id === id
        );


    if (!confirm(
        `¿Eliminar ${proveedor.nombre}?`
    )) {
        return;
    }


    proveedores =
        proveedores.filter(
            p => p.id !== id
        );


    renglones.forEach(renglon => {

        delete renglon.precios[id];

    });


    renderizarTabla();
}


/* =====================================================
   CAMBIAR NOMBRE
===================================================== */

function cambiarNombreProveedor(
    id,
    nombre
) {

    const proveedor =
        proveedores.find(
            p => p.id === id
        );


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


    setTimeout(() => {

        const filas =
            document.querySelectorAll(
                "#cuerpoTabla tr"
            );


        if (filas.length > 0) {

            filas[filas.length - 1]
                .scrollIntoView({
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

        alert(
            "Debe existir al menos un renglón."
        );

        return;
    }


    renglones =
        renglones.filter(
            renglon =>
                renglon.id !== id
        );


    renderizarTabla();
}


/* =====================================================
   CAMBIAR DESCRIPCIÓN
===================================================== */

function cambiarDescripcion(
    id,
    valor
) {

    const renglon =
        renglones.find(
            r => r.id === id
        );


    if (renglon) {

        renglon.descripcion = valor;
    }
}


/* =====================================================
   CAMBIAR CANTIDAD
===================================================== */

function cambiarCantidad(
    id,
    valor
) {

    const renglon =
        renglones.find(
            r => r.id === id
        );


    if (!renglon) {
        return;
    }


    renglon.cantidad =
        Number(valor) || 0;


    renderizarTabla();
}


/* =====================================================
   CAMBIAR PRECIO
===================================================== */

function cambiarPrecio(
    renglonId,
    proveedorId,
    valor
) {

    const renglon =
        renglones.find(
            r => r.id === renglonId
        );


    if (!renglon) {
        return;
    }


    if (valor === "") {

        delete renglon.precios[
            proveedorId
        ];

    } else {

        renglon.precios[
            proveedorId
        ] = Number(valor);
    }


    renderizarTabla();
}


/* =====================================================
   CALCULAR RESULTADOS
===================================================== */

function calcularResultados() {

    let totalesProveedores = {};


    proveedores.forEach(proveedor => {

        totalesProveedores[
            proveedor.id
        ] = 0;

    });


    let resultadosPorRenglon = [];


    renglones.forEach(renglon => {

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

                unitario.classList.remove(
                    "ganador-celda"
                );
            }


            if (total) {

                total.classList.remove(
                    "ganador-celda"
                );
            }

        });


        let ofertas = [];


        proveedores.forEach(proveedor => {

            const precio =
                renglon.precios[
                    proveedor.id
                ];


            if (
                precio !== undefined &&
                precio !== "" &&
                Number(precio) >= 0
            ) {

                const total =
                    Number(precio) *
                    Number(
                        renglon.cantidad || 0
                    );


                ofertas.push({

                    proveedor: proveedor,

                    unitario: Number(precio),

                    total: total

                });


                totalesProveedores[
                    proveedor.id
                ] += total;
            }

        });


        if (ofertas.length === 0) {

            resultadosPorRenglon.push({

                renglon: renglon,

                ganador: null,

                precio: null,

                empate: false

            });

            return;
        }


        const menor =
            Math.min(
                ...ofertas.map(
                    oferta =>
                        oferta.total
                )
            );


        const ganadores =
            ofertas.filter(
                oferta =>
                    oferta.total === menor
            );


        if (ganadores.length === 1) {

            const ganador =
                ganadores[0];


            const unitario =
                document.getElementById(
                    `unitario-${renglon.id}-${ganador.proveedor.id}`
                );


            const total =
                document.getElementById(
                    `total-${renglon.id}-${ganador.proveedor.id}`
                );


            if (unitario) {

                unitario.classList.add(
                    "ganador-celda"
                );
            }


            if (total) {

                total.classList.add(
                    "ganador-celda"
                );
            }


            resultadosPorRenglon.push({

                renglon: renglon,

                ganador: ganador.proveedor,

                precio: ganador.total,

                empate: false

            });

        } else {

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

                    unitario.classList.add(
                        "ganador-celda"
                    );
                }


                if (total) {

                    total.classList.add(
                        "ganador-celda"
                    );
                }

            });


            resultadosPorRenglon.push({

                renglon: renglon,

                ganador:
                    ganadores.map(
                        g => g.proveedor
                    ),

                precio: menor,

                empate: true

            });

        }

    });


    renderizarTotales(
        totalesProveedores
    );


    renderizarResultadosRenglones(
        resultadosPorRenglon
    );
}


/* =====================================================
   RESULTADO POR RENGLÓN
===================================================== */

function renderizarResultadosRenglones(
    resultados
) {

    const cuerpo =
        document.getElementById(
            "resultadosRenglones"
        );


    cuerpo.innerHTML = "";


    resultados.forEach(
        (resultado, indice) => {

            const tr =
                document.createElement("tr");


            let proveedorTexto = "—";


            if (resultado.ganador) {

                if (resultado.empate) {

                    proveedorTexto =
                        resultado.ganador
                            .map(
                                proveedor =>
                                    escaparHTML(
                                        proveedor.nombre
                                    )
                            )
                            .join(" / ");

                } else {

                    proveedorTexto =
                        escaparHTML(
                            resultado.ganador.nombre
                        );
                }
            }


            let precioTexto = "—";


            if (
                resultado.precio !== null
            ) {

                precioTexto =
                    formatearMoneda(
                        resultado.precio
                    );
            }


            tr.innerHTML = `

                <td>
                    ${indice + 1}
                </td>

                <td class="resultado-proveedor">
                    ${proveedorTexto}
                </td>

                <td class="resultado-precio">
                    ${precioTexto}
                </td>

            `;


            cuerpo.appendChild(tr);

        }
    );
}


/* =====================================================
   TOTALES
===================================================== */

function renderizarTotales(
    totalesProveedores
) {

    const pie =
        document.getElementById(
            "pieTabla"
        );


    pie.innerHTML = "";


    const tr =
        document.createElement("tr");


    const colspanInicial =
        mostrarDescripcion
        ? 3
        : 2;


    tr.innerHTML = `

        <td
            colspan="${colspanInicial}"
            class="total-general">
            TOTAL
        </td>

    `;


    proveedores.forEach(proveedor => {

        const total =
            totalesProveedores[
                proveedor.id
            ] || 0;


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

        <td class="no-print"></td>

    `;


    pie.appendChild(tr);
}


/* =====================================================
   FORMATEAR MONEDA
===================================================== */

function formatearMoneda(numero) {

    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(numero || 0);
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
   PDF
===================================================== */

function descargarPDF() {

    const elemento =
        document.getElementById(
            "documento"
        );


    const opciones = {

        margin: [
            5,
            5,
            5,
            5
        ],

        filename:
            "Cuadro_Comparativo_de_Ofertas.pdf",

        image: {

            type: "jpeg",

            quality: 0.95

        },

        html2canvas: {

            scale: 2,

            useCORS: true,

            backgroundColor: "#ffffff",

            scrollX: 0,

            scrollY: 0

        },

        jsPDF: {

            unit: "mm",

            format: "a4",

            orientation: "portrait"

        },

        pagebreak: {

            mode: [
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
