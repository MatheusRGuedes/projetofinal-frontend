import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-selecao-perguntas',
  templateUrl: './selecao-perguntas.component.html',
  styleUrls: ['./selecao-perguntas.component.css']
})
export class SelecaoPerguntasComponent {

  @Input() public registros :any[] = [];
  @Input() public mostrar: boolean = false;

  @Output()
  onSelecionar = new EventEmitter<any>();

  toggle () {
    this.mostrar = !this.mostrar;
  }

  //esses eventos irão notificar o parent para invocar seus metodos 
  selecionar(pergunta :any) {
    // console.log(etapa);
    this.onSelecionar.emit(pergunta);
  }
}
