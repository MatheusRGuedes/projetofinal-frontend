import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  username :string = "";

  constructor(
    private router :Router
    // private secutityService :SecurityService
    ) {
    this.username = this.getUsername();
  }

   public logout() :void {
  //   if (confirm("Tem certeza que deseja deslogar ?")) {
  //     this.secutityService.deslogar();
  //   }
   }

  getUsername() :string {
    //console.log('obtendo username');
    // const usuarioLogado = this.secutityService.usuarioLogado;
    // return usuarioLogado ? usuarioLogado.username : "";
    return '';
  }
}
