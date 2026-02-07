# Congo Booking

Application mobile iOS et Android de reservation d'hotels et appartements meubles au Congo Brazzaville.

## Fonctionnalites

- **Recherche** : Trouvez des hotels et appartements meubles a Brazzaville
- **Filtres** : Filtrez par type (hotel/appartement), quartier, prix et note
- **Details** : Consultez les photos, equipements, description et tarifs
- **Reservation** : Reservez directement depuis l'application
- **Favoris** : Sauvegardez vos hebergements preferes
- **Profil** : Gerez vos reservations et votre compte

## Technologies

- **React Native** (Expo) - Framework mobile cross-platform
- **TypeScript** - Typage statique
- **React Navigation** - Navigation entre ecrans
- **Context API** - Gestion d'etat

## Demarrage

```bash
cd congo-booking
npm install
npx expo start
```

## Structure du projet

```
congo-booking/
  src/
    components/    # Composants reutilisables (PropertyCard, SearchBar)
    context/       # Contexte global (AppContext)
    data/          # Donnees fictives (proprietes)
    screens/       # Ecrans de l'application
    theme/         # Couleurs et theme
    types/         # Types TypeScript
    utils/         # Fonctions utilitaires
  App.tsx          # Point d'entree
```

## Ecrans

| Ecran | Description |
|-------|-------------|
| Accueil | Recherche, categories, proprietes en vedette |
| Recherche | Liste filtrable et triable |
| Details | Photos, equipements, prix, contact |
| Reservation | Selection dates, voyageurs, confirmation |
| Favoris | Liste des hebergements favoris |
| Profil | Compte utilisateur et historique reservations |
| Authentification | Connexion et inscription |
