'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'

const initialItems = [
  { id: '1', text: 'Tâche 1', list: 'todo' },
  { id: '2', text: 'Tâche 2', list: 'todo' },
  { id: '3', text: 'Tâche 3', list: 'in-progress' },
  { id: '4', text: 'Tâche 4', list: 'done' },
]

export function DragDropPage() {
  const [items, setItems] = useState(initialItems)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetList: string) => {
    if (!draggedItem) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === draggedItem ? { ...item, list: targetList } : item
      )
    )
    setDraggedItem(null)
  }

  const lists = {
    todo: { title: 'À faire', color: 'bg-blue-100' },
    'in-progress': { title: 'En cours', color: 'bg-yellow-100' },
    done: { title: 'Terminé', color: 'bg-green-100' },
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="dragdrop-title">
          Drag & Drop
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(lists).map(([listId, list]) => (
            <div
              key={listId}
              className={`${list.color} rounded-lg p-4 min-h-[400px]`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(listId)}
              data-testid={`drop-zone-${listId}`}
            >
              <h2 className="text-lg font-semibold mb-4" data-testid={`list-title-${listId}`}>
                {list.title}
              </h2>
              <div className="space-y-2">
                {items
                  .filter((item) => item.list === listId)
                  .map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      className="bg-white p-3 rounded shadow cursor-move hover:shadow-md"
                      data-testid={`draggable-item-${item.id}`}
                    >
                      {item.text}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
