import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-setting',
  standalone: true,
  imports: [],
  templateUrl: './account-setting.component.html',
  styles: ``
})
export default class AccountSettingComponent implements OnInit {
  public links!: NodeListOf<Element>;
  
  constructor(private settingsService: SettingsService) { }
  
  ngOnInit(): void {
    this.links = document.querySelectorAll('.selector');
    this.settingsService.checkCurrentTheme(this.links);
  }

  changeTheme(theme: string) {
    this.settingsService.changeTheme(theme);
    this.settingsService.checkCurrentTheme(this.links);
  }

}
