import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthResponse} from './dto/auth-response.dto';
import {config} from '../../config';

@Injectable({providedIn: 'root'})
export class AuthService {
  private API_URL = config.apiUrl + '/auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  register(data: { username: string, email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((res) => {
        this.handleAuth(res);
      })
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
      tap((res) => {
        this.handleAuth(res);
      })
    );
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
