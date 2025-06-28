import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import {config} from '../../config';
import {AuthResponse} from '../auth/dto/auth-response.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = config.apiUrl + '/users';
  private currentUserSubject = new BehaviorSubject<AuthResponse['user'] | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }
}
