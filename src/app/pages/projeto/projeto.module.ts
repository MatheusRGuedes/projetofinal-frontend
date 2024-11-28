import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetoComponent } from './projeto/projeto.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjetoRoutingModule } from './projeto-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ProjetoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjetoRoutingModule,
    SharedModule,
  ],
})
export class ProjetoModule {}
