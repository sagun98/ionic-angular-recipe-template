import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string; 
  refreshToken:string;
  localId:string;
  expiresIn: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  constructor(private http:HttpClient) { }

  get userIsAuthenticated(){
    return this._user.asObservable().pipe(map(user => !!user.token));
  }

  login(email: string, password: string){
    this._userIsAuthenticated = true; 
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, {
      email: email,
      password:password,
      returnSecureToken: true 
    });
  }

  logout(){
    this._userIsAuthenticated= false;
  }

  signup(email:string, password:string){
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
    {
      email: email,
      password:password,
      returnSecureToken: true 
    }
    );
  }

  get userId() {
    return this._userId;
  }

}
