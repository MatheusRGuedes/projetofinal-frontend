import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './core/components/principal/principal.component';

const routes: Routes = [
  // { 
  //   path: 'login', 
  //   component: LoginComponent, 
  //   canActivate: [ UsuarioNaoAutenticadoGuard ] 
  // },
  {
    path: '',
    component: PrincipalComponent,
    canActivate: [] //,
    // children: [
    //   {
        //path: 'funcionarios',
        //canMatch: [IsAdminGuard], //conteúdo admin
        //canActivateChild: [IsAdminGuard], //acesso admin
        //loadChildren: () => import('./pages/funcionario/funcionario.module').then(module => module.FuncionarioModule)
    //   }
    // ]
  },

  {
    path: "**", redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
