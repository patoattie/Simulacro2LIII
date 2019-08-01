var Personaje = (function () {
    function Personaje(id, nombre, apellido, edad, casa, traidor) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.casa = casa;
        this.traidor = traidor;
    }
    Personaje.prototype.toString = function () {
        var texto = "";
        texto += "ID: " + this.id + "\n";
        texto += "NOMBRE: " + this.nombre + "\n";
        texto += "APELLIDO: " + this.apellido + "\n";
        texto += "EDAD: " + this.edad + "\n";
        texto += "CASA: " + this.casa + "\n";
        if (this.traidor) {
            texto += "TRAIDOR: Si";
        }
        else {
            texto += "TRAIDOR: No";
        }
        return texto;
    };
    return Personaje;
}());
