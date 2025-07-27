// // // app.routes.ts
// // import { Routes } from '@angular/router';
// // import { LoginComponent } from './components/login/login.component';
// // import { RegisterComponent } from './components/register/register.component';
// // import { DashboardComponent } from './components/dashboard/dashboard.component';
// // import { DocumentListComponent } from './components/document-list/document-list.component';
// // import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
// // import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
// // import { SignatureListComponent } from './components/signature-list/signature-list.component';
// // import { AuthGuard } from './services/auth.guard';

// // export const routes: Routes = [
// //   { path: 'login', component: LoginComponent },
// //   { path: 'register', component: RegisterComponent },
// //   {
// //     path: '',
// //     component: DashboardComponent,
// //     canActivate: [AuthGuard],
// //     children: [
// //       { path: '', redirectTo: 'documents', pathMatch: 'full' },
// //       { path: 'documents', component: DocumentListComponent },
// //       { path: 'documents/upload', component: DocumentUploadComponent },
// //       { path: 'documents/:id', component: DocumentViewerComponent },
// //       { path: 'signatures', component: SignatureListComponent },
// //     ],
// //   },
// //   { path: '**', redirectTo: '' },
// // ];

// import { Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { DocumentListComponent } from './components/document-list/document-list.component';
// import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
// import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
// import { SignatureListComponent } from './components/signature-list/signature-list.component';
// import { AuthGuard } from './guards/auth.guard';

// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   {
//     path: '',
//     component: DashboardComponent,
//     canActivate: [AuthGuard],
//     children: [
//       { path: '', redirectTo: 'documents', pathMatch: 'full' },
//       { path: 'documents', component: DocumentListComponent },
//       { path: 'documents/upload', component: DocumentUploadComponent },
//       { path: 'documents/:id', component: DocumentViewerComponent },
//       { path: 'signatures', component: SignatureListComponent },
//     ],
//   },
//   { path: '**', redirectTo: '' },
// ];

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { SignatureListComponent } from './components/signature-list/signature-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'documents', pathMatch: 'full' },
      { path: 'documents', component: DocumentListComponent },
      { path: 'documents/upload', component: DocumentUploadComponent },

      // 👇 For viewing original document
      { path: 'documents/view/:id', component: DocumentViewerComponent },

      // 👇 For viewing signed document
      { path: 'documents/signed/:id', component: DocumentViewerComponent },

      { path: 'signatures', component: SignatureListComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
