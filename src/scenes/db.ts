import { openDB, type DBSchema } from 'idb'
import type { Scene } from './types'

interface GmToolsDB extends DBSchema {
  scenes: {
    key: string
    value: Scene
  }
}

const dbPromise = openDB<GmToolsDB>('daggerheart-gm-tools', 1, {
  upgrade(db) {
    db.createObjectStore('scenes', { keyPath: 'id' })
  },
})

export async function listScenes(): Promise<Scene[]> {
  const scenes = await (await dbPromise).getAll('scenes')
  return scenes.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function getScene(id: string): Promise<Scene | undefined> {
  return (await dbPromise).get('scenes', id)
}

export async function saveScene(scene: Scene): Promise<void> {
  await (await dbPromise).put('scenes', { ...scene, updatedAt: Date.now() })
}

export async function deleteScene(id: string): Promise<void> {
  await (await dbPromise).delete('scenes', id)
}
