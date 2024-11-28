import { Component, OnInit } from '@angular/core';
import { ProjetoService } from 'src/app/core/services/projeto.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  projetos: any[] = [];
  totalElements: number = 0;
  pageNumber: number = 0;
  pageSize: number = 10;
  constructor(private projetoService: ProjetoService) {}

  ngOnInit(): void {
    this.listarProjetos();
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
    } else if (action === 'excluir') {
      console.log('Excluir projeto', projeto);
    }
  }
}
