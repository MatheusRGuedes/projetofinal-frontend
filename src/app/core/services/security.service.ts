import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay, interval, map, switchMap, take, tap } from 'rxjs';
import { Buffer } from 'buffer/';
import { ILogin } from 'src/app/shared/models/login';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private readonly AUTH_URL :string = `${environment.apiUrl}/login`;

  constructor(
    private http :HttpClient,
    private router :Router
  ) {}

  deslogar() :void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  login(login :ILogin) :Observable<any> {
    /*let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', "http://localhost:8080");
    headers.append('Accept', 'application/json');*/
    return this.http.post<any>(`${this.AUTH_URL}`, login)
      .pipe(
        tap(response => {
          this.storageSessionData(response, login);
          this.router.navigate(['']);
        })
      );
  }

  private storageSessionData(response :any, login :ILogin) {
    const dataSession :any = [];
    dataSession.user = login;
    dataSession.user.role = response["tipoUsuario"];
    
    localStorage.setItem("token", response["token"]);
    localStorage.setItem("usuario", JSON.stringify(dataSession.user));
  }

  public get usuarioLogado() :any {
    if (localStorage.getItem('usuario')) {
      let usuario :string = localStorage.getItem('usuario') as string;
      return JSON.parse(usuario);
    } else {
      return null;
    }
  }
  
  // public get logado() :boolean {
  //   return localStorage.getItem('token') ? true : false;
  // }
  
  public get usuarioRole() :any {
    const usuarioLogado :any = this.usuarioLogado;
    return usuarioLogado ? usuarioLogado.role : null;
  }

  public get token() :any {
    const token :any = localStorage.getItem('token');
    return token ? token : null;
  }
}