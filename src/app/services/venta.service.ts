import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VentaInterface } from '@app/interfaces/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private http: HttpClient) { }

  private url='http://192.168.1.4:3000';
 
  // getVentaDetalle():Observable<VentaInterface>{
  //   // return this.http.get<VentaInterface>(this.url+'venta/api/create');
  //   return this.http.get<VentaInterface>('https://jsonplaceholder.typicode.com/posts');
  // }

  getVentaDetalle(){ 
    return this.http.get<VentaInterface>(this.url+'/venta/api/create');
  }

  postVentaCapturista(data:any,venta:string):Observable<any>{
    return this.http.post<any>(this.url +'/venta/api/'+ venta +'/capturista',data);
  }

  postVenta_AgregarProducto(data:any,venta:string):Observable<any>{
    //return this.http.post<any>('http://localhost:3000/venta/api/'+ venta +'/agregar_producto',data);
    return this.http.post<any>(this.url+'/venta/api/'+ venta +'/agregar_producto',data);
  }

}
