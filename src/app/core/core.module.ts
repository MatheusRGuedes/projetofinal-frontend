import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "../app-routing.module";
import { HeaderComponent } from "./components/header/header.component";
import { PrincipalComponent } from "./components/principal/principal.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

@NgModule({
    declarations: [
      HeaderComponent,
      PrincipalComponent,
      SidebarComponent
    ],
    imports: [
      CommonModule,
      HttpClientModule,
      AppRoutingModule
    ]
  })
  export class CoreModule { }