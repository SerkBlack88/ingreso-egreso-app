import { Component } from '@angular/core';

import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';


import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent {

  userSubs!: Subscription;
  ingresosSubs!: Subscription;

  constructor( 
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService) { }

    ngOnInit(): void {
      this.userSubs = this.store.select('user')
        .pipe(
          filter( auth => auth.user != null)
        )
        .subscribe( ({user}) => {
          console.log(user);
          this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener( user!.uid )
            .subscribe( ingresosEgresosFB => {
              console.log('ing', ingresosEgresosFB);
              this.store.dispatch( ingresosEgresosActions.setItems({ items: ingresosEgresosFB }));
            });
        });
    }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
    this.ingresosSubs?.unsubscribe();
  }

}
