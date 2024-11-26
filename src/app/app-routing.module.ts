import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './core/components/principal/principal.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
    //canActivate: [ UsuarioNaoAutenticadoGuard ] 
  },
  {
    path: '',
    component: PrincipalComponent,
    canActivate: [],
    children: [
      {
        path: 'projetos',
        //canMatch: [], //IsAdminGuard
        //canActivateChild: [IsAdminGuard], //acesso admin
        loadChildren: () => import('./pages/projeto/projeto.module').then(module => module.ProjetoModule)
      }
    ]
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
