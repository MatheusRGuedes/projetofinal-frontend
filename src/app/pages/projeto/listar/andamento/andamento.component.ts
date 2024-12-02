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
  usuariosVinculados: any[] = [];
  projetoSelecionado: any = null;
  usuarioSelecionado: number | null = null;

  constructor(
    private projetoService: ProjetoService,
    private snackBar: MatSnackBar,
    private authService: SecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.usuarioRole === 'Administrador';
    console.log('isAdmin', this.isAdmin);
    this.listarProjetos();
  }

  abrirModal(projeto: any): void {
    this.projetoSelecionado = projeto;
    this.buscarUsuariosVinculados(projeto.idProjeto);

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('usuariosModal')
    );
    modal.show();
  }

  buscarUsuariosVinculados(idProjeto: number): void {
    this.projetoService.buscarListaUsuarioNoProjeto(idProjeto).subscribe({
      next: (response: any) => {
        this.usuariosVinculados = response;
      },
      error: (error: any) => {
        console.error('Erro ao buscar usuários vinculados', error);
      }
    });
  }

  visualizarRespostas(idUsuario: number | null): void {
    if (this.projetoSelecionado && idUsuario) {

      const modalElement = document.getElementById('usuariosModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.hide(); // Fecha o modal
      }
  
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
      document.body.classList.remove('modal-open');
  
      this.router.navigate([`/projetos/responder`, this.projetoSelecionado.idProjeto, idUsuario]);
    } else {
      this.snackBar.open('Selecione um usuário antes de continuar.', 'Fechar', {
        duration: 3000,
      });
    }
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
