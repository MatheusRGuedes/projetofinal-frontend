import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PerguntaService } from 'src/app/core/services/pergunta.service';
import { ProjetoService } from 'src/app/core/services/projeto.service';
import { SecurityService } from 'src/app/core/services/security.service';

@Component({
  selector: 'app-responder',
  templateUrl: './responder.component.html',
  styleUrls: ['./responder.component.css']
})
export class ResponderComponent implements OnInit {
  projetoId!: number;
  projeto: any;

  constructor(
    private projetoService: ProjetoService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private perguntaService: PerguntaService,
    private security: SecurityService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: { [key: string]: any }) => {
      if( params && params['id'] && params['idUsuario'] ) {
        this.projetoId = +params['id'];
        const idUsuario = +params['idUsuario'];
        this.buscarProjeto(this.projetoId, idUsuario);
      }
      else if (params && params['id']) {
        this.projetoId = +params['id'];
        this.buscarProjeto(this.projetoId);
      } else {
        console.error('Parâmetro "id" não encontrado na rota.');
      }
    });
  }
  
  buscarProjeto(id: number, idUsuario?: number): void {
    if(id && idUsuario) {
      this.projetoService.listarPorIdeIdUsuario(id, idUsuario).subscribe({
        next: (response) => {
          this.projeto = response;
          console.log('Projeto encontrado:', this.projeto);
          this.projeto.etapas.forEach((etapa: any) => {
            etapa.perguntas.forEach((pergunta: any) => {
              if (pergunta.tipoPergunta === 'Múltipla Escolha' && pergunta.respondida) {
                const opcaoSelecionada = pergunta.opcoesResposta.find(
                  (opcao: any) => opcao.resposta === pergunta.resposta
                );
                if (opcaoSelecionada) {
                  pergunta.resposta = opcaoSelecionada.id;
                }
              }
            });
          });
        },
        error: (err) => {
          console.error('Erro ao buscar projeto:', err);
        }
      });
    } else {
      this.projetoService.listarPorId(id).subscribe({
        next: (projeto) => {
          this.projeto = projeto;
  
          this.projeto.etapas.forEach((etapa: any) => {
            etapa.perguntas.forEach((pergunta: any) => {
              if (pergunta.tipoPergunta === 'Múltipla Escolha' && pergunta.respondida) {
                const opcaoSelecionada = pergunta.opcoesResposta.find(
                  (opcao: any) => opcao.resposta === pergunta.resposta
                );
                if (opcaoSelecionada) {
                  pergunta.resposta = opcaoSelecionada.id;
                }
              }
            });
          });
        },
        error: (err) => {
          console.error('Erro ao buscar projeto:', err);
          this.snackBar.open('Erro ao carregar o projeto.', 'Fechar', {
            duration: 3000,
          });
        }
      });
    }
  }

  enviarResposta(etapaId: number, pergunta: any): void {
    console.log('Enviando resposta para a pergunta:', etapaId);
    const respostaDTO: any = {
      idProjeto: this.projetoId,
      idEtapa: etapaId,
      perguntaId: pergunta.idPergunta,
      usuarioLogin: this.security.usuarioLogado.login,
      resposta: pergunta.tipoPergunta === 'Texto' ? pergunta.resposta : null,
      idOpcaoResposta: pergunta.tipoPergunta === 'Múltipla Escolha' ? pergunta.resposta : null,
      respostaNumerica: pergunta.tipoPergunta === 'Numérico' ? pergunta.resposta : null
    };
  
    this.perguntaService.responderPergunta(respostaDTO).subscribe({
      next: (response) => {
        console.log(`Resposta enviada com sucesso para o projeto ${this.projetoId}:`, response);
        this.snackBar.open('Resposta enviada com sucesso!', 'Fechar', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error(`Erro ao enviar resposta para o projeto ${this.projetoId}:`, err);
        this.snackBar.open('Erro ao enviar resposta.', 'Fechar', {
          duration: 3000
        });
      }
    });
  }
}
