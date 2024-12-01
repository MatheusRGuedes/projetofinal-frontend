import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtapaService {

  private readonly ETAPA_URL :string = `${environment.apiUrl}/etapa`;
  
  constructor(
    private http :HttpClient
  ) { }

  save(etapa :any, id? :number) :Observable<any> {
    // if(id) {
    //   return this.update(etapa, id);
    // }
    return this.insert(etapa);
  }

  private insert(etapa: any): Observable<any> {
    return this.http.post(`${this.ETAPA_URL}/cadastrar`, etapa)
      .pipe(
        map(response => 'Etapa gravado com sucesso.')
      );
  }

  getAll() :Observable<any[]> {
    return this.http.get<any>(`${this.ETAPA_URL}/listar`)
    .pipe(
        map(response => response['content'])
    )
    //return of([{ id: 1, descricao: "HOSPITAL MEMORIAL MEIER"}]);
  }
}
