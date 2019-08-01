addEventListener("load", asignarManejadores, false);
var personajes = [];
var personajeSeleccionado = {};
var casas = ["Stark", "Targaryen", "Lannister"];
function asignarManejadores() {
    document.getElementById("btnGetPersonajes").addEventListener("click", traerPersonajes, false);
    document.getElementById("btnAltaPersonaje").addEventListener("click", altaPersonaje, false);
    document.getElementById("btnEditarPersonaje").addEventListener("click", editarPersonaje, false);
}
function activarMenu(elemento) {
    if (document.getElementsByClassName("active")[0]) {
        document.getElementsByClassName("active")[0].removeAttribute("class");
    }
    elemento.setAttribute("class", "active");
}
function traerPersonajes() {
    activarMenu(document.getElementById("btnGetPersonajes"));
    var storage = JSON.parse(localStorage.getItem("personajes"));
    document.getElementById("info").innerHTML = "";
    personajes = [];
    if (storage == null) {
        personajes.push("");
    }
    else {
        personajes = storage;
    }
    crearTabla();
    crearFormulario();
    document.getElementById("btnGetPersonajes").style.pointerEvents = "auto";
    document.getElementById("btnAltaPersonaje").style.pointerEvents = "auto";
}
function opcionAgregarPersonaje() {
    agregarPersonaje(personajeEditado());
}
function personajeEditado() {
    var personaje = {};
    for (var atributo in personajes[0]) {
        switch (atributo) {
            case "casa":
                for (var i = 0; i < casas.length; i++) {
                    if (document.getElementById("opt" + casas[i]).checked) {
                        personaje["casa"] = casas[i];
                    }
                }
                break;
            case "traidor":
                personaje["traidor"] = document.getElementById("chkTraidor").checked;
                break;
            default:
                var atributoCapitalizado = atributo.charAt(0).toUpperCase() + atributo.slice(1).toLowerCase();
                personaje[atributo] = document.getElementById("txt" + atributoCapitalizado).value;
                break;
        }
    }
    return personaje;
}
function agregarPersonaje(personaje) {
    var nuevoPersonaje = [];
    var proximoID = parseInt(localStorage.getItem("ID"));
    if (isNaN(proximoID)) {
        proximoID = 20000;
    }
    personaje.id = proximoID;
    nuevoPersonaje.push(personaje);
    ocultarFormulario();
    crearDetalle(document.getElementById("tablaPersonajes"), nuevoPersonaje);
    if (personajes[0].id == null) {
        personajes[0] = personaje;
    }
    else {
        personajes.push(personaje);
    }
    proximoID++;
    localStorage.setItem("personajes", JSON.stringify(personajes));
    localStorage.setItem("ID", proximoID.toString());
}
function opcionBorrarPersonaje() {
    borrarPersonaje(personajeSeleccionado);
}
function borrarPersonaje(personaje) {
    var index = personajes.findIndex(function (per) {
        return per.id == personaje.id;
    });
    if (index != -1) {
        personajes.splice(index, 1);
        alert("Personaje:\n\n" + personajeToString(personaje) + "\n\nfue borrada de la tabla");
        borrarFilaSeleccionada(document.getElementById("tablaPersonajes"));
    }
    ocultarFormulario();
    localStorage.setItem("personajes", JSON.stringify(personajes));
}
function opcionModificarPersonaje() {
    modificarPersonaje(personajeSeleccionado, personajeEditado());
}
function modificarPersonaje(personaPre, personaPost) {
    var index = personajes.findIndex(function (per) {
        return per.id == personaPost.id;
    });
    if (index != -1) {
        personajes.splice(index, 1);
        personajes.push(personaPost);
        alert("Personaje:\n\n" + personajeToString(personaPre) + "\n\nfue modificada a:\n\n" + personajeToString(personaPost));
        modificarFilaSeleccionada(personaPost);
    }
    ocultarFormulario();
    localStorage.setItem("personajes", JSON.stringify(personajes));
}
function personajeToString(personaje) {
    var texto = "";
    var retornoCarro = false;
    for (var atributo in personaje) {
        if (retornoCarro) {
            texto += "\n";
        }
        else {
            retornoCarro = true;
        }
        if (atributo == "traidor" && personaje[atributo]) {
            texto += atributo.toUpperCase() + ": Si";
        }
        else if (atributo == "traidor" && !personaje[atributo]) {
            texto += atributo.toUpperCase() + ": No";
        }
        else {
            texto += atributo.toUpperCase() + ": " + personaje[atributo];
        }
    }
    return texto;
}
function crearTabla() {
    var tablaPersonajes = document.createElement("table");
    var puedeCrearDetalle = true;
    var div = document.getElementById("info");
    tablaPersonajes.setAttribute("border", "1px");
    tablaPersonajes.style.borderCollapse = "collapse";
    tablaPersonajes.setAttribute("id", "tablaPersonajes");
    tablaPersonajes.setAttribute("class", "tablaPersonajes");
    div.appendChild(tablaPersonajes);
    if (typeof personajes[0] != "object") {
        personajes[0] = { "id": null, "nombre": null, "apellido": null, "edad": null, "casa": null, "traidor": null };
        puedeCrearDetalle = false;
    }
    crearCabecera(tablaPersonajes);
    if (puedeCrearDetalle) {
        crearDetalle(tablaPersonajes, personajes);
    }
}
function crearFormulario() {
    var div = document.getElementById("info");
    var formulario = document.createElement("form");
    var grupo = document.createElement("fieldset");
    var leyenda = document.createElement("legend");
    var botonAgregar = document.createElement("input");
    var botonModificar = document.createElement("input");
    var botonBorrar = document.createElement("input");
    var botonCancelar = document.createElement("input");
    formulario.setAttribute("action", "#");
    formulario.setAttribute("id", "formularioPersonajes");
    formulario.style.display = "none";
    div.appendChild(formulario);
    formulario.appendChild(grupo);
    grupo.appendChild(leyenda);
    leyenda.textContent = "Personaje";
    for (var atributo in personajes[0]) {
        switch (atributo) {
            case "casa":
                var grupoCasa = document.createElement("fieldset");
                var leyendaCasa = document.createElement("legend");
                grupo.appendChild(grupoCasa);
                grupoCasa.appendChild(leyendaCasa);
                grupoCasa.setAttribute("class", "grupoInterno");
                leyendaCasa.textContent = "Casa";
                for (var i = 0; i < casas.length; i++) {
                    var etiquetaCasa = document.createElement("label");
                    var optButton = document.createElement("input");
                    etiquetaCasa.setAttribute("for", "opt" + casas[i]);
                    etiquetaCasa.textContent = casas[i];
                    optButton.setAttribute("type", "radio");
                    optButton.setAttribute("id", "opt" + casas[i]);
                    optButton.setAttribute("name", "casa");
                    optButton.setAttribute("value", casas[i]);
                    optButton.textContent = " " + casas[i];
                    grupoCasa.appendChild(optButton);
                    grupoCasa.appendChild(etiquetaCasa);
                    grupoCasa.appendChild(document.createElement("br"));
                }
                break;
            case "traidor":
                var grupoTraidor = document.createElement("fieldset");
                var chkTraidor = document.createElement("input");
                var etiquetaTraidor = document.createElement("label");
                grupoTraidor.setAttribute("class", "grupoInterno");
                grupo.appendChild(grupoTraidor);
                chkTraidor.setAttribute("type", "checkbox");
                chkTraidor.setAttribute("id", "chkTraidor");
                chkTraidor.setAttribute("name", "traidor");
                chkTraidor.setAttribute("value", "traidor");
                chkTraidor.textContent = "Es Traidor";
                etiquetaTraidor.setAttribute("for", "chkTraidor");
                etiquetaTraidor.textContent = "Es Traidor";
                grupoTraidor.appendChild(etiquetaTraidor);
                grupoTraidor.appendChild(chkTraidor);
                break;
            default:
                var cuadroTexto = document.createElement("input");
                var etiqueta = document.createElement("label");
                var atributoCapitalizado = atributo.charAt(0).toUpperCase() + atributo.slice(1).toLowerCase();
                etiqueta.setAttribute("for", "txt" + atributoCapitalizado);
                etiqueta.textContent = atributoCapitalizado + ": ";
                cuadroTexto.setAttribute("type", "text");
                cuadroTexto.setAttribute("id", "txt" + atributoCapitalizado);
                if (atributo === "id") {
                    cuadroTexto.setAttribute("readonly", "");
                }
                grupo.appendChild(etiqueta);
                grupo.appendChild(cuadroTexto);
                break;
        }
    }
    botonAgregar.setAttribute("type", "button");
    botonAgregar.setAttribute("id", "btnAgregar");
    botonAgregar.value = "Agregar";
    botonAgregar.addEventListener("click", opcionAgregarPersonaje, false);
    botonModificar.setAttribute("type", "button");
    botonModificar.setAttribute("id", "btnModificar");
    botonModificar.value = "Modificar";
    botonModificar.addEventListener("click", opcionModificarPersonaje, false);
    botonBorrar.setAttribute("type", "button");
    botonBorrar.setAttribute("id", "btnBorrar");
    botonBorrar.value = "Borrar";
    botonBorrar.addEventListener("click", opcionBorrarPersonaje, false);
    botonCancelar.setAttribute("type", "button");
    botonCancelar.setAttribute("id", "btnCancelar");
    botonCancelar.value = "Cancelar";
    botonCancelar.addEventListener("click", ocultarFormulario, false);
    grupo.appendChild(botonAgregar);
    grupo.appendChild(botonModificar);
    grupo.appendChild(botonBorrar);
    grupo.appendChild(botonCancelar);
}
function crearCabecera(tablaPersonajes) {
    var filaCabecera = document.createElement("tr");
    var columna;
    tablaPersonajes.appendChild(filaCabecera);
    for (var atributo in personajes[0]) {
        columna = document.createElement("th");
        columna.textContent = atributo;
        filaCabecera.appendChild(columna);
    }
}
function crearDetalle(tablaPersonajes, datos) {
    for (var i = 0; i < datos.length; i++) {
        var filaDetalle = document.createElement("tr");
        var atributo;
        var columna;
        filaDetalle.addEventListener("click", seleccionarFila, false);
        tablaPersonajes.appendChild(filaDetalle);
        for (atributo in datos[i]) {
            columna = document.createElement("td");
            columna.setAttribute("class", atributo);
            if (atributo == "traidor") {
                if (datos[i][atributo]) {
                    columna.textContent = "Si";
                }
                else {
                    columna.textContent = "No";
                }
            }
            else {
                columna.textContent = datos[i][atributo];
            }
            filaDetalle.appendChild(columna);
        }
    }
}
function seleccionarFila() {
    document.getElementById("btnEditarPersonaje").style.pointerEvents = "auto";
    blanquearFila();
    this.setAttribute("id", "filaSeleccionada");
    for (var i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].getAttribute("class") == "traidor") {
            personajeSeleccionado[this.childNodes[i].getAttribute("class")] = (this.childNodes[i].textContent == "Si");
        }
        else {
            personajeSeleccionado[this.childNodes[i].getAttribute("class")] = this.childNodes[i].textContent;
        }
    }
}
function blanquearFila() {
    var filaSeleccionada = document.getElementById("filaSeleccionada");
    if (filaSeleccionada) {
        filaSeleccionada.removeAttribute("id");
    }
}
function borrarFilaSeleccionada(tabla) {
    tabla.removeChild(document.getElementById("filaSeleccionada"));
}
function modificarFilaSeleccionada(datos) {
    var filaSeleccionada = document.getElementById("filaSeleccionada");
    for (var i = 0; i < filaSeleccionada.childNodes.length; i++) {
        if (filaSeleccionada.childNodes[i].getAttribute("class") == "traidor") {
            if (datos[filaSeleccionada.childNodes[i].getAttribute("class")]) {
                filaSeleccionada.childNodes[i].textContent = "Si";
            }
            else {
                filaSeleccionada.childNodes[i].textContent = "No";
            }
        }
        else {
            filaSeleccionada.childNodes[i].textContent = datos[filaSeleccionada.childNodes[i].getAttribute("class")];
        }
    }
}
function altaPersonaje() {
    activarMenu(document.getElementById("btnAltaPersonaje"));
    document.getElementById("btnAltaPersonaje").style.pointerEvents = "none";
    document.getElementById("btnEditarPersonaje").style.pointerEvents = "none";
    document.getElementById("tablaPersonajes").style.display = "none";
    document.getElementById("formularioPersonajes").style.display = "initial";
    mostrarFormulario();
}
function editarPersonaje() {
    activarMenu(document.getElementById("btnEditarPersonaje"));
    document.getElementById("btnAltaPersonaje").style.pointerEvents = "none";
    document.getElementById("btnEditarPersonaje").style.pointerEvents = "none";
    document.getElementById("tablaPersonajes").style.display = "none";
    document.getElementById("formularioPersonajes").style.display = "initial";
    mostrarFormulario(personajeSeleccionado);
}
function mostrarFormulario() {
    var datos;
    if (typeof arguments[0] == "object") {
        datos = arguments[0];
        document.getElementById("btnAgregar").style.display = "none";
        document.getElementById("btnModificar").style.display = "initial";
        document.getElementById("btnBorrar").style.display = "initial";
    }
    else {
        document.getElementById("btnAgregar").style.display = "initial";
        document.getElementById("btnModificar").style.display = "none";
        document.getElementById("btnBorrar").style.display = "none";
    }
    for (var atributo in personajes[0]) {
        var atributoCapitalizado = atributo.charAt(0).toUpperCase() + atributo.slice(1).toLowerCase();
        switch (atributo) {
            case "casa":
                if (typeof datos == "object") {
                    for (var i = 0; i < casas.length; i++) {
                        if (casas[i] == datos[atributo]) {
                            document.getElementById("opt" + casas[i]).checked = true;
                        }
                        else {
                            document.getElementById("opt" + casas[i]).checked = false;
                        }
                    }
                }
                else {
                    for (var i = 0; i < casas.length; i++) {
                        if (i == 0) {
                            document.getElementById("opt" + casas[i]).checked = true;
                        }
                        else {
                            document.getElementById("opt" + casas[i]).checked = false;
                        }
                    }
                }
                break;
            case "traidor":
                if (typeof datos == "object") {
                    document.getElementById("chkTraidor").checked = datos[atributo];
                }
                else {
                    document.getElementById("chkTraidor").checked = false;
                }
                break;
            default:
                if (typeof datos == "object") {
                    document.getElementById("txt" + atributoCapitalizado).value = datos[atributo];
                }
                else {
                    if (atributo === "id") {
                        document.getElementById("txt" + atributoCapitalizado).value = localStorage.getItem("ID");
                    }
                    else {
                        document.getElementById("txt" + atributoCapitalizado).value = "";
                    }
                }
                break;
        }
    }
}
function ocultarFormulario() {
    activarMenu(document.getElementById("btnGetPersonajes"));
    document.getElementById("btnAltaPersonaje").style.pointerEvents = "auto";
    document.getElementById("btnEditarPersonaje").style.pointerEvents = "none";
    blanquearFila();
    document.getElementById("tablaPersonajes").style.display = "table";
    document.getElementById("formularioPersonajes").style.display = "none";
}
