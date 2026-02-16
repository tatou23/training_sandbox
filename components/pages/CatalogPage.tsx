'use client'

import { useState, useMemo, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { PRODUCTS, CATEGORIES, BRANDS, Product, SortOption } from '@/lib/data'
import { Skeleton } from '@/components/traps/Skeleton'
import { getChaosState, simulateNetworkDelay } from '@/lib/chaos'
import { ToastContainer } from '@/components/traps/Toast'

const ITEMS_PER_PAGE = 6

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedBrand, setSelectedBrand] = useState<string>('All')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      const chaosState = getChaosState()
      await simulateNetworkDelay(chaosState.seed, chaosState, 1)
      setProducts(PRODUCTS)
      setIsLoading(false)
    }
    loadProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Filtre par catégorie
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filtre par marque
    if (selectedBrand !== 'All') {
      filtered = filtered.filter((p) => p.brand === selectedBrand)
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, selectedCategory, selectedBrand, sortBy, searchQuery])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAndSortedProducts, currentPage])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)

  const handleAddToCart = (product: Product) => {
    // Simuler l'ajout au panier
    console.log('Ajout au panier:', product)
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="catalog-title">
          Catalogue Produits
        </h1>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-6 mb-6" data-testid="catalog-filters">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="search-label">
                Recherche
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                data-testid="search-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="category-label">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                data-testid="category-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} data-testid={`category-option-${cat}`}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="brand-label">
                Marque
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                data-testid="brand-select"
              >
                {BRANDS.map((brand) => (
                  <option key={brand} value={brand} data-testid={`brand-option-${brand}`}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="sort-label">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                data-testid="sort-select"
              >
                <option value="name" data-testid="sort-option-name">Nom</option>
                <option value="price-asc" data-testid="sort-option-price-asc">Prix croissant</option>
                <option value="price-desc" data-testid="sort-option-price-desc">Prix décroissant</option>
                <option value="rating" data-testid="sort-option-rating">Note</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-4 text-sm text-gray-600" data-testid="catalog-results-count">
          {filteredAndSortedProducts.length} produit(s) trouvé(s)
        </div>

        {/* Liste des produits */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} seed={getChaosState().seed} index={i} className="h-64">
                <div />
              </Skeleton>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="catalog-products">
              {paginatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                  data-testid={`product-card-${product.id}`}
                >
                  <Skeleton seed={getChaosState().seed} index={index + 10} className="h-48 mb-4">
                    <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400">Image</span>
                    </div>
                  </Skeleton>

                  <h3 className="text-lg font-semibold mb-2" data-testid={`product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2" data-testid={`product-description-${product.id}`}>
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold" data-testid={`product-price-${product.id}`}>
                      {product.price.toFixed(2)} €
                    </span>
                    <span className="text-sm text-gray-500" data-testid={`product-rating-${product.id}`}>
                      ⭐ {product.rating}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full px-4 py-2 rounded ${
                      product.inStock
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    data-testid={`product-add-to-cart-${product.id}`}
                  >
                    {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2" data-testid="catalog-pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                  data-testid="pagination-prev"
                >
                  Précédent
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded ${
                      currentPage === i + 1 ? 'bg-blue-600 text-white' : ''
                    }`}
                    data-testid={`pagination-page-${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                  data-testid="pagination-next"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer seed={getChaosState().seed} />
    </Layout>
  )
}
