import { Routes } from '@angular/router';
import { PortifolioComponent } from './portifolio/portifolio.component';

export const routes: Routes = [
    {path: 'portifolio', component: PortifolioComponent},
    {path: '', redirectTo: '/portifolio', pathMatch: 'full'},
];
