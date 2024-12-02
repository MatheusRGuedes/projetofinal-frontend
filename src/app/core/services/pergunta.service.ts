import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerguntaService {

  private readonly PERGUNTA_URL :string = `${environment.apiUrl}/pergunta`;
  private readonly RESPOSTA_URL :string = `${this.PERGUNTA_URL}/opcaoresposta`;
  
  constructor(
    private http :HttpClient
  ) { }

  save(pergunta :any, id? :number) :Observable<any> {
    if(pergunta.id) {
      return this.update(pergunta);
    }
    return this.insert(pergunta);
  }

  private insert(pergunta: any): Observable<any> {
    return this.http.post(`${this.PERGUNTA_URL}/cadastrar`, pergunta)
      .pipe(
        map(response => 'Pergunta gravado com sucesso.')
      );
  }
  private update(pergunta: any): Observable<any> {
    return this.http
      .put(`${this.PERGUNTA_URL}/editar/${pergunta.id}`, pergunta)
      .pipe(map((response) => 'Pergunta gravada com sucesso.'));
  }

  updateOpcaoResposta(resposta : any) :Observable<any> {
    return this.http.put(`${this.RESPOSTA_URL}/editar/${resposta.id}`, resposta);
  }

  getAll() :Observable<any[]> {
    return this.http.get<any>(`${this.PERGUNTA_URL}/listar`)
    .pipe(
        map(response => response['content'])
    )
    //return of([{ id: 1, descricao: "TESTE"}]);
  }

  responderPergunta(resposta: any): Observable<string> {
    return this.http.post<string>(`${this.PERGUNTA_URL}/responder`, resposta);
  }
}
