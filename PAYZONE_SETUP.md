# Configuration Payzone

## Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env` :

```env
# Configuration Payzone
PAYZONE_MERCHANT_ID=votre_merchant_id
PAYZONE_API_KEY=votre_api_key
PAYZONE_API_SECRET=votre_api_secret
PAYZONE_BASE_URL=https://payment.payzone.ma/pwthree/launch

# URL de votre application (pour les callbacks)
APP_URL=http://localhost:8000
```

**⚠️ IMPORTANT :** Après avoir ajouté ou modifié ces variables dans le fichier `.env`, vous devez exécuter la commande suivante pour vider le cache de configuration :

```bash
php artisan config:clear
```

Ou si vous êtes en production :

```bash
php artisan config:cache
```

## Étapes de configuration

1. **Créer un compte Payzone** :
   - Inscrivez-vous sur [payzone.ma](https://payzone.ma)
   - Activez votre compte marchand

2. **Obtenir vos identifiants** :
   - Connectez-vous à votre tableau de bord Payzone
   - Récupérez votre `MERCHANT_ID`, `API_KEY` et `API_SECRET`
   - Notez l'URL de base de l'API Payzone

3. **Configurer les URLs de callback** :
   - URL de retour (succès) : `https://votre-domaine.com/don/return`
   - URL d'annulation : `https://votre-domaine.com/don/cancel`
   - URL de notification (webhook) : `https://votre-domaine.com/api/don/callback`

4. **Tester l'intégration** :
   - Utilisez les identifiants de test fournis par Payzone
   - Testez le processus complet de don
   - Vérifiez que les callbacks fonctionnent correctement

## Documentation Payzone

Consultez la documentation officielle de Payzone pour plus de détails :
- [Documentation Payzone](https://payzone.ma/documentation/)

## Notes importantes

- La méthode de signature peut varier selon la version de l'API Payzone
- Assurez-vous que votre serveur est accessible depuis Internet pour recevoir les callbacks
- Utilisez HTTPS en production pour sécuriser les transactions

