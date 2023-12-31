import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresoSubs!: Subscription;

  constructor( 
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService ) {}
    
  ngOnInit( ){
    this.ingresoSubs = this.store.select('ingresosEgresos')
    .subscribe( ({ items }) => this.ingresosEgresos = items );
   }

   ngOnDestroy(){
    this.ingresoSubs.unsubscribe();
   }

   borrar(uid: string | undefined ){
     this.ingresoEgresoService.borrarIngresoEgreso(uid)
     .then(() => {
      Swal.fire('Borrado', 'Item borrado', 'success');
    })
    .catch((err) => {
      Swal.fire('Error', err.message , 'error');
    });
   }
   

}
