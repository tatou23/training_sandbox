'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/Layout'
import { PRODUCTS, Product } from '@/lib/data'

interface AdminProduct extends Product {
  selected: boolean
}

type SortableColumn = 'name' | 'price' | 'category' | 'brand' | 'rating'

export function AdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>(
    PRODUCTS.map((p) => ({ ...p, selected: false }))
  )
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Product>>({})
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    name: 200,
    price: 100,
    category: 120,
    brand: 120,
    rating: 100,
  })

  const sortedProducts = useMemo(() => {
    if (!sortColumn) return products
    return [...products].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [products, sortColumn, sortDirection])

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSelect = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    )
  }

  const handleSelectAll = () => {
    const allSelected = products.every((p) => p.selected)
    setProducts((prev) => prev.map((p) => ({ ...p, selected: !allSelected })))
  }

  const handleEdit = (product: AdminProduct) => {
    setEditingId(product.id)
    setEditValues({ name: product.name, price: product.price })
  }

  const handleSaveEdit = () => {
    if (!editingId) return
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingId ? { ...p, ...editValues } : p
      )
    )
    setEditingId(null)
    setEditValues({})
  }

  const handleBulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !p.selected))
  }

  const selectedCount = products.filter((p) => p.selected).length

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" data-testid="admin-title">
            Table Admin
          </h1>
          {selectedCount > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              data-testid="bulk-delete-button"
            >
              Supprimer ({selectedCount})
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto" data-testid="admin-table">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && products.every((p) => p.selected)}
                    onChange={handleSelectAll}
                    data-testid="select-all-checkbox"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                  style={{ width: columnWidths.name }}
                  data-testid="column-name"
                >
                  Nom {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price')}
                  style={{ width: columnWidths.price }}
                  data-testid="column-price"
                >
                  Prix {sortColumn === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                  style={{ width: columnWidths.category }}
                  data-testid="column-category"
                >
                  Catégorie {sortColumn === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('brand')}
                  style={{ width: columnWidths.brand }}
                  data-testid="column-brand"
                >
                  Marque {sortColumn === 'brand' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rating')}
                  style={{ width: columnWidths.rating }}
                  data-testid="column-rating"
                >
                  Note {sortColumn === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" data-testid="column-actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => (
                <tr key={product.id} className={product.selected ? 'bg-blue-50' : ''} data-testid={`table-row-${product.id}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={product.selected}
                      onChange={() => handleSelect(product.id)}
                      data-testid={`row-checkbox-${product.id}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm" data-testid={`row-name-${product.id}`}>
                    {editingId === product.id ? (
                      <input
                        type="text"
                        value={editValues.name || ''}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                        data-testid={`edit-name-${product.id}`}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" data-testid={`row-price-${product.id}`}>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editValues.price || ''}
                        onChange={(e) => setEditValues({ ...editValues, price: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 border rounded"
                        data-testid={`edit-price-${product.id}`}
                      />
                    ) : (
                      `${product.price.toFixed(2)} €`
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" data-testid={`row-category-${product.id}`}>
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-sm" data-testid={`row-brand-${product.id}`}>
                    {product.brand}
                  </td>
                  <td className="px-4 py-3 text-sm" data-testid={`row-rating-${product.id}`}>
                    {product.rating}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === product.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-800"
                          data-testid={`save-edit-${product.id}`}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setEditValues({})
                          }}
                          className="text-red-600 hover:text-red-800"
                          data-testid={`cancel-edit-${product.id}`}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800"
                        data-testid={`edit-button-${product.id}`}
                      >
                        Modifier
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
