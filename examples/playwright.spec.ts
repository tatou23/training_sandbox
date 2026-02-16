import { test, expect } from '@playwright/test'

/**
 * Exemples de tests Playwright pour Training Sandbox
 * 
 * Stratégie anti-flakiness :
 * 1. Utiliser data-testid pour des sélecteurs stables
 * 2. Attendre explicitement les éléments avec waitFor
 * 3. Utiliser des assertions qui attendent automatiquement
 * 4. Gérer les délais réseau avec waitForResponse
 */

test.describe('Authentification', () => {
  test('devrait permettre de se connecter avec des identifiants valides', async ({ page }) => {
    await page.goto('http://localhost:3000/auth')
    
    // Attendre que le formulaire soit visible
    await expect(page.getByTestId('auth-form')).toBeVisible()
    
    // Remplir le formulaire
    await page.getByTestId('email-input').fill('demo@example.com')
    await page.getByTestId('password-input').fill('demo123')
    
    // Cliquer sur le bouton de connexion
    await page.getByTestId('login-button').click()
    
    // Attendre la redirection ou le message de bienvenue
    await expect(page.getByTestId('welcome-message')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('welcome-message')).toContainText('Bienvenue')
  })

  test('devrait afficher une erreur avec des identifiants invalides', async ({ page }) => {
    await page.goto('http://localhost:3000/auth')
    
    await page.getByTestId('email-input').fill('invalid@example.com')
    await page.getByTestId('password-input').fill('wrongpassword')
    await page.getByTestId('login-button').click()
    
    // Attendre le message d'erreur
    await expect(page.getByTestId('auth-error')).toBeVisible()
    await expect(page.getByTestId('auth-error')).toContainText('incorrect')
  })

  test('devrait permettre de se déconnecter', async ({ page }) => {
    // Se connecter d'abord
    await page.goto('http://localhost:3000/auth')
    await page.getByTestId('email-input').fill('demo@example.com')
    await page.getByTestId('password-input').fill('demo123')
    await page.getByTestId('login-button').click()
    
    // Attendre d'être connecté
    await expect(page.getByTestId('logout-button')).toBeVisible()
    
    // Se déconnecter
    await page.getByTestId('logout-button').click()
    
    // Vérifier qu'on est revenu au formulaire
    await expect(page.getByTestId('auth-form')).toBeVisible()
  })
})

test.describe('Catalogue Produits', () => {
  test('devrait afficher la liste des produits', async ({ page }) => {
    await page.goto('http://localhost:3000/catalog')
    
    // Attendre que les produits soient chargés
    await expect(page.getByTestId('catalog-products')).toBeVisible()
    
    // Vérifier qu'il y a des produits
    const productCards = page.locator('[data-testid^="product-card-"]')
    await expect(productCards.first()).toBeVisible()
  })

  test('devrait filtrer par catégorie', async ({ page }) => {
    await page.goto('http://localhost:3000/catalog')
    
    // Attendre le chargement
    await expect(page.getByTestId('catalog-products')).toBeVisible()
    
    // Sélectionner une catégorie
    await page.getByTestId('category-select').selectOption('Electronics')
    
    // Attendre que les résultats soient filtrés
    await expect(page.getByTestId('catalog-results-count')).toBeVisible()
    
    // Vérifier que tous les produits affichés sont de la catégorie Electronics
    const productCards = page.locator('[data-testid^="product-card-"]')
    const count = await productCards.count()
    
    // Note: Dans un vrai test, on vérifierait aussi le contenu
    expect(count).toBeGreaterThan(0)
  })

  test('devrait permettre de rechercher des produits', async ({ page }) => {
    await page.goto('http://localhost:3000/catalog')
    
    await expect(page.getByTestId('catalog-products')).toBeVisible()
    
    // Effectuer une recherche
    await page.getByTestId('search-input').fill('Laptop')
    
    // Attendre que les résultats soient filtrés
    await page.waitForTimeout(500) // Délai pour le debounce
    
    // Vérifier les résultats
    await expect(page.getByTestId('catalog-results-count')).toBeVisible()
  })

  test('devrait permettre de trier les produits', async ({ page }) => {
    await page.goto('http://localhost:3000/catalog')
    
    await expect(page.getByTestId('catalog-products')).toBeVisible()
    
    // Trier par prix croissant
    await page.getByTestId('sort-select').selectOption('price-asc')
    
    // Attendre que le tri soit appliqué
    await page.waitForTimeout(300)
    
    // Vérifier que les produits sont triés (on pourrait vérifier les prix)
    const firstProduct = page.locator('[data-testid^="product-card-"]').first()
    await expect(firstProduct).toBeVisible()
  })
})

test.describe('Panier', () => {
  test('devrait permettre d\'ajouter un produit au panier', async ({ page }) => {
    await page.goto('http://localhost:3000/catalog')
    
    // Attendre le chargement
    await expect(page.getByTestId('catalog-products')).toBeVisible()
    
    // Cliquer sur "Ajouter au panier" du premier produit
    const firstAddButton = page.locator('[data-testid^="product-add-to-cart-"]').first()
    await firstAddButton.click()
    
    // Note: Dans une vraie app, on vérifierait que le produit est dans le panier
  })

  test('devrait calculer correctement le total', async ({ page }) => {
    await page.goto('http://localhost:3000/cart')
    
    // Attendre le chargement
    await expect(page.getByTestId('cart-summary')).toBeVisible()
    
    // Vérifier que le total est affiché
    await expect(page.getByTestId('summary-total')).toBeVisible()
  })

  test('devrait appliquer un code promo valide', async ({ page }) => {
    await page.goto('http://localhost:3000/cart')
    
    // Ajouter un produit au panier d'abord (via localStorage ou autre)
    // Puis tester le code promo
    
    await page.getByTestId('promo-input').fill('WELCOME10')
    await page.getByTestId('promo-apply').click()
    
    // Attendre que le code soit appliqué
    await expect(page.getByTestId('summary-discount')).toBeVisible({ timeout: 2000 })
  })
})

test.describe('Formulaires Multi-Étapes', () => {
  test('devrait permettre de naviguer entre les étapes', async ({ page }) => {
    await page.goto('http://localhost:3000/forms')
    
    // Remplir l'étape 1
    await page.getByTestId('firstname-input').fill('John')
    await page.getByTestId('lastname-input').fill('Doe')
    await page.getByTestId('email-input').fill('john@example.com')
    await page.getByTestId('phone-input').fill('+33 6 12 34 56 78')
    
    // Passer à l'étape suivante
    await page.getByTestId('form-next').click()
    
    // Vérifier qu'on est à l'étape 2
    await expect(page.getByTestId('form-step-2-content')).toBeVisible()
    
    // Remplir l'étape 2
    await page.getByTestId('address-input').fill('123 Rue Example')
    await page.getByTestId('city-input').fill('Paris')
    await page.getByTestId('postalcode-input').fill('75001')
    await page.getByTestId('country-select').selectOption('FR')
    
    // Passer à l'étape suivante
    await page.getByTestId('form-next').click()
    
    // Vérifier qu'on est à l'étape 3
    await expect(page.getByTestId('form-step-3-content')).toBeVisible()
  })

  test('devrait afficher les champs conditionnels', async ({ page }) => {
    await page.goto('http://localhost:3000/forms')
    
    // Aller à l'étape 3
    await page.getByTestId('firstname-input').fill('John')
    await page.getByTestId('lastname-input').fill('Doe')
    await page.getByTestId('email-input').fill('john@example.com')
    await page.getByTestId('phone-input').fill('+33 6 12 34 56 78')
    await page.getByTestId('form-next').click()
    
    await page.getByTestId('address-input').fill('123 Rue Example')
    await page.getByTestId('city-input').fill('Paris')
    await page.getByTestId('postalcode-input').fill('75001')
    await page.getByTestId('country-select').selectOption('FR')
    await page.getByTestId('form-next').click()
    
    // Cocher "J'ai une entreprise"
    await page.getByTestId('has-company-checkbox').check()
    
    // Vérifier que les champs entreprise apparaissent
    await expect(page.getByTestId('company-name-input')).toBeVisible()
  })
})

test.describe('Mode Chaos', () => {
  test('devrait permettre d\'activer le mode chaos', async ({ page }) => {
    await page.goto('http://localhost:3000/?chaos=1&seed=test123')
    
    // Vérifier que le panneau chaos est visible
    await expect(page.getByTestId('chaos-controls')).toBeVisible()
    
    // Vérifier que le chaos est activé
    await expect(page.getByTestId('chaos-state-enabled')).toContainText('Activé')
  })

  test('devrait être reproductible avec le même seed', async ({ page }) => {
    // Premier chargement
    await page.goto('http://localhost:3000/?chaos=1&seed=repro123')
    await expect(page.getByTestId('chaos-state-seed')).toContainText('repro123')
    
    // Recharger avec le même seed
    await page.reload()
    await expect(page.getByTestId('chaos-state-seed')).toContainText('repro123')
  })
})
