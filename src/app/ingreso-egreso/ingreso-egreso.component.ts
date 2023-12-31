import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as ui from 'src/app/shared/ui.actions';

import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { State } from '../shared/ui.reducer';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent {

  ingresoForm: FormGroup;
  cargando: boolean = false;
  tipo: string = 'ingreso';
  uiSubscription!: Subscription;

  constructor( 
    private fb: FormBuilder, 
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState> ) {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });
   }

   ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe( (ui: State) => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }


  guardar(){

    if (this.ingresoForm.invalid){return;}
    this.store.dispatch( ui.isLoading() );

    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );

    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
      .then( () => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Registro creado', descripcion, 'success');
        this.ingresoForm.reset();
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire('Error', err.message, 'error');
      }
      );
  }

}
