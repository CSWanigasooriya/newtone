import { Inject, Injectable, InjectionToken } from '@angular/core'

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
})

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) {}

  get(key: string) {
    return this.storage.getItem(key)
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value)
  }

  remove(key: string) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }

  getAll() {
    const archive: string[] = []
    const keys = Object.keys(localStorage)
    console.log(keys)
    let i = 0
    let key

    for (; (key = keys[i]); i++) {
      archive.push(String(localStorage.getItem(key)))
    }

    return archive
  }
}
