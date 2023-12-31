import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, Unsubscribe } from '@angular/fire/auth';
import { setDoc, Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Subscription, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSuscription: Unsubscribe | undefined;
  private _user!: Usuario | null;

  get User() {
    console.log('user', this._user);
    return {...this._user};
  }
 
  constructor(private auth: Auth, private firestore: Firestore, private store: Store<AppState>) { }
 
  initAuthListener() {
    authState(this.auth).subscribe( fUser => {
      // console.log(fUser?.uid);
      // if( fUser ) this.store.dispatch( authActions.setUser );
      if (fUser ) {
        const userDoc = doc(this.firestore, `${ fUser.uid }/user`);
        this.userSuscription = onSnapshot(userDoc, (docSnapshot) => {
          console.log('docSnapshot', docSnapshot.data());
          const user = docSnapshot.data() as Usuario;
          this._user = user;
          console.log('usersasdfasdf', this._user);
          this.store.dispatch( authActions.setUser({ user }) );
        });
      }
      else {
        this._user = null;
        this.userSuscription?.();
        this.store.dispatch( authActions.unsetUser() );
        this.store.dispatch( ingresosEgresosActions.unSetItems() );
      }
    });}
 
  createUser(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
            .then( ({ user }) => {
              const newUser = new Usuario(user.uid, name, email);
              return setDoc(doc(this.firestore, user.uid, 'user'), {...newUser});
            });
  }
 
  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword (this.auth, email, password);
  }
 
  logout() {
    return signOut(this.auth);
  }
 
  isAuth() {
    return authState(this.auth).pipe(
      map(fUser => fUser !== null)
    )
  }
 
}
