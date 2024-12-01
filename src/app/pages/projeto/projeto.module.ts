import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetoComponent } from './projeto/projeto.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjetoRoutingModule } from './projeto-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelecaoEtapasComponent } from './selecao-etapas/selecao-etapas.component';
import { SelecaoPerguntasComponent } from './selecao-perguntas/selecao-perguntas.component';

@NgModule({
  declarations: [
    ProjetoComponent,
    SelecaoEtapasComponent,
    SelecaoPerguntasComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjetoRoutingModule,
    SharedModule
  ]
})
export class ProjetoModule { }
