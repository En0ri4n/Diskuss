import { Component } from '@angular/core';
import {ChatComponent} from '../../components/chat/chat.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    ChatComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
