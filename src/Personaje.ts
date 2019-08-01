class Personaje
{
    private id:number;
    private nombre:string;
    private apellido:string;
    private edad:number;
    private casa:Casas;
    private traidor:boolean;

    constructor(id:number, nombre:string, apellido:string, edad:number, casa:Casas, traidor:boolean)
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.casa = casa;
        this.traidor = traidor;
    }
}