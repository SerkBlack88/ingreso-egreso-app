import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { State } from '../../shared/ui.reducer';

import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  registerForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.uiSubscription = this.store.select('ui').subscribe( (ui: State) => this.cargando = ui.isLoading);
  }

  crearUsuario() {

    if ( this.registerForm.invalid ) { return; }

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });
    const { nombre, correo, password } = this.registerForm.value;
    this.authService.createUser(nombre, correo, password )
      .then( credenciales => {
        console.log( credenciales );
        // Swal.close()
        this.store.dispatch( ui.stopLoading() );
        this.router.navigateByUrl('/dashboard');
      })
      .catch( err => {
        console.log(err);
        this.store.dispatch( ui.stopLoading() );
        Swal.fire("Error en el registro", err.message, "error");
      });
  }

}
