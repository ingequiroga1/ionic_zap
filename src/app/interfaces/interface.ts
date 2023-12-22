export interface VentaInterface {
    capturista: string;
    total: number;
    subtotal: number;
    descuento: number;
    no_piezas: number;
    no_medias: number;
    _id: string;
    secuencia: number;
    productos: ProductosInterface[]; // Otra interfaz que represente la estructura de los objetos en el array
    fecha: string;
    __v: number;
  }

  export interface ProductosInterface{
        _id: string;
        producto: ProductoInterface;
        cantidad: number;
        importe: number;
        medias: number
    }

export interface ProductoInterface{
    _id: string;
    articulo: number;
    descripcion: string;
    precio: number;
    linea: string;
    __v: number;
}
 