// // File: app/components/login/login.component.ts
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   loading = false;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {
//     this.loginForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', Validators.required],
//     });
//   }

//   onSubmit(): void {
//     if (this.loginForm.invalid) {
//       return;
//     }

//     this.loading = true;
//     const { username, password } = this.loginForm.value;

//     this.authService.login(username, password).subscribe({
//       next: () => {
//         this.router.navigate(['/']);
//       },
//       error: (error) => {
//         console.error('Login error', error);
//         this.snackBar.open(
//           'Login failed: ' + (error.error || 'Invalid credentials'),
//           'Close',
//           {
//             duration: 5000,
//           }
//         );
//         this.loading = false;
//       },
//     });
//   }
// }

// login.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import {
  MatProgressSpinnerModule,
  MatSpinner,
} from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule, // needed for formControlName
    RouterModule, // if you're using routerLink
    MatError,
    MatLabel,
    ReactiveFormsModule,
    MatSpinner,
    MatFormField,
    MatInputModule, //this is not importable and I do not know why
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Log In</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                formControlName="email"
                type="email"
                placeholder="Enter your email"
              />
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')"
                >Email is required</mat-error
              >
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')"
                >Please enter a valid email</mat-error
              >
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                formControlName="password"
                type="password"
                placeholder="Enter your password"
              />
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')"
                >Password is required</mat-error
              >
            </mat-form-field>

            <div class="form-actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
              >
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">Log In</span>
              </button>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button routerLink="/register"
            >Don't have an account? Register
          </a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
      }
      .login-card {
        width: 400px;
        max-width: 90%;
      }
      .full-width {
        width: 100%;
        margin-bottom: 15px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
      }
      mat-spinner {
        margin-right: 8px;
        display: inline-block;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['']);
    }
  }

  // onSubmit(): void {
  //   if (this.loginForm.valid) {
  //     this.isLoading = true;
  //     const { email, password } = this.loginForm.value;
  //     console.log('Form values:', { email, password });

  //     this.authService.login(email, password).subscribe({
  //       next: () => {
  //         this.isLoading = false;
  //         this.router.navigate(['/']);
  //       },
  //       error: (error) => {
  //         this.isLoading = false;
  //         this.snackBar.open(error.message || 'Login failed', 'Close', {
  //           duration: 5000,
  //           panelClass: ['error-snackbar'],
  //         });
  //       },
  //     });
  //   }
  // }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      console.log('Form values:', { email, password });

      this.authService.login(email, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error in component:', error);

          const errorMessage =
            error.message || 'Login failed. Please check your credentials.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }
}
