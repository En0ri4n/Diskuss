import { Component } from '@angular/core';
import {ChatComponent} from '../../components/chat/chat.component';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  imports: [
    ChatComponent,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
