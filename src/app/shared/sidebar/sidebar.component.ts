import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { GoogleService } from '../../services/google.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit, OnDestroy {

  private userService = inject(UserService);

  public user!: User;

  public menuItem!: any[];

  private subscriptions: Subscription = new Subscription();

  constructor(private sidebarService: SidebarService, private googleService:GoogleService) {
    this.menuItem = this.sidebarService.menu;
  }

   ngOnInit(): void {
    this.getUser();
  }

  logout(): void {
    if(localStorage.getItem('isLoggedInGoogle')) {
      
      this.logoutStateGoogle();
    }

    this.userService.logout();   
  }

  private logoutStateGoogle(): void {
    this.googleService.state.subscribe(state => {      
      if(state) {
        this.googleService.logout();   
      }
    });
  }

  getUser(): void {
    this.subscriptions.add(
      this.userService.user.subscribe(        
        resp => {
          this.user = resp 
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
}
