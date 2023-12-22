import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor( private fb: FormBuilder, private authService: AuthService, private router: Router){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  ngOnInit(): void {
  }

  signInUsuario(){
    if(this.loginForm.invalid){return;}
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    console.log(this.loginForm);
    this.authService.loginUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .then( credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigateByUrl('/dashboard');
      })
      .catch( err => {
        console.log(err);
        Swal.fire("error en el login", err.message, "error");
      });
  }

}
