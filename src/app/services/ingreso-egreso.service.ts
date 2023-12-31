import { Injectable } from '@angular/core';
import { Firestore, collectionSnapshots, deleteDoc, doc, getFirestore, onSnapshot } from '@angular/fire/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private firestore: Firestore, private authService: AuthService) { }

  // crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {
  //   console.log(ingresoEgreso);
  //   const ingresosEgresosCollection = collection(this.firestore, 'ingresos-egresos');
  //   addDoc(ingresosEgresosCollection, {...ingresoEgreso});
  // }

  async crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.User?.uid;
    const ingresoEgresoFullData = {...ingresoEgreso, uid};
    const ingresosEgresosCollection = collection(this.firestore, `${uid}/ingresos-egresos/items`);
    return addDoc(ingresosEgresosCollection, {...ingresoEgresoFullData});
 
  }

  // initIngresosEgresosListener(uid: string) {
  //   const ingresosEgresosCollection = collection(this.firestore, `${uid}/ingresos-egresos/items`).valueChanges();
  //   return ingresosEgresosCollection;
  // }

  initIngresosEgresosListener(uid: string): Observable<any> {

    return new Observable(observer => {
      const ingresosEgresosCollection = collection(this.firestore, `${uid}/ingresos-egresos/items`);
      return onSnapshot(ingresosEgresosCollection, (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id
        }));
        observer.next(documents);
      });
    });

    // const ingresosEgresosCollection = collection(this.firestore, `${uid}/ingresos-egresos/items`);
    // return onSnapshot(ingresosEgresosCollection, (snapshot) => {
    //   // This callback will be called whenever the collection changes.
    //   // snapshot.docs contains an array of the documents in the collection.
    //   const documents = snapshot.docs.map(doc => doc.data());
    //   // return documents;
    //   console.log(documents);
    // });
  }

  borrarIngresoEgreso(uidItem: string | undefined) {
    const uid = this.authService.User?.uid;
    console.log('uid', uid);
    console.log('uidItem', uidItem);
    const ingresoEgresoDoc = doc(this.firestore, `${uid}/ingresos-egresos/items/${uidItem}`);
    return deleteDoc(ingresoEgresoDoc);
  }


}

