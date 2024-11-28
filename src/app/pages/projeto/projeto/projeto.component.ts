import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProjetoService } from 'src/app/core/services/projeto.service';

@Component({
  selector: 'app-projeto',
  templateUrl: './projeto.component.html',
  styleUrls: ['./projeto.component.css']
})
export class ProjetoComponent {

  private subscription :Subscription | undefined;
  public form :FormGroup = new FormGroup({});
  id :number | undefined;

  constructor(
    private builder :FormBuilder,
    private service :ProjetoService
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.builder.group({
      "titulo":           this.builder.control('titulo teste', [Validators.required, Validators.maxLength(100)]),
      "descricaoProjeto": this.builder.control('descricao teste', [Validators.required]),
      "etapas":       this.builder.array([
        this.builder.group({
          "idEtapa":    this.builder.control(''),
          "nomeEtapa":  this.builder.control('etapa 1', [Validators.required]),
          "perguntas":  this.builder.array([])
        })
      ])
    });
  }

  public addEtapas() {
    const newEtapa = this.builder.group({
      idEtapa: this.builder.control(''),
      nomeEtapa: this.builder.control('etapa 1', [Validators.required]),
      perguntas: this.builder.array([])
    });
    return this.etapas.push(newEtapa);
  }

  public addPerguntas(indexEtapa :any) {
    const newPergunta = this.builder.group({
      idPergunta: this.builder.control(''),
      descricaoPergunta: this.builder.control('Pergunta nova criada para o projeto de exemplo', [Validators.required]),
      tipoPergunta: this.builder.control('NUMERICO', [Validators.required]),
      opcoesResposta: this.builder.array([])
    });
    return this.getPerguntas(indexEtapa).push(newPergunta);
  }

  public addOpcaoResposta(indexEtapa:any, indexPergunta:any) {
    const newOpcao = this.builder.group({
      opcaoResposta: this.builder.control('descrição opção resposta...')
    });
    return this.getOpcoesResposta(indexEtapa, indexPergunta).push(newOpcao);
  }

  public campoInvalido(campo :string) :boolean | undefined {
    return (
      this.form.get(campo)?.invalid && this.form.get(campo)?.dirty
    )
  }

  gravarDados() :void {
    if (this.form.invalid) {
      //markAllAsDirty(this.form);
      return;
    }

    const projeto = {
      "titulo": this.titulo.value,
      "descricaoProjeto": this.descricaoProjeto.value,
      "etapas": this.etapas.map((etapa, indexEtapa) => {
        return {
          "idEtapa": etapa.get('idEtapa')?.value,
          "nomeEtapa": this.getNomeEtapa(indexEtapa).value,
          "perguntas": this.getPerguntas(indexEtapa).map((pergunta, indexPergunta) => {
            return {
              "idPergunta": pergunta.get('idPergunta')?.value,
              "descricaoPergunta": pergunta.get('descricaoPergunta')?.value,
              "tipoPergunta": pergunta.get('tipoPergunta')?.value,
              "opcoesResposta": this.getOpcoesResposta(indexEtapa, indexPergunta).map(opcao => {
                return {
                  "opcaoResposta": opcao.get('opcaoResposta')?.value,
                  "perguntaID": pergunta.get('idPergunta')?.value
                }
              })
            }
          })
        }
      })
    }
    console.log(projeto)
    this.subscription = this.service.save(projeto, this.id)
      .subscribe({
        next: (res) => alert(res),//this.alert.success(res),
        error: (err) => {
          alert(err) //this.alert.error(err);
        }
      });
  }

  get titulo() :FormControl {
    return this.form.get('titulo') as FormControl;
  }
  get descricaoProjeto() :FormControl {
    return this.form.get('descricaoProjeto') as FormControl;
  }
  get etapas() :FormGroup[] {
    return (this.form.get('etapas') as FormArray).controls as FormGroup[];
  }
  getNomeEtapa(index :any) :FormGroup {
    return this.etapas[index].get('nomeEtapa') as FormGroup;
  }
  getPerguntas(indexEtapa :any) :FormGroup[] {
    return (this.etapas[indexEtapa].get('perguntas') as FormArray).controls as FormGroup[];
  }
  getTipoPergunta(indexEtapa:any, indexPergunta:any) :FormControl {
    return this.getPerguntas(indexEtapa).at(indexPergunta)?.get('tipoPergunta') as FormControl;
  }
  getOpcoesResposta(indexEtapa:any, indexPergunta:any) :FormGroup[] {
    return (this.getPerguntas(indexEtapa).at(indexPergunta)?.get('opcoesResposta') as FormArray).controls as FormGroup[];
  }
}