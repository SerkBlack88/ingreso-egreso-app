// import { CanActivateFn } from '@angular/router';
// import { AuthService } from './auth.service';

// export const authGuard: CanActivateFn = (route, state) => {

//   constructor( private authService: AuthService)
//   return false;
// };

import { inject } from '@angular/core'; 
import { CanActivateFn, Router } from '@angular/router'; 
import { tap } from 'rxjs'; 
import { AuthService } from './auth.service'; 

export const authGuard:CanActivateFn = (route, state) =>{   
  const router = inject(Router);   
  return inject(AuthService).isAuth().pipe(     
    tap(estado => {       
      if(!estado) {router.navigate(['/login'])}     
    })     
  ) }