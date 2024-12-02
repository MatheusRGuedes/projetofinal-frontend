import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjetoComponent } from './projeto/projeto.component';
import { ListarComponent } from './listar/listar.component';
import { AndamentoComponent } from './listar/andamento/andamento.component';
import { ResponderComponent } from './responder/responder.component';

const routes: Routes = [
  { path: 'cadastro', component: ProjetoComponent },
  { path: 'listar', component: ListarComponent },
  { path: 'andamento', component: AndamentoComponent }, //role admin
  { path: 'editar/:id', component: ProjetoComponent }, //role admin
  { path: 'responder/:id', component: ResponderComponent },
  { path: 'responder/:id/:idUsuario', component: ResponderComponent },
  // { path: 'editar/:id', component:  }, //role admin
  // { path: '', component:  }, //role admin

  { path: '**', component: ProjetoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjetoRoutingModule {}
