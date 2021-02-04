// import { Injectable } from '@angular/core';
// import { HttpInterceptor } from '@angular/common/http';

// @Injectable()
// export class TokenInterceptorService implements HttpInterceptor {
//   constructor(private authService: AuthService) { }

//   intercept(req, next) {
//     const tokenizedReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${this.authService.getToken()}`
//       }
//     });
//     return next.handle(tokenizedReq);
//   }
// }
