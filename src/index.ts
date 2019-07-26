import { KVCrudService, KVCrudServiceOptions } from './KVCrudService'

export { KVCrudService, KVCrudServiceOptions }

export function createKvCrud(options: KVCrudServiceOptions) {
  return new KVCrudService(options)
}
