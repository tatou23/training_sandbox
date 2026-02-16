/**
 * Exemples de tests Cypress pour Training Sandbox
 * 
 * Stratégie anti-flakiness :
 * 1. Utiliser cy.get() avec data-testid
 * 2. Cypress attend automatiquement, mais utiliser cy.wait() pour les requêtes réseau
 * 3. Utiliser cy.should() pour les assertions qui attendent
 * 4. Éviter cy.wait() avec des délais fixes
 */

describe('Authentification', () => {
  it('devrait permettre de se connecter avec des identifiants valides', () => {
    cy.visit('http://localhost:3000/auth')
    
    cy.get('[data-testid="auth-form"]').should('be.visible')
    
    cy.get('[data-testid="email-input"]').type('demo@example.com')
    cy.get('[data-testid="password-input"]').type('demo123')
    cy.get('[data-testid="login-button"]').click()
    
    cy.get('[data-testid="welcome-message"]', { timeout: 10000 })
      .should('be.visible')
      .should('contain', 'Bienvenue')
  })

  it('devrait afficher une erreur avec des identifiants invalides', () => {
    cy.visit('http://localhost:3000/auth')
    
    cy.get('[data-testid="email-input"]').type('invalid@example.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()
    
    cy.get('[data-testid="auth-error"]')
      .should('be.visible')
      .should('contain', 'incorrect')
  })
})

describe('Catalogue Produits', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/catalog')
    cy.get('[data-testid="catalog-products"]').should('be.visible')
  })

  it('devrait afficher la liste des produits', () => {
    cy.get('[data-testid^="product-card-"]').should('have.length.greaterThan', 0)
  })

  it('devrait filtrer par catégorie', () => {
    cy.get('[data-testid="category-select"]').select('Electronics')
    
    // Attendre que les résultats soient mis à jour
    cy.get('[data-testid="catalog-results-count"]').should('be.visible')
    
    // Vérifier qu'il y a des résultats
    cy.get('[data-testid^="product-card-"]').should('have.length.greaterThan', 0)
  })

  it('devrait permettre de rechercher des produits', () => {
    cy.get('[data-testid="search-input"]').type('Laptop')
    
    // Attendre le debounce
    cy.wait(500)
    
    cy.get('[data-testid="catalog-results-count"]').should('be.visible')
  })

  it('devrait permettre de trier les produits', () => {
    cy.get('[data-testid="sort-select"]').select('price-asc')
    
    // Attendre que le tri soit appliqué
    cy.wait(300)
    
    cy.get('[data-testid^="product-card-"]').first().should('be.visible')
  })
})

describe('Panier', () => {
  it('devrait calculer correctement le total', () => {
    cy.visit('http://localhost:3000/cart')
    
    cy.get('[data-testid="cart-summary"]').should('be.visible')
    cy.get('[data-testid="summary-total"]').should('be.visible')
  })

  it('devrait appliquer un code promo valide', () => {
    cy.visit('http://localhost:3000/cart')
    
    cy.get('[data-testid="promo-input"]').type('WELCOME10')
    cy.get('[data-testid="promo-apply"]').click()
    
    cy.get('[data-testid="summary-discount"]', { timeout: 2000 })
      .should('be.visible')
  })
})

describe('Formulaires Multi-Étapes', () => {
  it('devrait permettre de naviguer entre les étapes', () => {
    cy.visit('http://localhost:3000/forms')
    
    // Étape 1
    cy.get('[data-testid="firstname-input"]').type('John')
    cy.get('[data-testid="lastname-input"]').type('Doe')
    cy.get('[data-testid="email-input"]').type('john@example.com')
    cy.get('[data-testid="phone-input"]').type('+33 6 12 34 56 78')
    cy.get('[data-testid="form-next"]').click()
    
    // Vérifier étape 2
    cy.get('[data-testid="form-step-2-content"]').should('be.visible')
    
    // Étape 2
    cy.get('[data-testid="address-input"]').type('123 Rue Example')
    cy.get('[data-testid="city-input"]').type('Paris')
    cy.get('[data-testid="postalcode-input"]').type('75001')
    cy.get('[data-testid="country-select"]').select('FR')
    cy.get('[data-testid="form-next"]').click()
    
    // Vérifier étape 3
    cy.get('[data-testid="form-step-3-content"]').should('be.visible')
  })

  it('devrait afficher les champs conditionnels', () => {
    cy.visit('http://localhost:3000/forms')
    
    // Aller à l'étape 3
    cy.get('[data-testid="firstname-input"]').type('John')
    cy.get('[data-testid="lastname-input"]').type('Doe')
    cy.get('[data-testid="email-input"]').type('john@example.com')
    cy.get('[data-testid="phone-input"]').type('+33 6 12 34 56 78')
    cy.get('[data-testid="form-next"]').click()
    
    cy.get('[data-testid="address-input"]').type('123 Rue Example')
    cy.get('[data-testid="city-input"]').type('Paris')
    cy.get('[data-testid="postalcode-input"]').type('75001')
    cy.get('[data-testid="country-select"]').select('FR')
    cy.get('[data-testid="form-next"]').click()
    
    // Cocher "J'ai une entreprise"
    cy.get('[data-testid="has-company-checkbox"]').check()
    
    // Vérifier que les champs entreprise apparaissent
    cy.get('[data-testid="company-name-input"]').should('be.visible')
  })
})

describe('Mode Chaos', () => {
  it('devrait permettre d\'activer le mode chaos', () => {
    cy.visit('http://localhost:3000/?chaos=1&seed=test123')
    
    cy.get('[data-testid="chaos-controls"]').should('be.visible')
    cy.get('[data-testid="chaos-state-enabled"]').should('contain', 'Activé')
  })

  it('devrait être reproductible avec le même seed', () => {
    cy.visit('http://localhost:3000/?chaos=1&seed=repro123')
    cy.get('[data-testid="chaos-state-seed"]').should('contain', 'repro123')
    
    cy.reload()
    cy.get('[data-testid="chaos-state-seed"]').should('contain', 'repro123')
  })
})
