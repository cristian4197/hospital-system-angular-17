import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  return userService.tokenValidate()
          .pipe(
            tap(resp => { 
                if(!resp) {
                  router.navigateByUrl('/auth');
                }
            })
          );
};
