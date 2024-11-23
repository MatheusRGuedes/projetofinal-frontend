import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from 'src/app/core/services/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private formBuilder :FormBuilder = new FormBuilder();
  loginForm :FormGroup = new FormGroup({});
  errorMessage :string = "";

  constructor(
    private securityService :SecurityService
  ) {
  }

  ngOnInit() :void {
    this.createForm();
  }

  private createForm() :void {
    this.loginForm = this.formBuilder.group({
      "username": this.formBuilder.control("", [Validators.required]),
      "password": this.formBuilder.control("", [Validators.required])
    });
  }

  campoInvalido(campo :string) :boolean | undefined {
    return (
      this.loginForm.get(campo)?.invalid && this.loginForm.get(campo)?.dirty
    );
  }

  private markAllAsDirty(form :FormGroup) {
    Object.keys(form.controls).forEach((field) => {

      const control = form.get(field);

      if (control instanceof FormControl) {
        control.markAsDirty();
      }
    });
  }

  doLogin() {
    if (!this.loginForm.valid) {
      this.markAllAsDirty(this.loginForm);
    } else {
      this.securityService.login({
        "login": this.username, 
        "senha": this.password
      }).subscribe({
        error: (res) => this.errorMessage = res.error.message
      });
    }
  }
  
  public get username() :string {
    return this.loginForm.get("username")?.value;
  }
  public get password() :string {
    return this.loginForm.get("password")?.value;
  }
}