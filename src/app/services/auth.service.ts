import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'lms_users';
  private readonly CURRENT_USER_KEY = 'lms_current_user';

  private getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    const users: User[] = data ? JSON.parse(data) : [];
    // Seed default admin and lead if not present
    if (!users.find(u => u.email === 'admin@lms.com')) {
      users.push({ id: 'admin-1', username: 'Admin', email: 'admin@lms.com', password: 'Admin1234', role: 'admin' });
    }
    if (!users.find(u => u.email === 'lead@lms.com')) {
      users.push({ id: 'lead-1', username: 'Lead', email: 'lead@lms.com', password: 'Lead1234', role: 'lead' });
    }
    return users;
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  register(user: Omit<User, 'id' | 'role'>): { success: boolean; message: string } {
    const users = this.getUsers();
    if (users.find(u => u.email === user.email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser: User = { ...user, id: Date.now().toString(), role: 'user' };
    users.push(newUser);
    this.saveUsers(users);
    return { success: true, message: 'Registration successful! Please login.' };
  }

  login(email: string, password: string): User | null {
    const users = this.getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(found));
      return found;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }

  isLead(): boolean {
    return this.getCurrentUser()?.role === 'lead';
  }
}
