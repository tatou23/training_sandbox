'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { PRODUCTS, Product } from '@/lib/data'
import { getChaosState, simulateNetworkDelay, shouldTriggerError } from '@/lib/chaos'
import { Modal } from '@/components/traps/Modal'
import { ToastContainer } from '@/components/traps/Toast'
import { Spinner } from '@/components/traps/Spinner'

interface CartItem {
  product: Product
  quantity: number
}

const PROMO_CODES: Record<string, { discount: number; minAmount: number }> = {
  WELCOME10: { discount: 10, minAmount: 50 },
  SAVE20: { discount: 20, minAmount: 100 },
  BIG50: { discount: 50, minAmount: 500 },
}

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState('')
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart')

  useEffect(() => {
    // Charger le panier depuis localStorage
    const savedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        setCartItems(items)
      } catch (e) {
        console.error('Erreur lors du chargement du panier', e)
      }
    }
  }, [])

  const saveCart = (items: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const newItems = cartItems.map((item) =>
      item.product.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter((item) => item.quantity > 0)
    setCartItems(newItems)
    saveCart(newItems)
  }

  const removeItem = (productId: string) => {
    const newItems = cartItems.filter((item) => item.product.id !== productId)
    setCartItems(newItems)
    saveCart(newItems)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const promoDiscount = appliedPromo && PROMO_CODES[appliedPromo]
    ? Math.min(subtotal * (PROMO_CODES[appliedPromo].discount / 100), subtotal)
    : 0
  const shippingCost = shippingMethod === 'express' ? 15.99 : 5.99
  const tax = (subtotal - promoDiscount) * 0.2 // 20% TVA
  const total = subtotal - promoDiscount + shippingCost + tax

  const handleApplyPromo = () => {
    setPromoError('')
    const promo = PROMO_CODES[promoCode.toUpperCase()]
    if (!promo) {
      setPromoError('Code promo invalide')
      return
    }
    if (subtotal < promo.minAmount) {
      setPromoError(`Minimum ${promo.minAmount}€ requis pour ce code`)
      return
    }
    setAppliedPromo(promoCode.toUpperCase())
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    setIsProcessing(true)
    const chaosState = getChaosState()

    try {
      await simulateNetworkDelay(chaosState.seed, chaosState, 1)

      // Simuler une erreur serveur si le chaos est activé
      if (chaosState.enabled && shouldTriggerError(chaosState.seed, chaosState.errorRate, 2)) {
        throw new Error('Erreur serveur: Impossible de traiter la commande')
      }

      await simulateNetworkDelay(chaosState.seed, chaosState, 3)
      setCheckoutStep('confirmation')
      setCartItems([])
      saveCart([])
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsProcessing(false)
    }
  }

  if (checkoutStep === 'confirmation') {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow p-8 text-center" data-testid="checkout-confirmation">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-4" data-testid="confirmation-title">
              Commande confirmée !
            </h1>
            <p className="text-gray-600 mb-6" data-testid="confirmation-message">
              Votre commande a été traitée avec succès.
            </p>
            <button
              onClick={() => {
                setCheckoutStep('cart')
                setShowCheckoutModal(false)
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              data-testid="confirmation-continue"
            >
              Continuer les achats
            </button>
          </div>
        </div>
        <ToastContainer seed={getChaosState().seed} />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="cart-title">
          Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center" data-testid="cart-empty">
                <p className="text-gray-600" data-testid="cart-empty-message">
                  Votre panier est vide
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow" data-testid="cart-items">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-6 border-b border-gray-200 last:border-b-0"
                    data-testid={`cart-item-${item.product.id}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold" data-testid={`cart-item-name-${item.product.id}`}>
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600" data-testid={`cart-item-price-${item.product.id}`}>
                          {item.product.price.toFixed(2)} €
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 border rounded flex items-center justify-center"
                            data-testid={`cart-item-decrease-${item.product.id}`}
                          >
                            -
                          </button>
                          <span className="w-12 text-center" data-testid={`cart-item-quantity-${item.product.id}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 border rounded flex items-center justify-center"
                            data-testid={`cart-item-increase-${item.product.id}`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-600 hover:text-red-800"
                          data-testid={`cart-item-remove-${item.product.id}`}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-right text-sm font-semibold" data-testid={`cart-item-total-${item.product.id}`}>
                      Total: {(item.product.price * item.quantity).toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4" data-testid="cart-summary">
              <h2 className="text-xl font-semibold mb-4" data-testid="summary-title">
                Récapitulatif
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between" data-testid="summary-subtotal">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600" data-testid="summary-discount">
                    <span>Remise ({appliedPromo})</span>
                    <span>-{promoDiscount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between" data-testid="summary-tax">
                  <span>TVA (20%)</span>
                  <span>{tax.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between" data-testid="summary-shipping">
                  <span>Livraison</span>
                  <span>{shippingCost.toFixed(2)} €</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg" data-testid="summary-total">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Code promo */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="promo-label">
                  Code promo
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="WELCOME10"
                    data-testid="promo-input"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
                    data-testid="promo-apply"
                  >
                    Appliquer
                  </button>
                </div>
                {promoError && (
                  <p className="mt-1 text-xs text-red-600" data-testid="promo-error">
                    {promoError}
                  </p>
                )}
              </div>

              {/* Méthode de livraison */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="shipping-label">
                  Livraison
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value as 'standard')}
                      className="mr-2"
                      data-testid="shipping-standard"
                    />
                    <span>Standard (5.99€)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value as 'express')}
                      className="mr-2"
                      data-testid="shipping-express"
                    />
                    <span>Express (15.99€)</span>
                  </label>
                </div>
              </div>

              {/* Bouton checkout */}
              <button
                onClick={() => setShowCheckoutModal(true)}
                disabled={cartItems.length === 0 || isProcessing}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                data-testid="checkout-button"
              >
                {isProcessing ? (
                  <>
                    <Spinner size="sm" seed={getChaosState().seed} index={1} />
                    <span className="ml-2">Traitement...</span>
                  </>
                ) : (
                  'Passer la commande'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Confirmer la commande"
        seed={getChaosState().seed}
        index={1}
      >
        <div className="space-y-4" data-testid="checkout-modal">
          <p className="text-gray-600" data-testid="checkout-modal-message">
            Êtes-vous sûr de vouloir passer cette commande ?
          </p>
          <div className="bg-gray-50 p-4 rounded" data-testid="checkout-modal-summary">
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span className="font-bold">{total.toFixed(2)} €</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              data-testid="checkout-modal-cancel"
            >
              Annuler
            </button>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              data-testid="checkout-modal-confirm"
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer seed={getChaosState().seed} />
    </Layout>
  )
}
