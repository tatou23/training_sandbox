# Guide de contribution

Merci de votre intérêt pour contribuer à Training Sandbox !

## 🎯 Objectifs du projet

Training Sandbox vise à fournir un environnement d'apprentissage pour les tests automatisés avec :
- Des scénarios réalistes et variés
- Un système de chaos reproductible
- Des composants intentionnellement difficiles à tester
- Une documentation complète

## 📋 Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une issue avec :
   - Description claire du problème
   - Steps to reproduce
   - Comportement attendu vs observé
   - Environnement (OS, navigateur, version)

### Proposer une fonctionnalité

1. Créez une issue pour discuter de la fonctionnalité
2. Décrivez le cas d'usage et les bénéfices
3. Attendez la validation avant de commencer à coder

### Soumettre du code

1. Fork le projet
2. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
3. Committez vos changements : `git commit -m 'Ajout de ma fonctionnalité'`
4. Push vers la branche : `git push origin feature/ma-fonctionnalite`
5. Ouvrez une Pull Request

## 🎨 Standards de code

### TypeScript

- Utilisez TypeScript strict
- Définissez des types explicites
- Évitez `any` autant que possible

### React

- Utilisez des composants fonctionnels
- Préférez les hooks aux classes
- Nommez les composants en PascalCase

### Styles

- Utilisez Tailwind CSS
- Préférez les classes utilitaires
- Gardez la cohérence avec le design existant

### Tests

- Ajoutez des `data-testid` pour tous les éléments interactifs
- Documentez les `data-testid` dans le README
- Testez vos changements manuellement

## 📝 Structure des commits

Utilisez des messages de commit clairs :

```
feat: Ajout de la page drag & drop
fix: Correction du calcul du total dans le panier
docs: Mise à jour de la documentation des data-testid
refactor: Simplification du système de chaos
```

## 🔍 Checklist avant de soumettre

- [ ] Le code compile sans erreurs
- [ ] Les tests passent (si applicable)
- [ ] La documentation est à jour
- [ ] Les `data-testid` sont documentés
- [ ] Le code respecte les standards du projet
- [ ] Les changements sont testés manuellement

## 🎓 Ajouter une nouvelle page

1. Créez la page dans `app/[nom-page]/page.tsx`
2. Créez le composant dans `components/pages/[NomPage].tsx`
3. Ajoutez la page au menu dans `components/pages/HomePage.tsx`
4. Documentez les `data-testid` dans le README
5. Ajoutez des exemples de tests si possible

## 🐛 Ajouter un composant "piège"

Les composants pièges doivent :
- Être contrôlables via le système de chaos
- Utiliser un seed pour la reproductibilité
- Ne jamais être purement aléatoires
- Documenter leur comportement

## 📚 Documentation

- Mettez à jour le README pour toute nouvelle fonctionnalité
- Documentez les `data-testid` dans un tableau
- Ajoutez des exemples d'utilisation si pertinent

## ❓ Questions ?

N'hésitez pas à ouvrir une issue pour toute question !
