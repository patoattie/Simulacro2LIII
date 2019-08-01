var Personaje = (function () {
    function Personaje(id, nombre, apellido, edad, casa, traidor) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.casa = casa;
        this.traidor = traidor;
    }
    return Personaje;
}());
