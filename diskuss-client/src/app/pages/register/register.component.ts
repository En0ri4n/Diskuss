import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Logique d'inscription ici
      console.log('Register', this.registerForm.value);
    } else {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
    }
  }
}
