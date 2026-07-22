# SOC Threat Monitor

Application Single Page permettant de centraliser, enrichir et investiguer des alertes de sécurité (logs de connexion) en temps réel. Réalisée dans le cadre d'un test technique frontend.

## Aperçu

Les analystes SOC reçoivent un flux continu d'alertes (IP, type de menace, criticité, statut) diffusé via WebSocket. Chaque alerte peut être investiguée en un clic : géolocalisation et ISP de l'IP source (via IPinfo), puis bannissement ou mise en sourdine en un clic.

## Stack technique

**Frontend**
- React 19 + TypeScript + Vite
- Zustand — état global du flux d'alertes
- TanStack Query — enrichissement IPinfo (cache, TTL, gestion loading/error)
- react-use-websocket — connexion temps réel avec reconnexion automatique
- TailwindCSS v4 + shadcn/ui

**Backend**
- FastAPI (Python) — génération et diffusion des alertes simulées via WebSocket, endpoint d'action (bannir/ignorer)

## Installation et lancement

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows : venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Le serveur écoute sur `http://localhost:8000`. Le flux d'alertes est diffusé via `ws://localhost:8000/ws/alerts`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`. Le backend doit être lancé au préalable pour que le flux temps réel fonctionne.

## Fonctionnalités

**Flux de données**
- Génération continue d'alertes côté backend, diffusées toutes les 15 secondes via WebSocket.
- Simulation d'échecs réalistes (~15% des cycles, codes 429/500/502/503) représentant une panne de la source de logs, gérés sans jamais casser l'application.
- Cache avec TTL (1h) sur les requêtes IPinfo pour éviter les appels redondants sur une même IP.

**Interface**
- Arrivée des nouvelles alertes en fondu + léger glissement, accompagnée d'un bref halo de la couleur de sévérité.
- Panneau d'investigation par IP : géolocalisation, ISP/hébergeur (IPinfo).
- Actions "Bannir l'IP" / "Ignorer l'alerte" avec état de chargement puis retour visuel de succès.
- Filtres (sévérité, statut, recherche IP/menace) et tri (date, criticité, type de menace, statut).
- Affichage des erreurs API via toasts non bloquants.

**Bonus**
- Pause / reprise du flux live
- Indicateur d'état de connexion WebSocket
- Dark mode avec bouton de bascule (persistant, détection de la préférence système)

## Choix techniques

- **WebSocket plutôt que polling HTTP** : Plutôt que de faire un polling régulier (setInterval) côté frontend qui consomme des ressources, j'ai opté pour un serveur FastAPI. Cela permet d'établir une véritable connexion WebSocket, illustrant une gestion temps réel réaliste.
- **Zustand plutôt que Redux** : Pour gérer un flux continu d'alertes, Zustand s'est imposé comme une alternative plus légère, rapide et moins verbeuse que Redux.
- **TanStack Query pour l'enrichissement IPinfo** : Utilisé pour l'enrichissement IP via IPinfo. C'est le choix optimal pour répondre à la contrainte d'éviter les appels redondants grâce à son système de cache.
- **shadcn/ui + TailwindCSS v4** : composants accessibles par défaut, UI cohérente et rapide à composer.
- **Backend FastAPI volontairement minimal** : le sujet précise que l'évaluation porte sur les compétences frontend (état asynchrone, gestion de la donnée, performance de re-render, architecture, UX) ; le backend se limite donc à l'orchestration nécessaire (génération d'alertes, diffusion WebSocket, endpoint d'action), sans logique métier avancée.
- **Séparation hooks / store / composants** : `useAlertWebSocket` et `useIpInfo` isolent la logique asynchrone, `useAlertStore` centralise la donnée, les composants restent focalisés sur l'affichage.

## Ce qui manque / pistes d'amélioration avec plus de temps

- Aucun test (unitaire, intégration, end-to-end) n'a été écrit.
- Pas de CI (lint / test / build).
- Pas de virtualisation de la liste (react-window ou équivalent) : non nécessaire à l'échelle actuelle, mais à prévoir si le volume d'alertes simultanées devait fortement augmenter.
- L'endpoint `POST /api/alerts/{id}/action` ne simule pas d'échec ; seule la génération du flux d'alertes en simule.
- Pas de maquette Figma dédiée : le design a été itéré directement en code (shadcn/Tailwind).