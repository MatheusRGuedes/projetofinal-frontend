import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjetoService {
  private readonly PROJETO_URL: string = `${environment.apiUrl}/projeto`;
  private readonly USUARIO_URL: string = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  save(projeto: any, id?: number): Observable<any> {
    return this.insert(projeto);
  }

  private insert(projeto: any): Observable<any> {
    return this.http
      .post(`${this.PROJETO_URL}/cadastrar`, projeto)
      .pipe(map((response) => 'Projeto gravado com sucesso.'));
  }

  list(page: number, size: number): Observable<any> {
    const params = {
      page: page.toString(),
      size: size.toString(),
    };
    return this.http.get<any>(`${this.PROJETO_URL}/listar`, { params });
  }

  associarUsuario(projetoId: number, usuarioId: number): Observable<any> {
    return this.http
      .post(`${this.PROJETO_URL}/associarusuario/${projetoId}/${usuarioId}`, {}, { responseType: 'text' })
      .pipe(
        map((response: string) => {
          return { message: response };
        })
      );
  }

  desassociarUsuario(projetoId: number, usuarioId: number): Observable<any> {
    return this.http.delete(`${this.PROJETO_URL}/desassociar/${projetoId}/${usuarioId}`, {})
      
  }

  listarUsuariosDisponiveis(idProjeto: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.USUARIO_URL}/listardisponiveis/${idProjeto}`);
  }

  listarUsuariosEmProjeto(idProjeto: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.USUARIO_URL}/listarporprojeto/${idProjeto}`);
  }

}
