import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirestorePaginationService<T> {
  private lastVisible: unknown;
  private firstVisible: unknown;
  private dataSubject = new BehaviorSubject<T[]>([]);

  private data$: Observable<T[]> = new Observable<T[]>();

  constructor(private afs: AngularFirestore) {}

  get data(): Observable<T[]> {
    return this.data$;
  }

  initializePaginator(collectionName: string, pageSize: number): void {
    const queryFn: QueryFn = (ref) => ref.orderBy('updatedAt').limit(pageSize);
    this.updatePagination(collectionName, queryFn);
  }

  getNextPage(collectionName: string, pageSize: number): void {
    const queryFn: QueryFn = (ref) => {
      let query = ref.orderBy('updatedAt').limit(pageSize);
      if (this.lastVisible) {
        query = query.startAfter(this.lastVisible);
      }
      return query;
    };

    this.updatePagination(collectionName, queryFn);
  }

  getPreviousPage(collectionName: string, pageSize: number): void {
    const queryFn: QueryFn = (ref) => {
      let query = ref.orderBy('updatedAt').limitToLast(pageSize);
      if (this.firstVisible) {
        query = query.endBefore(this.firstVisible);
      }
      return query;
    };

    this.updatePagination(collectionName, queryFn);
  }

  reset(): void {
    this.lastVisible = null;
    this.firstVisible = null;
    this.dataSubject.next([]);
  }

  private updatePagination(collectionName: string, queryFn: QueryFn) {
    this.data$ = this.afs
      .collection<T>(collectionName, queryFn)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          if (actions.length === 0) {
            // No more items to load
            return [];
          }
          this.firstVisible = actions[0].payload.doc;

          if (!this.lastVisible) {
            // If lastVisible is not defined, set it to the last item in the current page
            this.lastVisible = actions[actions.length - 1].payload.doc;
          }
          return actions.map((a) => {
            const data = a.payload.doc.data() as T;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }),
        switchMap((items: T[]) =>
          this.dataSubject.pipe(
            map((existingItems) => [...items, ...existingItems])
          )
        )
      );
  }
}
