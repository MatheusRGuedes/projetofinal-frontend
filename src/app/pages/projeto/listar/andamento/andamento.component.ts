import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProjetoService } from 'src/app/core/services/projeto.service';
import { SecurityService } from 'src/app/core/services/security.service';

@Component({
  selector: 'app-andamento',
  templateUrl: './andamento.component.html',
  styleUrls: ['./andamento.component.css']
})
export class AndamentoComponent {
  projetos: any[] = [];
  totalElements: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  isAdmin: boolean = false;

  constructor(
    private projetoService: ProjetoService,
    private snackBar: MatSnackBar,
    private authService: SecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.usuarioRole === 'Administrador';
    this.listarProjetos();
  }

  listarProjetos(): void {
    if(this.isAdmin) {
      this.projetoService.listarEmAndamento(this.pageNumber, this.pageSize).subscribe({
        next: (response: any) => {
          this.projetos = response.content;
          this.totalElements = response.totalElements;
        },
        error: (error: any) => {
          console.error('Erro ao listar os projetos', error);
        }
      });
    } else {
      this.projetoService.listarEmAndamentoUsuarioLogado(this.pageNumber, this.pageSize).subscribe({
        next: (response: any) => {
          this.projetos = response.content;
          this.totalElements = response.totalElements;
        },
        error: (error: any) => {
          console.error('Erro ao listar os projetos', error);
        }
      });
    }
  }

  irParaResponder(idProjeto: number): void {
    console.log('irParaResponder', idProjeto);
    this.router.navigate([`/projetos/responder`, idProjeto]);
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.listarProjetos();
  }
}
