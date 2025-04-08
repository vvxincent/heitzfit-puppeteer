
# HeitzFit Puppeteer API

Un mini-serveur Node.js qui se connecte à HeitzFit, récupère les créneaux padel avec `0/4`, et expose une route HTTP `/slots` à appeler depuis n8n Cloud.

## Démarrage local

1. Cloner ou extraire ce dossier
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur :
   ```bash
   npm start
   ```

4. Appeler depuis n8n Cloud :
   ```
   GET https://votre-serveur.com/slots
   ```

Déploie-le facilement sur Render, Railway, Vercel ou Fly.io.
