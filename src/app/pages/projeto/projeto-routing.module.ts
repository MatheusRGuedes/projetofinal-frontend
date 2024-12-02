import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjetoComponent } from './projeto/projeto.component';
import { ListarComponent } from './listar/listar.component';
import { AndamentoComponent } from './listar/andamento/andamento.component';

const routes: Routes = [
  { path: 'cadastro', component: ProjetoComponent }, //role admin
  { path: 'listar', component: ListarComponent },
  { path: 'andamento', component: AndamentoComponent }, //role admin
  { path: 'editar/:id', component: ProjetoComponent }, //role admin
  // { path: '', component:  }, //role admin

  { path: '**', component: ProjetoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjetoRoutingModule {}
