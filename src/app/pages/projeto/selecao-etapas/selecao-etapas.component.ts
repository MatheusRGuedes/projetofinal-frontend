import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-selecao-etapas',
  templateUrl: './selecao-etapas.component.html',
  styleUrls: ['./selecao-etapas.component.css']
})
export class SelecaoEtapasComponent {

  @Input() public registros :any[] = [];
  @Input() public mostrar: boolean = false;

  @Output()
  onSelecionar = new EventEmitter<any>();

  toggle () {
    this.mostrar = !this.mostrar;
  }

  //esses eventos irão notificar o parent para invocar seus metodos 
  selecionar(etapa :any) {
    // console.log(etapa);
    this.onSelecionar.emit(etapa);
  }
}
