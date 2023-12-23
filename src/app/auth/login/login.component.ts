import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { State } from '../../shared/ui.reducer';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import * as ui from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor( 
      private fb: FormBuilder, 
      private authService: AuthService, 
      private router: Router,
      private store: Store<AppState>){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe( (ui: State) => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  signInUsuario(){
    if(this.loginForm.invalid){return;}

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    console.log(this.loginForm);
    this.authService.loginUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .then( credenciales => {
        console.log(credenciales);
        // Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigateByUrl('/dashboard');
      })
      .catch( err => {
        console.log(err);
        Swal.fire("error en el login", err.message, "error");
      });
  }

}
