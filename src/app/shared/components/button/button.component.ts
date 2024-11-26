import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'botao-acao',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Output('executaAcaoEvent')
  private executaAcaoEvent :EventEmitter<any> = new EventEmitter();

  @Input('styleId')
  public id :string = '';
  @Input('desabilitado')
  public disabled :boolean = false;
  @Input('color')
  public color :string = 'primario';

  constructor() {}

  protected executaAcao() :void {
    this.executaAcaoEvent.emit();
  }
}
