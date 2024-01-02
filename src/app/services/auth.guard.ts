// import { CanActivateFn } from '@angular/router';
// import { AuthService } from './auth.service';

// export const authGuard: CanActivateFn = (route, state) => {

//   constructor( private authService: AuthService)
//   return false;
// };

// import { inject } from '@angular/core'; 
// import { CanActivateFn, Router } from '@angular/router'; 
// import { tap } from 'rxjs'; 
// import { AuthService } from './auth.service'; 

// export const authGuard:CanActivateFn = (route, state) =>{   
//   const router = inject(Router);   
//   return inject(AuthService).isAuth().pipe(     
//     tap(estado => {       
//       if(!estado) {router.navigate(['/login'])}     
//     })     
//   ) }


  import { Injectable } from '@angular/core';
  import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
  import { Observable } from 'rxjs';
  import { take, tap } from 'rxjs/operators';
  import { AuthService } from './auth.service';
  
  @Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanLoad {
    constructor(private authService: AuthService, private router: Router) {}
  
    canLoad(
      route: Route,
      segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.isAuth().pipe(
        take(1),
        tap(isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigate(['/login']);
          }
        })
      );
    }
  }