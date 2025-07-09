import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
    imports: [
        RouterLink
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  logout() {
    localStorage.removeItem('token');
    window.location.reload(); // Reload to reflect changes in the UI
  }
}
