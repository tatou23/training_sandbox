# Référence des data-testid

Ce document liste tous les `data-testid` disponibles dans l'application pour faciliter l'écriture de tests.

## Page d'accueil (`/`)

| data-testid | Description |
|-------------|-------------|
| `app-title` | Titre principal de l'application |
| `app-subtitle` | Sous-titre de l'application |
| `exercises-title` | Titre de la section exercices |
| `exercise-link-{id}` | Lien vers un exercice spécifique |
| `exercise-title-{id}` | Titre d'un exercice |
| `exercise-description-{id}` | Description d'un exercice |
| `chaos-controls` | Panneau de contrôle du chaos |
| `chaos-controls-title` | Titre du panneau chaos |
| `chaos-toggle` | Checkbox pour activer/désactiver le chaos |
| `chaos-toggle-label` | Label du toggle chaos |
| `chaos-seed-label` | Label du champ seed |
| `chaos-seed-input` | Champ de saisie du seed |
| `chaos-seed-random` | Bouton pour générer un seed aléatoire |
| `chaos-seed-help` | Texte d'aide pour le seed |
| `chaos-state-title` | Titre de la section état |
| `chaos-state-enabled` | État activé/désactivé du chaos |
| `chaos-state-seed` | Seed actuel |
| `chaos-state-latency` | Latence réseau configurée |
| `chaos-state-error-rate` | Taux d'erreur configuré |

## Authentification (`/auth`)

| data-testid | Description |
|-------------|-------------|
| `auth-form` | Formulaire de connexion |
| `auth-title` | Titre de la page |
| `email-label` | Label du champ email |
| `email-input` | Champ de saisie email |
| `password-label` | Label du champ mot de passe |
| `password-input` | Champ de saisie mot de passe |
| `login-button` | Bouton de connexion |
| `auth-error` | Message d'erreur |
| `auth-success` | Conteneur après connexion réussie |
| `welcome-message` | Message de bienvenue |
| `user-email` | Email de l'utilisateur connecté |
| `logout-button` | Bouton de déconnexion |
| `demo-users-title` | Titre de la section comptes démo |
| `demo-users-list` | Liste des comptes démo |
| `demo-user-{email}` | Compte démo spécifique |

## Catalogue Produits (`/catalog`)

| data-testid | Description |
|-------------|-------------|
| `catalog-title` | Titre de la page |
| `catalog-filters` | Zone de filtres |
| `search-label` | Label du champ recherche |
| `search-input` | Champ de recherche |
| `category-label` | Label du sélecteur catégorie |
| `category-select` | Sélecteur de catégorie |
| `category-option-{cat}` | Option de catégorie |
| `brand-label` | Label du sélecteur marque |
| `brand-select` | Sélecteur de marque |
| `brand-option-{brand}` | Option de marque |
| `sort-label` | Label du sélecteur tri |
| `sort-select` | Sélecteur de tri |
| `sort-option-{option}` | Option de tri |
| `catalog-results-count` | Nombre de résultats |
| `catalog-products` | Liste des produits |
| `product-card-{id}` | Carte produit |
| `product-name-{id}` | Nom du produit |
| `product-description-{id}` | Description du produit |
| `product-price-{id}` | Prix du produit |
| `product-rating-{id}` | Note du produit |
| `product-add-to-cart-{id}` | Bouton ajouter au panier |
| `catalog-pagination` | Pagination |
| `pagination-prev` | Bouton précédent |
| `pagination-page-{n}` | Bouton page spécifique |
| `pagination-next` | Bouton suivant |

## Panier & Checkout (`/cart`)

| data-testid | Description |
|-------------|-------------|
| `cart-title` | Titre de la page |
| `cart-empty` | Message panier vide |
| `cart-empty-message` | Texte panier vide |
| `cart-items` | Liste des articles |
| `cart-item-{id}` | Article du panier |
| `cart-item-name-{id}` | Nom de l'article |
| `cart-item-price-{id}` | Prix unitaire |
| `cart-item-quantity-{id}` | Quantité |
| `cart-item-increase-{id}` | Bouton augmenter quantité |
| `cart-item-decrease-{id}` | Bouton diminuer quantité |
| `cart-item-remove-{id}` | Bouton supprimer |
| `cart-item-total-{id}` | Total pour l'article |
| `cart-summary` | Récapitulatif |
| `summary-title` | Titre du récapitulatif |
| `summary-subtotal` | Sous-total |
| `summary-discount` | Remise |
| `summary-tax` | TVA |
| `summary-shipping` | Frais de livraison |
| `summary-total` | Total |
| `promo-label` | Label code promo |
| `promo-input` | Champ code promo |
| `promo-apply` | Bouton appliquer code |
| `promo-error` | Erreur code promo |
| `shipping-label` | Label livraison |
| `shipping-standard` | Radio livraison standard |
| `shipping-express` | Radio livraison express |
| `checkout-button` | Bouton passer commande |
| `checkout-modal` | Modal de confirmation |
| `checkout-modal-message` | Message modal |
| `checkout-modal-summary` | Récapitulatif modal |
| `checkout-modal-cancel` | Bouton annuler |
| `checkout-modal-confirm` | Bouton confirmer |
| `checkout-confirmation` | Page de confirmation |
| `confirmation-title` | Titre confirmation |
| `confirmation-message` | Message confirmation |
| `confirmation-continue` | Bouton continuer |

## Formulaires Multi-Étapes (`/forms`)

| data-testid | Description |
|-------------|-------------|
| `forms-title` | Titre de la page |
| `form-progress` | Indicateur de progression |
| `form-step-{n}` | Indicateur étape |
| `form-step-label-{n}` | Label étape |
| `form-step-{n}-content` | Contenu étape |
| `multi-step-form` | Formulaire principal |
| `step-{n}-title` | Titre de l'étape |
| `firstname-label` | Label prénom |
| `firstname-input` | Champ prénom |
| `firstname-error` | Erreur prénom |
| `lastname-label` | Label nom |
| `lastname-input` | Champ nom |
| `lastname-error` | Erreur nom |
| `email-label` | Label email |
| `email-input` | Champ email |
| `email-error` | Erreur email |
| `phone-label` | Label téléphone |
| `phone-input` | Champ téléphone |
| `phone-error` | Erreur téléphone |
| `address-label` | Label adresse |
| `address-input` | Champ adresse |
| `address-error` | Erreur adresse |
| `city-label` | Label ville |
| `city-input` | Champ ville |
| `city-error` | Erreur ville |
| `postalcode-label` | Label code postal |
| `postalcode-input` | Champ code postal |
| `postalcode-error` | Erreur code postal |
| `country-label` | Label pays |
| `country-select` | Sélecteur pays |
| `country-option-{code}` | Option pays |
| `country-error` | Erreur pays |
| `has-company-checkbox` | Checkbox entreprise |
| `has-company-label` | Label checkbox entreprise |
| `company-fields` | Zone champs entreprise |
| `company-name-label` | Label nom entreprise |
| `company-name-input` | Champ nom entreprise |
| `company-name-error` | Erreur nom entreprise |
| `company-vat-label` | Label TVA |
| `company-vat-input` | Champ TVA |
| `company-vat-error` | Erreur TVA |
| `file-label` | Label fichier |
| `file-input` | Upload fichier |
| `file-name` | Nom fichier sélectionné |
| `file-error` | Erreur fichier |
| `form-previous` | Bouton précédent |
| `form-next` | Bouton suivant |
| `form-submit` | Bouton envoyer |
| `form-success-message` | Message succès |

## Table Admin (`/admin`)

| data-testid | Description |
|-------------|-------------|
| `admin-title` | Titre de la page |
| `admin-table` | Table principale |
| `select-all-checkbox` | Checkbox sélectionner tout |
| `column-name` | Colonne nom |
| `column-price` | Colonne prix |
| `column-category` | Colonne catégorie |
| `column-brand` | Colonne marque |
| `column-rating` | Colonne note |
| `column-actions` | Colonne actions |
| `table-row-{id}` | Ligne du tableau |
| `row-checkbox-{id}` | Checkbox de ligne |
| `row-name-{id}` | Nom dans la ligne |
| `row-price-{id}` | Prix dans la ligne |
| `row-category-{id}` | Catégorie dans la ligne |
| `row-brand-{id}` | Marque dans la ligne |
| `row-rating-{id}` | Note dans la ligne |
| `edit-button-{id}` | Bouton modifier |
| `edit-name-{id}` | Champ nom en édition |
| `edit-price-{id}` | Champ prix en édition |
| `save-edit-{id}` | Bouton sauvegarder |
| `cancel-edit-{id}` | Bouton annuler |
| `bulk-delete-button` | Bouton suppression en masse |

## Drag & Drop (`/dragdrop`)

| data-testid | Description |
|-------------|-------------|
| `dragdrop-title` | Titre de la page |
| `drop-zone-{listId}` | Zone de drop |
| `list-title-{listId}` | Titre de la liste |
| `draggable-item-{id}` | Élément déplaçable |

## iFrames (`/iframes`)

| data-testid | Description |
|-------------|-------------|
| `iframes-title` | Titre de la page |
| `iframe-section-title` | Titre section iframe |
| `main-iframe` | iFrame principal |
| `iframe-content-title` | Titre dans l'iframe |
| `iframe-content-text` | Texte dans l'iframe |
| `iframe-button` | Bouton dans l'iframe |
| `new-window-section-title` | Titre section nouvelle fenêtre |
| `new-window-input` | Champ URL nouvelle fenêtre |
| `open-window-button` | Bouton ouvrir fenêtre |
| `open-home-window` | Bouton ouvrir page d'accueil |

## Téléchargements (`/downloads`)

| data-testid | Description |
|-------------|-------------|
| `downloads-title` | Titre de la page |
| `export-section-title` | Titre section export |
| `export-description` | Description export |
| `download-csv-button` | Bouton télécharger CSV |
| `download-json-button` | Bouton télécharger JSON |

## API Playground (`/api-playground`)

| data-testid | Description |
|-------------|-------------|
| `api-playground-title` | Titre de la page |
| `api-request-panel` | Panneau requête |
| `request-title` | Titre panneau requête |
| `endpoint-label` | Label endpoint |
| `endpoint-select` | Sélecteur endpoint |
| `endpoint-option-{path}` | Option endpoint |
| `endpoint-description` | Description endpoint |
| `body-label` | Label body |
| `request-body` | Corps requête |
| `send-request-button` | Bouton envoyer |
| `api-response-panel` | Panneau réponse |
| `response-title` | Titre panneau réponse |
| `response-content` | Contenu réponse |
| `api-documentation` | Documentation API |
| `documentation-title` | Titre documentation |
| `doc-endpoint-{path}` | Endpoint documenté |
| `doc-method-{path}` | Méthode HTTP |
| `doc-path-{path}` | Chemin endpoint |
| `doc-description-{path}` | Description endpoint |

## Composants pièges

| data-testid | Description |
|-------------|-------------|
| `popup-overlay` | Overlay popup |
| `popup-content` | Contenu popup |
| `popup-title` | Titre popup |
| `popup-message` | Message popup |
| `popup-close` | Bouton fermer popup |
| `modal-overlay` | Overlay modal |
| `modal-content` | Contenu modal |
| `modal-title` | Titre modal |
| `modal-body` | Corps modal |
| `modal-close` | Bouton fermer modal |
| `toast-container` | Conteneur toasts |
| `toast-{type}` | Toast spécifique |
| `toast-message-{id}` | Message toast |
| `toast-close-{id}` | Bouton fermer toast |
| `spinner` | Spinner de chargement |
| `skeleton-{index}` | Skeleton loader |

## Navigation

| data-testid | Description |
|-------------|-------------|
| `main-nav` | Navigation principale |
| `nav-home-link` | Lien page d'accueil |
| `nav-back-link` | Lien retour |
