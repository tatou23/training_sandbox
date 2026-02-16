# Exemples de tests

Ce dossier contient des exemples de tests pour Training Sandbox avec différents frameworks.

## 📁 Fichiers disponibles

- `playwright.spec.ts` - Exemples de tests Playwright
- `cypress.cy.ts` - Exemples de tests Cypress
- `selenium.py` - Exemples de tests Selenium (à venir)

## 🚀 Configuration

### Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

Exécuter les tests :
```bash
npx playwright test examples/playwright.spec.ts
```

### Cypress

```bash
npm install -D cypress
```

Ouvrir Cypress :
```bash
npx cypress open
```

Ou exécuter en mode headless :
```bash
npx cypress run
```

## 📋 Stratégies anti-flakiness

### 1. Sélecteurs stables

✅ Utiliser `data-testid` :
```typescript
await page.getByTestId('login-button').click()
```

❌ Éviter les sélecteurs fragiles :
```typescript
await page.locator('button:has-text("Se connecter")').click() // Fragile !
```

### 2. Attentes explicites

✅ Attendre les éléments :
```typescript
await expect(page.getByTestId('welcome-message')).toBeVisible()
```

✅ Attendre les requêtes réseau :
```typescript
await page.waitForResponse(response => response.url().includes('/api/products'))
```

❌ Éviter les délais fixes :
```typescript
await page.waitForTimeout(5000) // Mauvaise pratique !
```

### 3. Assertions robustes

✅ Vérifier l'état final :
```typescript
await expect(page.getByTestId('cart-summary')).toContainText('Total: 99.99 €')
```

❌ Éviter les assertions sur des états transitoires :
```typescript
// Ne pas vérifier pendant une animation
```

### 4. Gestion du mode chaos

✅ Utiliser un seed fixe pour la reproductibilité :
```typescript
await page.goto('http://localhost:3000/?chaos=1&seed=test123')
```

✅ Vérifier l'état du chaos :
```typescript
const chaosState = await page.getByTestId('chaos-state-enabled').textContent()
expect(chaosState).toContain('Activé')
```

## 🎯 Scénarios couverts

Les exemples couvrent :
- Authentification (login/logout)
- Catalogue avec filtres et recherche
- Panier et checkout
- Formulaires multi-étapes
- Mode chaos

## 📝 Bonnes pratiques

1. **Isolation** : Chaque test doit être indépendant
2. **Nettoyage** : Réinitialiser l'état entre les tests
3. **Timeouts** : Utiliser des timeouts appropriés
4. **Logs** : Logger les actions importantes pour le debug
5. **Retries** : Configurer des retries au niveau du framework

## 🔍 Debugging

### Playwright

```bash
# Mode debug avec UI
npx playwright test --ui

# Mode debug avec trace
npx playwright test --trace on
```

### Cypress

```bash
# Mode interactif
npx cypress open

# Mode debug dans le code
cy.pause()
```

## 🤝 Contribution

N'hésitez pas à ajouter d'autres exemples de tests ou à améliorer ceux existants !
