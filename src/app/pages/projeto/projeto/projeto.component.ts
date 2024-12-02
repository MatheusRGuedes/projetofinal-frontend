import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EtapaService } from 'src/app/core/services/etapa.service';
import { PerguntaService } from 'src/app/core/services/pergunta.service';
import { ProjetoService } from 'src/app/core/services/projeto.service';

@Component({
  selector: 'app-projeto',
  templateUrl: './projeto.component.html',
  styleUrls: ['./projeto.component.css'],
})
export class ProjetoComponent {
  private subscription: Subscription | undefined;
  public form: FormGroup = new FormGroup({});
  id: number | undefined;

  modoEditar :boolean = false
  showModalEtapa: boolean = false;
  showModalPergunta: boolean = false;

  indexEtapaAtual : number = 0;
  indexPerguntaAtual : number = 0;

  listaEtapasModal: any[] = [];
  listaPerguntasModal: any[] = [];

  constructor(
    private builder :FormBuilder,
    private service :ProjetoService,
    private etapaService :EtapaService,
    private perguntaService :PerguntaService,
    private activatedRoute: ActivatedRoute,
    private router :Router
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.modoEditar = this.router.url.includes('editar');
    console.log(this.modoEditar)

    this.subscription = this.activatedRoute.params.subscribe(params => {
      if (params["id"]) {
        this.id = Number(params["id"]);
        this.recuperarProjeto();
      }
    });
  }

  private createForm() {
    this.form = this.builder.group({
      "titulo": this.builder.control('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      etapas: this.builder.array([
        this.builder.group({
          "idEtapa":    this.builder.control(''),
          "nomeEtapa":  this.builder.control('', [Validators.required]),
          "perguntas":  this.builder.array([
            this.builder.group({
              "idPergunta": this.builder.control(''),
              "descricaoPergunta": this.builder.control('', [Validators.required]),
              "tipoPergunta": this.builder.control('', [Validators.required]),
              "opcoesResposta": this.builder.array([])
            })
          ])
        })
      ])
    });
  }

  private recuperarProjeto() {
    this.subscription = this.service.find(this.id as number)
      .subscribe({
        next: (projeto) => {

          this.form.patchValue({
            "titulo": projeto.titulo
          });
          projeto.etapas.map((etapa :any, indexEtapa: number) => {
            this.etapas[indexEtapa].patchValue({
              "idEtapa": etapa.id,
              "nomeEtapa": etapa.titulo
            });
            etapa.perguntas.map((pergunta :any, indexPergunta: number) => {
              let tipoPergunta = this.getDescricaoTipoResposta(pergunta.tipoPergunta);
              this.getPerguntas(indexEtapa)[indexPergunta].patchValue({
                "idPergunta": pergunta.id,
                "descricaoPergunta": pergunta.descricaoPergunta,
                "tipoPergunta": tipoPergunta
              });
              if (tipoPergunta === 'MULTIPLA_ESCOLHA') {
                pergunta.opcoesResposta.map((opcao :any, indexOpcao: number) => {
                  if (!this.getOpcoesResposta(indexEtapa, indexPergunta)[indexOpcao])
                    this.addOpcaoResposta(indexEtapa, indexPergunta);
        
                  this.getOpcoesResposta(indexEtapa, indexPergunta)[indexOpcao].patchValue({
                    "idResposta": opcao.id,
                    "opcaoResposta": opcao.resposta
                  })
                });
              }
            });
          });

        }, error :(res) => {
          alert(res.error.message);
        },
    });
  }

  public addEtapas(etapa? :any) {
    const newEtapa = this.builder.group({
      idEtapa: this.builder.control(etapa ? etapa.id : ''),
      nomeEtapa: this.builder.control(etapa ? etapa.titulo : '', [Validators.required]),
      perguntas: this.builder.array([])
    });
    return this.etapas.push(newEtapa);
  }

  public addPerguntas(indexEtapa: any) {
    const newPergunta = this.builder.group({
      idPergunta: this.builder.control(''),
      descricaoPergunta: this.builder.control('', [Validators.required]),
      tipoPergunta: this.builder.control('', [Validators.required]),
      opcoesResposta: this.builder.array([]),
    });
    return this.getPerguntas(indexEtapa).push(newPergunta);
  }

  public addOpcaoResposta(indexEtapa: any, indexPergunta: any) {
    const newOpcao = this.builder.group({
      idResposta: this.builder.control(''),
      opcaoResposta: this.builder.control('')
    });
    return this.getOpcoesResposta(indexEtapa, indexPergunta).push(newOpcao);
  }

  public campoInvalido(campo: string): boolean | undefined {
    return this.form.get(campo)?.invalid && this.form.get(campo)?.dirty;
  }

  gravarDados(): void {
    if (this.form.invalid) {
      //markAllAsDirty(this.form);
      return;
    }

    let projeto = {};
    if (this.id) {
      projeto = {
        id: this.id,
        titulo: this.titulo.value
      }
    } else {
      projeto = {
        titulo: this.titulo.value,
        etapas: this.etapas.map((etapa, indexEtapa) => {
          return {
            idEtapa: etapa.get('idEtapa')?.value,
            nomeEtapa: this.getNomeEtapa(indexEtapa).value,
            perguntas: this.getPerguntas(indexEtapa).map(
              (pergunta, indexPergunta) => {
                return {
                  idPergunta: pergunta.get('idPergunta')?.value,
                  descricaoPergunta: pergunta.get('descricaoPergunta')?.value,
                  tipoPergunta: pergunta.get('tipoPergunta')?.value,
                  opcoesResposta: this.getOpcoesResposta(
                    indexEtapa,
                    indexPergunta
                  ).map((opcao) => {
                    return {
                      opcaoResposta: opcao.get('opcaoResposta')?.value,
                      perguntaID: pergunta.get('idPergunta')?.value,
                    };
                  }),
                };
              }
            ),
          };
        }),
      };
    }
    console.log(projeto);
    this.subscription = this.service.save(projeto, this.id!).subscribe({
      next: (res) => {
        alert(res);
        this.atualizarEtapas();
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
  }

  private atualizarEtapas() {
    if(!this.id) return;

    this.etapas.map((etapa :FormGroup, indexEtapa :number) => {

      this.etapaService.save({
        "id": etapa.get('idEtapa')?.value,
        "titulo": etapa.get('nomeEtapa')?.value
      }) .subscribe({
        next: () => {
          this.atualizarPerguntas(indexEtapa)
        }
      });
    });
  }

  private atualizarPerguntas( indexEtapa:number) {
    this.getPerguntas(indexEtapa).map((pergunta:any, indexPergunta :number) => {
      this.perguntaService.save({
        "id": pergunta.get('idPergunta')?.value,
        "descricaoPergunta": pergunta.get('descricaoPergunta')?.value
      }).subscribe({
        next: () => {
          this.atualizarOpcoesResposta(indexEtapa, indexPergunta)
        }
      })
    })
  }

  private atualizarOpcoesResposta(indexEtapa:number, indexPergunta:number) {
    this.getOpcoesResposta(indexEtapa, indexPergunta).map((resposta) => {
      this.perguntaService.updateOpcaoResposta({
        "opcaoRespostaId": resposta.get('idResposta')?.value,
        "opcaoResposta": resposta.get('opcaoResposta')?.value
      }).subscribe()
    })
  }

  carregarEtapas() {
    this.subscription = this.etapaService.getAll()
      .subscribe({
        next: (res) => this.listaEtapasModal = res,
        error: (err) => {
          alert(err) //this.alert.error(err);
        }
      }
    );
  }

  carregarPerguntas() {
    this.subscription = this.perguntaService.getAll()
      .subscribe({
        next: (res) => this.listaPerguntasModal = res,
        error: (err) => {
          alert(err) //this.alert.error(err);
        }
      }
    );
  }

  retornarEtapaModal(etapa :any) {
    console.log(etapa);
    
    this.etapas[this.indexEtapaAtual].patchValue({
        "idEtapa": etapa.id,
        "nomeEtapa": etapa.titulo
    })
    etapa.perguntas.map((pergunta :any, indexPergunta :number) => {
      let tipoPergunta = this.getDescricaoTipoResposta(pergunta.tipoPergunta);
      if (!this.getPerguntas(this.indexEtapaAtual)[indexPergunta]) 
        this.addPerguntas(this.indexEtapaAtual);
      
      this.getPerguntas(this.indexEtapaAtual)[indexPergunta].patchValue({
        // "idPergunta": pergunta.id,
        "descricaoPergunta": pergunta.descricaoPergunta,
        "tipoPergunta": tipoPergunta
      });
      if (tipoPergunta === 'MULTIPLA_ESCOLHA') {
        pergunta.opcoesResposta.map((opcao :any, indexOpcao: number) => {
          if (!this.getOpcoesResposta(this.indexEtapaAtual, indexPergunta)[indexOpcao])
            this.addOpcaoResposta(this.indexEtapaAtual, indexPergunta);

          this.getOpcoesResposta(this.indexEtapaAtual, indexPergunta)[indexOpcao].patchValue({
            // "idResposta": opcao.id,
            "opcaoResposta": opcao.resposta
          })
        });
      }
    });
  }

  retornarPerguntaModal(pergunta :any) {
    console.log(pergunta);

    let tipoPergunta = this.getDescricaoTipoResposta(pergunta.tipoPergunta);
    this.getPerguntas(this.indexEtapaAtual)[this.indexPerguntaAtual].patchValue({
      "descricaoPergunta": pergunta.descricaoPergunta,
      "tipoPergunta": tipoPergunta
    });
    if (tipoPergunta === 'MULTIPLA_ESCOLHA') {
      pergunta.opcoesResposta.map((opcao :any, indexOpcao: number) => {
        if (!this.getOpcoesResposta(this.indexEtapaAtual, this.indexPerguntaAtual)[indexOpcao])
          this.addOpcaoResposta(this.indexEtapaAtual, this.indexPerguntaAtual);

        this.getOpcoesResposta(this.indexEtapaAtual, this.indexPerguntaAtual)[indexOpcao].patchValue({
          // "idResposta": opcao.id,
          "opcaoResposta": opcao.resposta
        })
      });
    }
  }

  private getDescricaoTipoResposta(valor :string) :string {
    switch (valor) {
      case 'Texto':
        return 'STRING';
      case 'Múltipla Escolha':
        return 'MULTIPLA_ESCOLHA';
      case 'Numérico':
        return 'NUMERICO';
      default:
        return ''    
    }
  }

  toggleEtapa () {
    this.showModalEtapa = !this.showModalEtapa;
  }
  togglePergunta () {
    this.showModalPergunta = !this.showModalPergunta;
  }

  get titulo() :FormControl {
    return this.form.get('titulo') as FormControl;
  }
  get etapas(): FormGroup[] {
    return (this.form.get('etapas') as FormArray).controls as FormGroup[];
  }
  getIdEtapa(index: any): FormGroup {
    return this.etapas[index].get('idEtapa') as FormGroup;
  }
  getNomeEtapa(index: any): FormGroup {
    return this.etapas[index].get('nomeEtapa') as FormGroup;
  }
  getPerguntas(indexEtapa: any): FormGroup[] {
    return (this.etapas[indexEtapa].get('perguntas') as FormArray)
      .controls as FormGroup[];
  }
  getTipoPergunta(indexEtapa: any, indexPergunta: any): FormControl {
    return this.getPerguntas(indexEtapa)
      .at(indexPergunta)
      ?.get('tipoPergunta') as FormControl;
  }
  getOpcoesResposta(indexEtapa: any, indexPergunta: any): FormGroup[] {
    return (
      this.getPerguntas(indexEtapa)
        .at(indexPergunta)
        ?.get('opcoesResposta') as FormArray
    ).controls as FormGroup[];
  }
}
