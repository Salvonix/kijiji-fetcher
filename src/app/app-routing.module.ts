import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScraperComponent } from './scraper/scraper.component';


const routes: Routes = [
  { path: 'scraper', component: ScraperComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
