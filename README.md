# Training Sandbox

Site web éducatif open source pour apprendre et pratiquer Cypress, Playwright et Selenium.  
Le but est de fournir à la fois un mode stable et un mode chaos reproductible pour entraîner la robustesse des tests.

---

## 🛡️ Sécurité & modes d’exécution

Le site fonctionne selon deux modes distincts :

- **Mode Public (stable)**  
  Chaos et debug désactivés.  
  Les paramètres `?chaos=1` et `?debug=1` sont ignorés.

- **Mode Training Interne (protégé par token)**  
  Chaos et debug activables.  
  Accès autorisé uniquement via un token serveur.

Cette séparation permet d’exposer la plateforme publiquement tout en conservant un environnement avancé pour l'entraînement aux tests.

---

## 🎯 Objectifs

- Créer un site moderne, rapide, accessible avec plusieurs pages et composants intentionnellement difficiles à tester
- Fournir des scénarios réalistes : e-commerce, auth, formulaires, tableaux, filtres, uploads, modales, toasts, pagination, recherche, drag and drop
- Offrir des causes de flakiness contrôlées et activables, jamais purement aléatoires sans possibilité de reproduction

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+  
- npm ou yarn  

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Ouvrez http://localhost:3000 dans votre navigateur.

### Build de production

```bash
npm run build
npm start
```

---

## 🎮 Mode Chaos

Le mode chaos permet de simuler des comportements difficiles à tester de manière reproductible grâce à un système de seed.

> ⚠️ En production publique, le mode chaos est désactivé par défaut.  
> Les paramètres `?chaos=1` et `?seed=...` sont ignorés sauf si un accès interne autorisé est fourni.

---

### Activer le mode chaos (local ou accès interne autorisé)

En développement local, vous pouvez activer le chaos directement :

- Via URL : `?chaos=1`
- Avec seed personnalisé : `?chaos=1&seed=mon-seed`

Exemple :

```
http://localhost:3000?chaos=1&seed=test123
```

---

### Utiliser un seed spécifique

Le seed garantit la reproductibilité.  
Avec le même seed, vous obtiendrez exactement le même comportement.

---

### Headers HTTP

Vous pouvez aussi passer le seed via un header HTTP :

```
x-chaos-seed: mon-seed-personnalise
```

En production publique, ce header est ignoré sauf si la requête est autorisée en mode training.

---

## 📄 Pages disponibles

### 1. Authentification (`/auth`)

Scénarios de test :
- Login valide / invalide
- Gestion erreurs 401 simulées
- Expiration de session
- Délais réseau variables

Comptes de démonstration :
- demo@example.com / demo123
- admin@example.com / admin123

Data-testid :
- auth-form
- email-input
- password-input
- login-button
- auth-error
- logout-button
- welcome-message

---

### 2. Catalogue Produits (`/catalog`)

Scénarios :
- Filtres multi-critères
- Tri
- Pagination
- Recherche
- Skeleton loading

Data-testid :
- catalog-title
- catalog-filters
- search-input
- category-select
- brand-select
- sort-select
- catalog-products
- product-card-{id}
- product-name-{id}
- product-price-{id}
- product-add-to-cart-{id}
- catalog-pagination
- pagination-page-{n}

---

### 3. Panier & Checkout (`/cart`)

Scénarios :
- Ajout / suppression
- Modification quantité
- Calcul total
- Codes promo
- Erreurs serveur simulées

Codes promo :
- WELCOME10
- SAVE20
- BIG50

Data-testid :
- cart-title
- cart-items
- cart-item-{id}
- cart-item-quantity-{id}
- cart-item-increase-{id}
- cart-item-decrease-{id}
- cart-item-remove-{id}
- cart-summary
- summary-total
- promo-input
- promo-apply
- checkout-button
- checkout-modal

---

### 4. Formulaires Avancés (`/forms`)

Scénarios :
- Multi-étapes
- Champs conditionnels
- Validations temps réel
- Upload fichier

Data-testid :
- multi-step-form
- form-step-{n}
- form-step-{n}-content
- firstname-input
- lastname-input
- email-input
- phone-input
- address-input
- city-input
- postalcode-input
- country-select
- has-company-checkbox
- company-name-input
- company-vat-input
- file-input
- form-next
- form-previous
- form-submit

---

### 5. Table Admin (`/admin`)

Scénarios :
- Tri
- Sélection multiple
- Bulk delete
- Édition inline
- Colonnes redimensionnables

Data-testid :
- admin-table
- select-all-checkbox
- column-name
- column-price
- column-category
- table-row-{id}
- row-checkbox-{id}
- edit-button-{id}
- save-edit-{id}
- bulk-delete-button

---

### 6. Drag & Drop (`/dragdrop`)

Data-testid :
- dragdrop-title
- drop-zone-{listId}
- draggable-item-{id}

---

### 7. iFrames & Nouvelles Fenêtres (`/iframes`)

Data-testid :
- main-iframe
- iframe-content-title
- iframe-button
- new-window-input
- open-window-button

---

### 8. Téléchargements (`/downloads`)

Data-testid :
- downloads-title
- download-csv-button
- download-json-button

---

### 9. API Playground (`/api-playground`)

Endpoints :
- GET /api/products
- GET /api/products/[id]
- POST /api/cart
- GET /api/health

Data-testid :
- api-request-panel
- endpoint-select
- request-body
- send-request-button
- api-response-panel
- response-content

---

## 🔍 Observabilité

### Routes publiques

- GET /__health  
  État de santé minimal sans données sensibles.

### Routes internes protégées

- GET /__state  
- POST /api/reset  
- /admin/training  

Ces routes retournent 404 si la requête n’est pas autorisée.

---

## 🚀 Deployment (Public, Vercel)

### Variables d’environnement

Public :
- NEXT_PUBLIC_DEFAULT_CHAOS=0
- NEXT_PUBLIC_DEBUG=0

Serveur uniquement :
- INTERNAL_TRAINING_TOKEN=long-random-secret
- INTERNAL_DEBUG=0

### Règles

- Le chaos est désactivé par défaut.
- Les query params chaos et debug sont ignorés sans autorisation.
- Le token ne doit jamais apparaître côté client.

---

## 🔐 Internal training access (protected)

Autorisation requise via :

Header :

```
x-training-token: YOUR_TOKEN
```

Ou query param :

```
?training_token=YOUR_TOKEN
```

Comportement :

Sans token valide :
- /admin/training → 404
- /__state → 404
- POST /api/reset → 404

Avec token valide :
- Accès au panneau training
- Activation chaos + seed
- Debug visible

---

## 🧪 Exemples de tests

Voir `examples/` pour :
- Playwright
- Cypress
- Selenium

---

## 📋 Bonnes pratiques

### Sélecteurs

À faire :
- data-testid
- rôles ARIA

À éviter :
- texte seul
- sélecteurs fragiles

### Waits

À faire :
- waits explicites
- assertions auto-wait

À éviter :
- sleep fixes

### Retries

À faire :
- retries configurés
- logs utiles

À éviter :
- masquer des bugs réels

---

## 🛠 Technologies

- Next.js 14  
- TypeScript  
- Tailwind CSS  
- React Query  
- Framer Motion  

---

## 📝 Licence

MIT  

---

## 🤝 Contribution

Voir CONTRIBUTING.md  
