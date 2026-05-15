# DéconstructIQ — Guide de déploiement

## Structure du projet
```
deconstructiq/
├── public/
│   └── index.html        ← Frontend (interface utilisateur)
├── api/
│   └── analyze.js        ← Backend sécurisé (clé Gemini cachée)
├── vercel.json           ← Configuration déploiement
└── README.md
```

---

## Étape 1 — Préparer ta clé Gemini
Ta clé Gemini : AIzaSyD1PEVX24u7FWjHk-R36m3qA3sTWdBHvwY
⚠️ Ne la partage JAMAIS publiquement — elle sera stockée en variable d'environnement sécurisée sur Vercel.

---

## Étape 2 — Créer un compte GitHub (si pas encore fait)
1. Va sur https://github.com
2. Crée un compte gratuit
3. Crée un nouveau repository : "deconstructiq"
4. Upload tous les fichiers de ce dossier

---

## Étape 3 — Déployer sur Vercel
1. Va sur https://vercel.com
2. Connecte-toi avec ton compte GitHub
3. Clique "Add New Project"
4. Sélectionne ton repository "deconstructiq"
5. Clique "Deploy"

---

## Étape 4 — Ajouter ta clé Gemini (IMPORTANT)
Dans Vercel, après le déploiement :
1. Va dans Settings → Environment Variables
2. Ajoute une variable :
   - Name  : GEMINI_API_KEY
   - Value : AIzaSyD1PEVX24u7FWjHk-R36m3qA3sTWdBHvwY
3. Clique Save
4. Redéploie (Deployments → Redeploy)

---

## Résultat
Ton app sera accessible sur : https://deconstructiq.vercel.app
(ou un nom similaire choisi par Vercel)

---

## Sécurité
- La clé Gemini n'est JAMAIS visible dans le code frontend
- Elle est stockée côté serveur dans /api/analyze.js via process.env
- Gratuit jusqu'à 1500 analyses/jour avec Gemini Flash

---

## Prochaines fonctionnalités à développer
- [ ] Export PDF Passeport Matériaux
- [ ] Base de données des audits (Supabase gratuit)
- [ ] Authentification utilisateurs
- [ ] Mode caméra live sur mobile
- [ ] Annuaire réel des acheteurs genevois
