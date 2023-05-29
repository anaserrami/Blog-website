# projet-web

## Étapes pour démarrer le projet

Ce projet est divisé en deux parties : 
 - une partie /Frontend/ réalisée avec le framework React & Tailwindcss. 
 - une autre /Backend/ réalisée avec NodeJs Express & Prisma.

Pour tester le projet on le clone d'abord avec la commande:    
git clone https://github.com/anaserrami/projet-web.git 

### Partie Backend: 
  
Pour la partie /backend/ il faut installer `node_modules` en executant les commandes suivant dans le `git bash` ou `cmd`:  
  
## cd backend
## npm i
 
Et dans le fichier `.env` qui contient `DATABASE_URL` le lien pour la base de données (mettez le nom d'utilisateur et le mot de passe de votre base de données dans `DATABASE_URL` ) et `TOKEY_KEY`, alors remplir par le code suivant :

## DATABASE_URL="mysql://username:yourpassword@host:port/database_name"
## TOKEN_KEY = "blog-bdcc-web-s2"
  
Apres il faut faire la migration de la base donnees avec la commande suivant:

## npx prisma migrate dev 
  
Nous devons remplir la base de données en utilisant le fichier seeds situé dans le dossier seeds :

## node seeds/seeds.js 
  
Apres lancer le projet avec la commade :

## npm start 
 
Si le port `3001` est deja utiliser il faut le changer dans `/bin/www` par un autre port  

### Partie Frontend: 
  
Dans un autre terminal `cmd` on accede au frontend par :

## cd frontend

Et on doit installer `node_modules` puis lancer le projet avec la commande suivant:  
  
## npm i
## npm start 
  
Apres, assurez-vous que vous démarrez mysql en utilisant `xaamp` et naviguer vers `http://localhost:3000/` pour voir le projet.