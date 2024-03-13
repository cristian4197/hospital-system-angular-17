import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  menuItem!: any[];

  constructor(private sidebarService: SidebarService) { 
    this.menuItem = this.sidebarService.menu;
    console.log(this.menuItem);
    
   }
}
