import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjetoService {
  private readonly PROJETO_URL: string = `${environment.apiUrl}/projeto`;
  private readonly USUARIO_URL: string = `${environment.apiUrl}/usuario/listar`;

  constructor(private http: HttpClient) {}

  // Método para salvar o projeto
  save(projeto: any, id?: number): Observable<any> {
    // if(id) {
    //   return this.update(projeto, id);
    // }
    return this.insert(projeto);
  }

  private insert(projeto: any): Observable<any> {
    return this.http
      .post(`${this.PROJETO_URL}/cadastrar`, projeto)
      .pipe(map((response) => 'Projeto gravado com sucesso.'));
  }

  getUsuarios(): Observable<any[]> {
    return this.http
      .get<any>(this.USUARIO_URL)
      .pipe(map((response) => response.content));
  }
}
