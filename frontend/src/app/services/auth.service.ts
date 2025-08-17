// // // // File: app/services/auth.service.ts
// // // import { Injectable } from '@angular/core';
// // // import { HttpClient } from '@angular/common/http';
// // // import { BehaviorSubject, Observable, tap } from 'rxjs';
// // // import { User } from '../models/user.model';
// // // import { environment } from '../../environments/environment';

// // // @Injectable({
// // //   providedIn: 'root',
// // // })
// // // export class AuthService {
// // //   private apiUrl = `${environment.apiUrl}/users`;
// // //   private currentUserSubject = new BehaviorSubject<User | null>(
// // //     this.getUserFromStorage()
// // //   );
// // //   public currentUser$ = this.currentUserSubject.asObservable();

// // //   constructor(private http: HttpClient) {}

// // //   login(username: string, password: string): Observable<any> {
// // //     // Using Basic Auth, so we don't need a specific login endpoint
// // //     // Instead, we'll make a request to get the user profile
// // //     // The AuthInterceptor will add the Authorization header
// // //     localStorage.setItem('credentials', btoa(`${username}:${password}`));

// // //     return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
// // //       tap((user) => {
// // //         this.currentUserSubject.next(user);
// // //         localStorage.setItem('currentUser', JSON.stringify(user));
// // //       })
// // //     );
// // //   }

// // //   register(user: User): Observable<User> {
// // //     return this.http.post<User>(`${this.apiUrl}/register`, user);
// // //   }

// // //   logout(): void {
// // //     localStorage.removeItem('credentials');
// // //     localStorage.removeItem('currentUser');
// // //     this.currentUserSubject.next(null);
// // //   }

// // //   isAuthenticated(): boolean {
// // //     return !!localStorage.getItem('credentials');
// // //   }

// // //   getCurrentUser(): User | null {
// // //     return this.currentUserSubject.value;
// // //   }

// // //   private getUserFromStorage(): User | null {
// // //     const user = localStorage.getItem('currentUser');
// // //     return user ? JSON.parse(user) : null;
// // //   }
// // // }

// // // File: app/services/auth.service.ts
// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { Observable, BehaviorSubject, throwError } from 'rxjs';
// // import { tap, catchError } from 'rxjs/operators';
// // import { Router } from '@angular/router';
// // import { User } from '../models/user.model';
// // import { environment } from '../../environments/environment';

// // interface AuthResponse {
// //   token: string;
// //   user: User;
// // }

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class AuthService {
// //   private apiUrl = `${environment.apiUrl}/auth`;
// //   private tokenKey = 'pdf_signature_app_token';
// //   private userKey = 'pdf_signature_app_user';

// //   private currentUserSubject = new BehaviorSubject<User | null>(
// //     this.getUserFromStorage()
// //   );
// //   public currentUser$ = this.currentUserSubject.asObservable();

// //   private isAuthenticatedSubject = new BehaviorSubject<boolean>(
// //     this.hasToken()
// //   );
// //   public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

// //   constructor(private http: HttpClient, private router: Router) {}

// //   login(username: string, password: string): Observable<AuthResponse> {
// //     return this.http
// //       .post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
// //       .pipe(
// //         tap((response) => this.handleAuthentication(response)),
// //         catchError(this.handleError)
// //       );
// //   }

// //   register(user: User): Observable<AuthResponse> {
// //     return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
// //       tap((response) => this.handleAuthentication(response)),
// //       catchError(this.handleError)
// //     );
// //   }

// //   logout(): void {
// //     localStorage.removeItem(this.tokenKey);
// //     localStorage.removeItem(this.userKey);
// //     this.currentUserSubject.next(null);
// //     this.isAuthenticatedSubject.next(false);
// //     this.router.navigate(['/login']);
// //   }

// //   getToken(): string | null {
// //     return localStorage.getItem(this.tokenKey);
// //   }

// //   getCurrentUser(): User | null {
// //     return this.currentUserSubject.value;
// //   }

// //   isAuthenticated(): boolean {
// //     return this.hasToken();
// //   }

// //   checkAuthStatus(): void {
// //     const token = this.getToken();
// //     if (token) {
// //       // Verify token validity with server
// //       this.http
// //         .get<User>(`${this.apiUrl}/me`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         })
// //         .pipe(
// //           catchError(() => {
// //             this.logout();
// //             return throwError(() => new Error('Session expired'));
// //           })
// //         )
// //         .subscribe((user) => {
// //           this.setUserInStorage(user);
// //           this.currentUserSubject.next(user);
// //           this.isAuthenticatedSubject.next(true);
// //         });
// //     } else {
// //       this.isAuthenticatedSubject.next(false);
// //       this.currentUserSubject.next(null);
// //     }
// //   }

// //   private handleAuthentication(response: AuthResponse): void {
// //     localStorage.setItem(this.tokenKey, response.token);
// //     this.setUserInStorage(response.user);
// //     this.currentUserSubject.next(response.user);
// //     this.isAuthenticatedSubject.next(true);
// //   }

// //   private setUserInStorage(user: User): void {
// //     localStorage.setItem(this.userKey, JSON.stringify(user));
// //   }

// //   private getUserFromStorage(): User | null {
// //     const userData = localStorage.getItem(this.userKey);
// //     return userData ? JSON.parse(userData) : null;
// //   }

// //   private hasToken(): boolean {
// //     return !!this.getToken();
// //   }

// //   private handleError(error: any) {
// //     let errorMessage = 'An unknown error occurred';

// //     if (error.error instanceof ErrorEvent) {
// //       // Client-side error
// //       errorMessage = `Error: ${error.error.message}`;
// //     } else {
// //       // Server-side error
// //       if (error.status === 401) {
// //         errorMessage = 'Unauthorized access. Please login again.';
// //       } else if (error.status === 403) {
// //         errorMessage =
// //           'Forbidden access. You do not have permission to perform this action.';
// //       } else if (error.status === 500) {
// //         errorMessage = 'Internal server error. Please try again later.';
// //       } else {
// //         errorMessage = `Error: ${error.message}`;
// //       }
// //     }
// //     console.error(errorMessage, error);
// //     return throwError(() => new Error(errorMessage));
// //   }
// // }

// // File: app/services/auth.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject, throwError } from 'rxjs';
// import { tap, catchError } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { User } from '../models/user.model';
// import { environment } from '../envirennements/environnement';

// interface AuthResponse {
//   token: string;
//   user: User;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private apiUrl = `${environment.apiUrl}/auth`;
//   private tokenKey = 'pdf_signature_app_token';
//   private userKey = 'pdf_signature_app_user';

//   private currentUserSubject = new BehaviorSubject<User | null>(
//     this.getUserFromStorage()
//   );
//   public currentUser$ = this.currentUserSubject.asObservable();

//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(
//     this.hasToken()
//   );
//   public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

//   constructor(private http: HttpClient, private router: Router) {}

//   login(username: string, password: string): Observable<AuthResponse> {
//     return this.http
//       .post<AuthResponse>(`${this.apiUrl}/`, { username, password })
//       .pipe(
//         tap((response) => this.handleAuthentication(response)),
//         catchError(this.handleError)
//       );
//   }

//   register(user: User): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
//       tap((response) => this.handleAuthentication(response)),
//       catchError(this.handleError)
//     );
//   }

//   logout(): void {
//     localStorage.removeItem(this.tokenKey);
//     localStorage.removeItem(this.userKey);
//     this.currentUserSubject.next(null);
//     this.isAuthenticatedSubject.next(false);
//     this.router.navigate(['/login']);
//   }

//   getToken(): string | null {
//     return localStorage.getItem(this.tokenKey);
//   }

//   getCurrentUser(): User | null {
//     return this.currentUserSubject.value;
//   }

//   isAuthenticated(): boolean {
//     return this.hasToken();
//   }

//   checkAuthStatus(): void {
//     const token = this.getToken();
//     if (token) {
//       // Verify token validity with server
//       this.http
//         .get<User>(`${this.apiUrl}/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .pipe(
//           catchError(() => {
//             this.logout();
//             return throwError(() => new Error('Session expired'));
//           })
//         )
//         .subscribe((user) => {
//           this.setUserInStorage(user);
//           this.currentUserSubject.next(user);
//           this.isAuthenticatedSubject.next(true);
//         });
//     } else {
//       this.isAuthenticatedSubject.next(false);
//       this.currentUserSubject.next(null);
//     }
//   }

//   private handleAuthentication(response: AuthResponse): void {
//     localStorage.setItem(this.tokenKey, response.token);
//     this.setUserInStorage(response.user);
//     this.currentUserSubject.next(response.user);
//     this.isAuthenticatedSubject.next(true);
//   }

//   private setUserInStorage(user: User): void {
//     localStorage.setItem(this.userKey, JSON.stringify(user));
//   }

//   private getUserFromStorage(): User | null {
//     const userData = localStorage.getItem(this.userKey);
//     return userData ? JSON.parse(userData) : null;
//   }

//   private hasToken(): boolean {
//     return !!this.getToken();
//   }

//   private handleError(error: any) {
//     let errorMessage = 'An unknown error occurred';

//     if (error.error instanceof ErrorEvent) {
//       // Client-side error
//       errorMessage = `Error: ${error.error.message}`;
//     } else if (error.status) {
//       // Server-side error
//       switch (error.status) {
//         case 401:
//           errorMessage = 'Invalid username or password';
//           break;
//         case 409:
//           errorMessage = 'Username or email already exists';
//           break;
//         case 500:
//           errorMessage = 'Server error. Please try again later';
//           break;
//         default:
//           errorMessage = `Error ${error.status}: ${
//             error.error?.message || error.statusText
//           }`;
//       }
//     }

//     console.error(errorMessage, error);
//     return throwError(() => new Error(errorMessage));
//   }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';
// import { environment } from '../envirennements/environnement';

// interface AuthResponse {
//   token: string;
//   refreshToken: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//   };
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private currentUserSubject: BehaviorSubject<any>;
//   public currentUser: Observable<any>;
//   private readonly API_URL = environment.apiUrl;

//   constructor(private http: HttpClient) {
//     const storedUser = localStorage.getItem('currentUser');
//     this.currentUserSubject = new BehaviorSubject<any>(
//       storedUser ? JSON.parse(storedUser) : null
//     );
//     this.currentUser = this.currentUserSubject.asObservable();
//   }

//   public get currentUserValue() {
//     return this.currentUserSubject.value;
//   }

//   public get isAuthenticated(): boolean {
//     return !!this.currentUserValue;
//   }

//   public get authToken(): string | null {
//     return this.currentUserValue ? this.currentUserValue.token : null;
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token'); // Adjust the token retrieval logic as needed
//   }

//   login(email: string, password: string): Observable<any> {
//     return this.http
//       .post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password })
//       .pipe(
//         map((response) => {
//           // Store user details and token in local storage
//           localStorage.setItem('currentUser', JSON.stringify(response));
//           this.currentUserSubject.next(response);
//           return response;
//         }),
//         catchError((error) => {
//           return throwError(() => error);
//         })
//       );
//   }

//   register(name: string, email: string, password: string): Observable<any> {
//     return this.http
//       .post<AuthResponse>(`${this.API_URL}/auth/register`, {
//         name,
//         email,
//         password,
//       })
//       .pipe(
//         catchError((error) => {
//           return throwError(() => error);
//         })
//       );
//   }

//   forgotPassword(email: string): Observable<any> {
//     return this.http
//       .post(`${this.API_URL}/auth/forgot-password`, { email })
//       .pipe(
//         catchError((error) => {
//           return throwError(() => error);
//         })
//       );
//   }

//   resetPassword(token: string, password: string): Observable<any> {
//     return this.http
//       .post(`${this.API_URL}/auth/reset-password`, { token, password })
//       .pipe(
//         catchError((error) => {
//           return throwError(() => error);
//         })
//       );
//   }

//   logout(): void {
//     // Remove user from local storage
//     localStorage.removeItem('currentUser');
//     this.currentUserSubject.next(null);
//   }

//   updateProfile(userData: any): Observable<any> {
//     return this.http.put(`${this.API_URL}/users/profile`, userData).pipe(
//       tap((updatedUser) => {
//         const currentUser = this.currentUserValue;
//         const updatedUserData = {
//           ...currentUser,
//           user: {
//             ...currentUser.user,
//             ...updatedUser,
//           },
//         };
//         localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
//         this.currentUserSubject.next(updatedUserData);
//       }),
//       catchError((error) => {
//         return throwError(() => error);
//       })
//     );
//   }

//   refreshToken(): Observable<any> {
//     return this.http
//       .post<AuthResponse>(`${this.API_URL}/auth/refresh-token`, {
//         refreshToken: this.currentUserValue?.refreshToken,
//       })
//       .pipe(
//         tap((response) => {
//           const updatedUser = {
//             ...this.currentUserValue,
//             token: response.token,
//             refreshToken: response.refreshToken,
//           };
//           localStorage.setItem('currentUser', JSON.stringify(updatedUser));
//           this.currentUserSubject.next(updatedUser);
//         }),
//         catchError((error) => {
//           // If refresh token fails, log user out
//           if (error.status === 401) {
//             this.logout();
//           }
//           return throwError(() => error);
//         })
//       );
//   }

//   // Check if token is valid (can be used for route guards)
//   verifyToken(): Observable<boolean> {
//     if (!this.currentUserValue) {
//       return of(false);
//     }

//     return this.http
//       .get<{ valid: boolean }>(`${this.API_URL}/auth/verify-token`)
//       .pipe(
//         map((response) => response.valid),
//         catchError(() => {
//           this.logout();
//           return of(false);
//         })
//       );
//   }
// }

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../envirennements/environnement';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  private authSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {}

  // Changed to getter property
  get isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  get authStatus(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get currentUser(): any {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // login(email: string, password: string): Observable<AuthResponse> {
  //   return this.http
  //     .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
  //     .pipe(
  //       tap((response) => {
  //         this.setSession(response);
  //         this.authSubject.next(true);
  //       })
  //     );
  // }

  login(email: string, password: string): Observable<AuthResponse> {
    console.log('Attempting login with:', email);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          console.log('Login successful, response:', response);
          this.setSession(response);
          this.authSubject.next(true);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Login error:', error);
          console.error('Error details:', error.error);
          return throwError(
            () => new Error(error.error?.message || 'Login failed')
          );
        })
      );
  }

  register(payload: {
    username: string;
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(
        tap((response) => {
          this.setSession(response);
          this.authSubject.next(true);
        })
      );
  }
  // register(registerRequest: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/register`, registerRequest).pipe(
  //     catchError((error) => {
  //       console.error('Registration error:', error);
  //       if (error instanceof HttpErrorResponse) {
  //         console.error('Response body:', error.error);
  //       }
  //       return throwError(error);
  //     })
  //   );
  // }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.authSubject.next(false);
  }

  private setSession(authResult: AuthResponse): void {
    console.log('Setting session with token:', authResult.token);
    localStorage.setItem(this.tokenKey, authResult.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
  }

  private hasValidToken(): boolean {
    const token = this.token;
    if (!token) return false;

    // Simple check if token is expired
    // In a real app, you'd probably decode the JWT and check the exp claim
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (e) {
      return false;
    }
  }
}
