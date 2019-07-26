import { KVNamespace } from '@cloudflare/workers-types'

export interface KVCrudServiceOptions {
  kv: KVNamespace
  objectPrefix: string
}

export class KVCrudService<T extends { id: string }> {
  public options: KVCrudServiceOptions

  constructor(options: KVCrudServiceOptions) {
    this.options = options
  }

  async list(): Promise<T[]> {
    const { kv, objectPrefix } = this.options
    const ids = ((await kv.get(objectPrefix, 'json')) || []) as string[]
    const fetchObjects = ids.map(async id => {
      const obj = await kv.get(`${objectPrefix}-${id}`, 'json')
      return obj as any
    })

    return ((await Promise.all(fetchObjects)) as T[]) || []
  }

  async put(obj: T) {
    const { kv, objectPrefix } = this.options
    const ids = ((await kv.get(objectPrefix, 'json')) || []) as string[]

    await Promise.all([
      kv.put(`${objectPrefix}-${obj.id}`, JSON.stringify(obj)),
      !ids.includes(obj.id)
        ? kv.put(objectPrefix, JSON.stringify(ids.concat(obj.id)))
        : Promise.resolve(),
    ])
  }

  async get(id: string): Promise<T | undefined> {
    const { kv, objectPrefix } = this.options
    const result = await kv.get(`${objectPrefix}-${id}`, 'json')
    return result as any
  }

  async deleteAll() {
    const { kv, objectPrefix } = this.options
    await kv.delete(objectPrefix)
  }
}
