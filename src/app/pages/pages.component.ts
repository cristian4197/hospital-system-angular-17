import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../services/settings.service';
declare function customInitFunctions(): void;

const COMPONENTS = [
  HeaderComponent,
  SidebarComponent,
  BreadcrumbsComponent
];

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterModule, COMPONENTS],
  templateUrl: './pages.component.html',
  styles: ``
})
export default class PagesComponent implements OnInit{
  public year = new Date().getFullYear();



  constructor(private settingService: SettingsService) { }

  ngOnInit(): void {
    customInitFunctions();
   }
} 
