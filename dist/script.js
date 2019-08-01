$("document").ready(asignarManejadores);

var personajes = [];
var personajeSeleccionado = {};
var casas = ["Stark", "Targaryen", "Lannister"];

//Al dispararse el evento load cuando se termina de cargar la página web, 
//se instancian los manejadores del evento click de los tres botones del menú.
function asignarManejadores()
{
    $("#btnGetPersonajes").on("click", traerPersonajes);
    $("#btnAltaPersonaje").on("click", altaPersonaje);
    $("#btnEditarPersonaje").on("click", editarPersonaje);
}

function activarMenu(elemento)
{
    if($(".active")[0])
    {
        $(".active").removeAttr("class");
    }
    elemento.attr("class", "active");
}

//Llama a la función traerPersonajes del servidor, luego con los datos devueltos se crean en el DOM la tabla y el formulario de edición.
function traerPersonajes()
{
    activarMenu($("#btnGetPersonajes"));
    var storage = JSON.parse(localStorage.getItem("personajes"));
    $("#info").innerHTML = "";

    personajes = [];

    if(storage == null)
    {
        personajes.push("");
    }
    else
    {
        personajes = storage; //Respuesta de texto del servidor (JSON), lo convierto a objeto
    }

    crearTabla();
    //crearFormulario();

    $("#btnGetPersonajes").css("pointer-events", "auto");
    $("#btnAltaPersonaje").css("pointer-events", "auto");
}

//Llamador usado por el evento dla opción de Agregar del formulario
function opcionAgregarPersonaje()
{
    agregarPersonaje(personajeEditado());
}

//Crea un objeto JSON a partir de los datos del formulario
function personajeEditado()
{
    var personaje = {};

    for(var atributo in personajes[0])
    {
        switch(atributo)
        {
            case "casa":
                for(var i = 0; i < casas.length; i++)
                {
                    if($("#opt" + casas[i]).checked)
                    {
                        personaje["casa"] = casas[i];
                    }
                }
                break;
            case "traidor":
                personaje["traidor"] = $("#chkTraidor").checked;
                break;
            default:
                var atributoCapitalizado = atributo.charAt(0).toUpperCase() + atributo.slice(1).toLowerCase(); //Primer letra en mayuscula, resto minuscula
                personaje[atributo] = $("#txt" + atributoCapitalizado).val();
                break;
        }
    }

    return personaje;
}

//Llama a la función altaPersonaje del servidor, pasándole el objeto que se quiere agregar por parámetro.
function agregarPersonaje(personaje)
{
    var nuevoPersonaje = [];
    var proximoID = parseInt(localStorage.getItem("ID"));

    if(isNaN(proximoID))
    {
        proximoID = 20000;
    }

    personaje.id = proximoID;

    nuevoPersonaje.push(personaje);
    ocultarFormulario();
    crearDetalle($("#tablaPersonajes"), nuevoPersonaje);

    if(personajes[0].id == null)
    {
        personajes[0] = personaje;
    }
    else
    {
        personajes.push(personaje);
    }

    proximoID++;

    localStorage.setItem("personajes", JSON.stringify(personajes));
    localStorage.setItem("ID", proximoID.toString());
}

//Llamador usado por el evento dla opción de Borrar del formulario
function opcionBorrarPersonaje()
{
    borrarPersonaje(personajeSeleccionado);
}

//Llama a la función bajaPersonaje del servidor, pasándole el objeto que se quiere eliminar por parámetro.
function borrarPersonaje(personaje)
{
    var index = personajes.findIndex((per) => 
    {
        return per.id == personaje.id;
    });
  
    if (index != -1)
    {
        personajes.splice(index, 1);

        alert("Personaje:\n\n" + personajeToString(personaje) + "\n\nfue borrada de la tabla");
        borrarFilaSeleccionada($("#tablaPersonajes"));
    }
  
    ocultarFormulario();

    localStorage.setItem("personajes", JSON.stringify(personajes));
}

//Llamador usado por el evento dla opción de Modificar del formulario
function opcionModificarPersonaje()
{
    modificarPersonaje(personajeSeleccionado, personajeEditado());
}

//Llama a la función modificarPersonaje del servidor, pasándole el objeto que se quiere modificar por parámetro.
function modificarPersonaje(personaPre, personaPost)
{
    var index = personajes.findIndex((per) => 
    {
        return per.id == personaPost.id;
    });
  
    if (index != -1)
    {
        personajes.splice(index, 1);
        personajes.push(personaPost);

        alert("Personaje:\n\n" + personajeToString(personaPre) + "\n\nfue modificada a:\n\n" + personajeToString(personaPost));
        modificarFilaSeleccionada(personaPost);
    }
  
    ocultarFormulario();

    localStorage.setItem("personajes", JSON.stringify(personajes));
}

//Devuelve un string con la descripción de atributos y valores del objeto pasado por parámetro.
function personajeToString(personaje)
{
    var texto = "";
    var retornoCarro = false;

    for(var atributo in personaje)
    {
        if(retornoCarro) //Para que no haga retorno de carro en la primera línea
        {
            texto += "\n";
        }
        else
        {
            retornoCarro = true;
        }

        if(atributo == "traidor" && personaje[atributo])
        {
            texto += atributo.toUpperCase() + ": Si";
        }
        else if(atributo == "traidor" && !personaje[atributo])
        {
            texto += atributo.toUpperCase() + ": No";
        }
        else
        {
            texto += atributo.toUpperCase() + ": " + personaje[atributo];
        }
    }

    return texto;
}

//Crea la tabla de personajes en el div info
function crearTabla()
{
    var puedeCrearDetalle = true; //Si no tengo elementos desde el servidor cambia a false.
    //var div = $("#info");
    //var tablaPersonajes = div.append("<table>");

    $("#info").append("<table>");
    $("#info table").attr("id", "tablaPersonajes");
    $("#tablaPersonajes").attr("border", "1px");
    $("#tablaPersonajes").attr("class", "tablaPersonajes");
    $("#tablaPersonajes").css("border-collapse", "collapse");
    //tablaPersonajes.attr("border", "1px");
    //tablaPersonajes.css("border-collapse", "collapse");
    //tablaPersonajes.attr("id", "tablaPersonajes");
    //tablaPersonajes.attr("class", "tablaPersonajes");

    if(typeof personajes[0] != "object") //Si el servidor no trae nada creo la estructura vacía.
    {
        personajes[0] = {"id":null,"nombre":null,"apellido":null,"edad":null,"casa":null,"traidor":null};
        puedeCrearDetalle = false;
    }

    crearCabecera($("#tablaPersonajes"));

    if(puedeCrearDetalle)
    {
        crearDetalle(tablaPersonajes, personajes);
    }
}

//Crea el formulario de edición de personajes en el div info.
//El atributo id lo crea como solo lectura, ya que el servidor en el alta lo deduce,
//y en la modificación no se altera su valor.
function crearFormulario()
{
    var div = $("#info");

    var formulario = div.append("form");
    formulario.attr("action", "#");
    formulario.attr("id", "formularioPersonajes");
    formulario.css("display", "none");

    var grupo = formulario.append("fieldset");

    var leyenda = grupo.append("legend");
    leyenda.text("Personaje");

    var botonAgregar = grupo.append("input");
    var botonModificar = grupo.append("input");
    var botonBorrar = grupo.append("input");
    var botonCancelar = grupo.append("input");

    for(var atributo in personajes[0])
    {
        switch(atributo)
        {
            case "casa":
                var grupoCasa = grupo.append("fieldset");
                var leyendaCasa = grupoCasa.append("legend");

                grupoCasa.attr("class", "grupoInterno");
                leyendaCasa.text("Casa");

                for(var i = 0; i < casas.length; i++)
                {
                    var etiquetaCasa = grupoCasa.append("label");
                    var optButton = grupoCasa.append("input");

                    etiquetaCasa.attr("for", "opt" + casas[i]);
                    etiquetaCasa.text(casas[i]);

                    optButton.attr("type", "radio");
                    optButton.attr("id", "opt" + casas[i]);
                    optButton.attr("name", "casa");
                    optButton.attr("value", casas[i]);
                    optButton.text(" " + casas[i]);

                    grupoCasa.append("br");
                }

                break;

            case "traidor":
                var grupoTraidor = grupo.append("fieldset");
                var chkTraidor = grupoTraidor.append("input");
                var etiquetaTraidor = grupoTraidor.append("label");

                grupoTraidor.attr("class", "grupoInterno");

                chkTraidor.attr("type", "checkbox");
                chkTraidor.attr("id", "chkTraidor");
                chkTraidor.attr("name", "traidor");
                chkTraidor.attr("value", "traidor");
                chkTraidor.text("Es Traidor");

                etiquetaTraidor.attr("for", "chkTraidor");
                etiquetaTraidor.text("Es Traidor");
    
                break;

            default:
                var cuadroTexto = grupo.append("input");
                var etiqueta = grupo.append("label");
                var atributoCapitalizado = atributo.charAt(0).toUpperCase() + atributo.slice(1).toLowerCase(); //Primer letra en mayuscula, resto minuscula
        
                etiqueta.attr("for", "txt" + atributoCapitalizado);
                etiqueta.text(atributoCapitalizado + ": ");
                        
                cuadroTexto.attr("type", "text");
                cuadroTexto.attr("id", "txt" + atributoCapitalizado);

                if(atributo === "id")
                {
                    cuadroTexto.attr("readonly", "");
                }

                break;
        }
    }

    botonAgregar.attr("type", "button");
    botonAgregar.attr("id", "btnAgregar");
    botonAgregar.val("Agregar");
    botonAgregar.on("click", opcionAgregarPersonaje);

    botonModificar.attr("type", "button");
    botonModificar.attr("id", "btnModificar");
    botonModificar.val("Modificar");
    botonModificar.on("click", opcionModificarPersonaje);

    botonBorrar.attr("type", "button");
    botonBorrar.attr("id", "btnBorrar");
    botonBorrar.val("Borrar");
    botonBorrar.on("click", opcionBorrarPersonaje);

    botonCancelar.attr("type", "button");
    botonCancelar.attr("id", "btnCancelar");
    botonCancelar.val("Cancelar");
    botonCancelar.on("click", ocultarFormulario);
}

//Crea la fila de cabecera, con tantas columnas como atributos posea la personaje, en la tabla de personajes.
function crearCabecera(tablaPersonajes)
{
    //var filaCabecera = tablaPersonajes.append($("<tr>"));
    tablaPersonajes.append("<tr>");
    var columna;
    //var html = "<tr>";

    for(var atributo in personajes[0])
    {
        //columna = filaCabecera.append($("<th>"));
        $("tr").append("<th> " + atributo);
        //columna.text(atributo);
        //html += "<th>" + atributo + "</th>";
    }

    //html += "</tr>";

    //tablaPersonajes.html(html);
}

//Crea tantas fila de detalle en la tabla de personajes como personajes haya cargadas.
function crearDetalle(tablaPersonajes, datos)
{
    var html;

    for(var i = 0; i < datos.length; i++)
    {
        //var filaDetalle = tablaPersonajes.append($("<tr>"));
        var atributo;
        //var columna;
        html = "<tr>";
        //filaDetalle.on("click", seleccionarFila);
        html += " onclick=seleccionarFila";

        for(atributo in datos[i])
        {
            //columna = filaDetalle.append("td");
            html += "<td>";
            //columna.attr("class", atributo);
            html += " class='" + atributo + "'"

            if(atributo == "traidor")
            {
                if(datos[i][atributo])
                {
                    //columna.text("Si");
                    html += "Si";
                }
                else
                {
                    //columna.text("No");
                    html += "Si";
                }
            }
            else
            {
                //columna.text(datos[i][atributo]);
                html += datos[i][atributo];
            }
        }
    }

    tablaPersonajes.html(html);
}

//Cuando el usuario hace click en una fila de detalle de la tabla de personajes,
//la función le setea, previo a blanquear si hay otra fila antes seleccionada, 
//el atributo id a la fila y carga la personaje en el array de personaje seleccionada.
function seleccionarFila()
{
    //$("#btnEditarPersonaje").removeAttr("disabled");
    $("#btnEditarPersonaje").css("pointer-events", "auto");
    blanquearFila();
    
    this.attr("id", "filaSeleccionada");

    //Recorro las columnas de la fila seleccionada, guardando un atributo por columna en personajeSeleccionado.
    for(var i = 0; i < this.children().length; i++)
    {
        if(this.children().attr("class") == "traidor")
        {
            personajeSeleccionado[this.children().attr("class")] = (this.children().text("Si"));
        }
        else
        {
            personajeSeleccionado[this.children().attr("class")] = this.children().text();
        }
    }
}

//Quita el atributo id de la fila seleccionada.
function blanquearFila()
{
    var filaSeleccionada = $("#filaSeleccionada");

    if(filaSeleccionada) //Si hay una fila seleccionada, le quito el id
    {
        filaSeleccionada.removeAttr("id");
    }
}

//Elimina de la tabla de personajes la fila seleccionada por el usuario.
//Esta función la invoca la opción de borrar una personaje del servidor,
//una vez devuelto el ok del mismo.
function borrarFilaSeleccionada(tabla)
{
    tabla.remove($("#filaSeleccionada"));
}

//Modifica los datos de la fila seleccionada con los datos de la personaje pasada por parámetro.
//Esta función la invoca la opción de modificar una personaje del servidor,
//una vez devuelto el ok del mismo.
function modificarFilaSeleccionada(datos)
{
    var filaSeleccionada = $("#filaSeleccionada");

    //Recorro las columnas de la fila seleccionada, guardando un atributo por columna en personajeSeleccionado.
    for(var i = 0; i < filaSeleccionada.children().length; i++)
    {
        if(filaSeleccionada.children().attr("class") == "traidor")
        {
            if(datos[filaSeleccionada.children().attr("class")])
            {
                filaSeleccionada.children().text("Si");
            }
            else
            {
                filaSeleccionada.children().text("No");
            }
        }
        else
        {
            filaSeleccionada.children().text(datos[filaSeleccionada.children().attr("class")]);
        }
    }
}

//Oculta la tabla de personajes, y muestra el formulario invocando la función pertinente
//sin parámetro. Lo invoca la opción de Alta del menú
function altaPersonaje()
{
    activarMenu($("#btnAltaPersonaje"));

    $("#btnAltaPersonaje").css("pointer-events", "none");
    $("#btnEditarPersonaje").css("pointer-events", "none");

    $("#tablaPersonajes").css("display","none");
    $("#formularioPersonajes").css("display","initial");

    mostrarFormulario();
}

//Oculta la tabla de personajes, y muestra el formulario invocando la función pertinente
//pasándole por parámetro la personaje que se quiere editar. Lo invoca la opción de Editar del menú
function editarPersonaje()
{
    activarMenu($("#btnEditarPersonaje"));

    $("#btnAltaPersonaje").css("pointer-events", "none");
    $("#btnEditarPersonaje").css("pointer-events", "none");

    $("#tablaPersonajes").css("display","none");
    $("#formularioPersonajes").css("display","initial");

    mostrarFormulario(personajeSeleccionado);
}

//Arma el formulario de edición de personajes.
//Si no se le pasa parámetro asume que se trata de un alta, para ello muestra la opción
//que invoca la función de alta en el servidor y los cuadros de texto de los parámetros
//en blanco.
//Si se invoca con un objeto, la función asume modificación o baja de la personaje que viene
//por parámetro, mostrando los botones que invocan las funciones respectivas en el servidor,
//y completa los cuadros de texto con los valores de cada atributo.
function mostrarFormulario()
{
    var datos;

    if(typeof arguments[0] == "object") //Es de tipo object si vino un argumento en los parámetros formales de la función.
    {
        datos = arguments[0];

        $("#btnAgregar").css("display","none");
        $("#btnModificar").css("display","initial");
        $("#btnBorrar").css("display","initial");
    }
    else
    {
        $("#btnAgregar").css("display","initial");
        $("#btnModificar").css("display","none");
        $("#btnBorrar").css("display","none");
    }

    for(var atributo in personajes[0])
    {
        var atributoCapitalizado = atributo.charAt(0).toUpperCase() + atributo.slice(1).toLowerCase(); //Primer letra en mayuscula, resto minuscula

        switch(atributo)
        {
            case "casa":
                if(typeof datos == "object") //Modificar o Borrar
                {
                    for(var i = 0; i < casas.length; i++)
                    {
                        if(casas[i] == datos[atributo])
                        {
                            $("#opt" + casas[i]).prop("checked", true);
                        }
                        else
                        {
                            $("#opt" + casas[i]).prop("checked", false);
                        }
                    }
                }
                else //Agregar
                {
                    for(var i = 0; i < casas.length; i++)
                    {
                        if(i == 0)
                        {
                            $("#opt" + casas[i]).prop("checked", true);
                        }
                        else
                        {
                            $("#opt" + casas[i]).prop("checked", false);
                        }
                    }
                }
                break;
                
                case "traidor":
                    if(typeof datos == "object")
                    {
                        $("#chkTraidor").prop("checked", datos[atributo]);
                    }
                    else
                    {
                        $("#chkTraidor").prop("checked", false);
                    }
                    break;
                    
                default:
                    if(typeof datos == "object")
                    {
                        $("#txt" + atributoCapitalizado).val(datos[atributo]);
                    }
                    else
                    {
                        if(atributo === "id")
                        {
                            $("#txt" + atributoCapitalizado).val(localStorage.getItem("ID"));
                        }
                        else
                        {
                            $("#txt" + atributoCapitalizado).val("");
                        }
                    }
                    break;
        }
    }
}

//Oculta el formulario de edición y muestra la tabla de personajes.
//Se blanquea cualquier fila que se haya previamente seleccionado.
function ocultarFormulario()
{
    activarMenu($("#btnGetPersonajes"));

    $("#btnAltaPersonaje").css("pointer-events", "auto");
    $("#btnEditarPersonaje").css("pointer-events", "none");

    blanquearFila();

    $("#tablaPersonajes").css("display","table");
    $("#formularioPersonajes").css("display","none");
}