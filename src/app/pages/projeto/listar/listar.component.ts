import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetoService } from 'src/app/core/services/projeto.service';
import { SecurityService } from 'src/app/core/services/security.service';
declare var bootstrap: any;
@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  isAdmin: boolean = false;
  totalElements: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  projetoSelecionado: any = null;
  usuarioDesassociar: any = null;
  usuarioSelecionado: any = null;
  usuariosDisponiveis: any[] = [];
  usuariosAssociados: any[] = [];
  projetos: any[] = [];
  constructor(
    private projetoService: ProjetoService,
    private snackBar: MatSnackBar,
    private authService: SecurityService,
    private router: Router,
    private activatedRoute :ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listarProjetos();
    this.isAdmin = this.authService.usuarioRole === 'Administrador';
  }

  listarProjetos(): void {
    this.projetoService.list(this.pageNumber, this.pageSize).subscribe(
      (response: any) => {
        this.projetos = response.content;
        this.totalElements = response.totalElements;
      },
      (error: any) => {
        console.error('Erro ao listar os projetos', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.listarProjetos();
  }

  onAction(projeto: any, action: string): void {
    if (action === 'editar') {
      console.log('Editar projeto', projeto);
      this.router.navigateByUrl(`/projetos/editar/${projeto.id}`);
    }
  }

  excluirProjeto(projeto: any): void {
    // Salva o projeto selecionado para exclusão
    this.projetoSelecionado = projeto;

    // Abre o modal de confirmação
    const modalElement = document.getElementById('confirmarExclusaoModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  confirmarExclusao(): void {
    if (this.projetoSelecionado) {
      this.projetoService.excluirProjeto(this.projetoSelecionado.id).subscribe({
        next: (response) => {
          // Atualizar a lista de projetos
          this.listarProjetos();
    
          // Exibir a notificação de sucesso
          this.snackBar.open('Projeto excluído com sucesso!', '', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
    
          // Fechar o modal e remover o backdrop
          const modalElement = document.getElementById('confirmarExclusaoModal');
          if (modalElement) {
            modalElement.classList.remove('show');
            modalElement.setAttribute('aria-hidden', 'true');
            modalElement.removeAttribute('aria-modal');
            modalElement.style.display = 'none';
          }
          const modalBackdrop = document.querySelector('.modal-backdrop');
          if (modalBackdrop) {
            modalBackdrop.remove();
          }
        },
        error: (error) => {
          this.snackBar.open('Erro ao excluir o projeto.', '', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        }
      });
    }
  }

  openModal(projeto: any): void {
    this.projetoSelecionado = projeto; // Armazenar o projeto selecionado
    console.log('Projeto selecionado:', this.projetoSelecionado);
    this.listarUsuariosDisponiveis(projeto.id); // Listar os usuários disponíveis
    const modalElement = document.getElementById('associarModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();  // Exibe o modal
    }
  }

  openDesassociarModal(projeto: any): void {
    this.projetoSelecionado = projeto; // Armazenar o projeto selecionado

    // Chama o serviço para obter os usuários associados ao projeto
    this.projetoService.listarUsuariosEmProjeto(projeto.id).subscribe({
      next: (usuarios) => {
        this.usuariosAssociados = usuarios; // Carregar os usuários associados ao projeto
      },
      error: (err) => {
        console.error('Erro ao carregar os usuários', err);
      }
    });
    

    const modalElement = document.getElementById('desassociarModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  listarUsuariosDisponiveis(idProjeto: number): void {
    this.projetoService.listarUsuariosDisponiveis(idProjeto).subscribe({
      next: (response: any) => {
        console.log('Usuários disponíveis:', response);
        this.usuariosDisponiveis = response.content;
      },
      error: (error: any) => {
        console.error('Erro ao listar os usuários disponíveis', error);
      }
    });
  }

  confirmarDesassociacao(): void {
    if (this.projetoSelecionado && this.usuarioDesassociar) {
      const idProjeto = this.projetoSelecionado.id;
      const idUsuario = this.usuarioDesassociar.id;

      this.projetoService.desassociarUsuario(idProjeto, idUsuario).subscribe({
        next: (response) => {

          const modalElement = document.getElementById('desassociarModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
          }

          this.listarProjetos();

          this.snackBar.open('Usuário desassociado com sucesso ao projeto!', '', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        },
        error: (error) => {
          this.snackBar.open('Erro ao desassociar o usuário ao projeto.', '', {
            duration: 3000, 
            panelClass: ['snackbar-error'],
          });
        }
      });
    } else {
      this.snackBar.open('Projeto ou usuario não selecionado', '', {
        duration: 3000, 
        panelClass: ['snackbar-error'],
      });
    }
  }

  confirmarAssociacao(): void {
    if (this.projetoSelecionado && this.usuarioSelecionado) {
      const idProjeto = this.projetoSelecionado.id;
      const idUsuario = this.usuarioSelecionado.id;
  
      this.projetoService.associarUsuario(idProjeto, idUsuario).subscribe({
        next: (response) => {
  
          const modalElement = document.getElementById('associarModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
          }
  
          this.listarProjetos();
  
          this.snackBar.open('Usuário associado com sucesso ao projeto!', '', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        },
        error: (error) => {
          this.snackBar.open('Erro ao associar o usuário ao projeto.', '', {
            duration: 3000, 
            panelClass: ['snackbar-error'],
          });
        }
      });
    } else {
      this.snackBar.open('Projeto ou usuario não selecionado', '', {
        duration: 3000, 
        panelClass: ['snackbar-error'],
      });
    }
  }
  
}