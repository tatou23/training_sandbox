# Guide de démarrage rapide

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## Mode Chaos

### Activer le chaos

```
http://localhost:3000?chaos=1
```

### Avec seed personnalisé

```
http://localhost:3000?chaos=1&seed=mon-test
```

Le même seed produira toujours le même comportement, garantissant la reproductibilité.

## Pages disponibles

1. **Home** (`/`) - Menu des exercices et contrôles chaos
2. **Auth** (`/auth`) - Authentification avec erreurs simulées
3. **Catalogue** (`/catalog`) - Produits avec filtres et pagination
4. **Panier** (`/cart`) - Checkout avec codes promo
5. **Formulaires** (`/forms`) - Formulaire multi-étapes
6. **Admin** (`/admin`) - Table avec tri et édition inline
7. **Drag & Drop** (`/dragdrop`) - Réorganisation d'éléments
8. **iFrames** (`/iframes`) - Gestion des contextes multiples
9. **Téléchargements** (`/downloads`) - Export CSV/JSON
10. **API Playground** (`/api-playground`) - Tester les endpoints

## Routes API

- `GET /api/products` - Liste des produits
- `GET /api/products/[id]` - Produit spécifique
- `POST /api/cart` - Ajouter au panier
- `GET /api/health` - État de santé

## Routes de debug

- `GET /__health` - État avec info chaos
- `GET /__state` - État complet du chaos
- `POST /api/reset` - Réinitialiser l'état

## Tests

Voir le dossier `examples/` pour des exemples de tests avec Playwright et Cypress.

## Documentation

- `README.md` - Documentation complète
- `DATA_TESTIDS.md` - Référence des data-testid
- `CONTRIBUTING.md` - Guide de contribution

## Docker (optionnel)

```bash
docker-compose up
```
