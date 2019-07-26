# Cloudflare KV CRUD Service

> An CRUD abstraction on Cloudflare KV for dealing with objects

This module is very naive and should only be used for small scale apps.

**Install**

```bash
yarn add cf-kv-crud
```

## Usage

Ensure you've [created a namespace and binding](https://workers.cloudflare.com/docs/reference/storage/writing-data/).

Create a types file with the following contents:

**types.ts**

```typescript
import { KVNamespace } from '@cloudflare/workers-types'

declare global {
  // Whatever variable you bound your namespace to
  const myKvNamespaceBinding: KVNamespace
}
```

**main.ts**

```typescript
import { Router, getErrorPageHTML } from '8track'
import { KVCrudService } from 'cf-kv-crud'

const router = new Router()
const kvService

interface User {
  // Objects going into the CRUD service must have an ID
  id: string
  name: string
}

router.get`/api/users`.handle(async ctx => {
  const usersService = new KVCrudService<User>({
    kv: myKvNamespaceBinding,
    objectPrefix: 'users',
  })

  const users = await usersService.list()

  return ctx.json(users)
})

addEventListener('fetch', e => {
  const res = router.getResponseForRequest(e.request).catch(
    error =>
      new Response(getErrorPageHTML(e.request, error), {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }),
  )

  e.respondWith(res as any)
})
```

## API
