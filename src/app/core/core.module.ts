import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "../app-routing.module";
import { HeaderComponent } from "./components/header/header.component";
import { PrincipalComponent } from "./components/principal/principal.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { TokenInterceptor } from "./interceptors/token.interceptor";

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
    ],
    providers: [
      TokenInterceptor,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }
    ]
  })
  export class CoreModule { }