import { Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { GoogleService } from '../../services/google.service';
import Swal from 'sweetalert2';
import { Observable, Subscription, tap } from 'rxjs';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userService = inject(UserService);

  private subscriptions: Subscription = new Subscription();

  constructor(private googleService:GoogleService){  }

  public user!: User;

   async ngOnInit(): Promise<void> {
    this.getUser();
    if(localStorage.getItem('isLoggedInGoogle')) {
      await this.googleService.googleInit();
    }
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
