import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  name: string = '';
  userSubs!: Subscription;

  constructor( private authService: AuthService,
               private router: Router,
               private store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
    .pipe(
      filter( ({user}) => user != null)
    )
    .subscribe( ( {user}) => {
      
        this.name = user!.nombre;
      
    }
    );
  }

  ngDestroy(): void {
    this.userSubs.unsubscribe();
  }

  logout() {
    this.authService.logout().then( () => {
      this.router.navigateByUrl('/login');
    } );
  }

}
