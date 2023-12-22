import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  crearUsuario() {

    if ( this.registerForm.invalid ) { return; }
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    const { nombre, correo, password } = this.registerForm.value;
    this.authService.createUser(nombre, correo, password )
      .then( credenciales => {
        console.log( credenciales );
        Swal.close()
        this.router.navigateByUrl('/dashboard');
      })
      .catch( err => {
        console.log(err);
        Swal.fire("Error en el registro", err.message, "error");
      });
  }

}
