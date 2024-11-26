import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjetoComponent } from "./projeto/projeto.component";

const routes :Routes = [
    { path: 'cadastro', component: ProjetoComponent }, //role admin
    // { path: 'editar/:id', component:  }, //role admin
    // { path: '', component:  }, //role admin
    
    { path: '**', component: ProjetoComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjetoRoutingModule {}