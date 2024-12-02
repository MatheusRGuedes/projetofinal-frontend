import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetoComponent } from './projeto/projeto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjetoRoutingModule } from './projeto-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelecaoEtapasComponent } from './selecao-etapas/selecao-etapas.component';
import { SelecaoPerguntasComponent } from './selecao-perguntas/selecao-perguntas.component';
import { AndamentoComponent } from './listar/andamento/andamento.component';
import { ResponderComponent } from './responder/responder.component';

@NgModule({
  declarations: [
    ProjetoComponent, 
    AndamentoComponent, 
    SelecaoEtapasComponent,
    SelecaoPerguntasComponent,
    ResponderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjetoRoutingModule,
    SharedModule,
    FormsModule
  ],
})
export class ProjetoModule {}
