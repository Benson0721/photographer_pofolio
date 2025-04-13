// pinia.d.ts
import "pinia";
import type { PersistenceOptions } from "pinia-plugin-persistedstate";
declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?:
      | boolean
      | Partial<PersistenceOptions<S>>
      | Partial<PersistenceOptions<S>>[]
      | undefined;
  }
}
