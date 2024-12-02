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
    console.log(this.authService.usuarioRole)
  }

  listarProjetos(): void {
    this.projetoService.list(this.pageNumber, this.pageSize).subscribe(
      (response: any) => {
        console.log(response)
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
    } else if (action === 'excluir') {
      console.log('Excluir projeto', projeto);
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