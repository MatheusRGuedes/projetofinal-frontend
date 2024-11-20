import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Output()
  closeSidebarEvent = new EventEmitter<boolean>();

  // isClosed :boolean = false;
  userRole :string = '';

  public buttonHamburguer :HTMLElement | null = null;
  public sidebarMenu :HTMLElement | null = null;

  constructor(
    //private securityService :SecurityService
  ) {    
  }

  ngOnInit() {
    this.sidebarMenu = document.querySelector(".sidebar");

    this.getUserRole();
  }

  getUserRole() {
    // const usuarioLogado = this.securityService.usuarioLogado;
    // if (usuarioLogado) {
    //   this.userRole = usuarioLogado.role;
      //console.log(this.userRole);
    // } else {
    //   console.error("Usuário não se encontra logado.");
    // }
  }
}
