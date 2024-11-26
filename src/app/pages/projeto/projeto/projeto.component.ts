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
        // this.builder.group({
        //   "nomeEtapa":   this.builder.control('', [Validators.required]),
        //   "perguntas":   this.builder.control('', [Validators.required]),
        // })
      ])
    });
  }

  public addEtapas() {
    const newEtapa = this.builder.group({
      nomeEtapa: this.builder.control('etapa 1', [Validators.required]),
      perguntas: this.builder.control('')
    });
    return this.etapas.push(newEtapa);
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
      "etapas": this.etapas.map((etapa, index) => {return {
        "nomeEtapa": this.getNomeEtapa(index).value,
        "perguntas": []
      }})
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
}