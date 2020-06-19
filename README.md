# COVID-19-Data-Visualisation
## Contexte
Ce projet a été réalisé dans le cadre du cours Visualisation de données dispensé par 	Loïc Cattani, Isaac Pante (SLI, Lettres, UNIL) afin qu’appliquer les méthodologies et les notions enseignées dans la visualisation de données.
## Description
L'objectif de ce projet est de comparer les cas de covid-19 entre 3 pays.
## Réalisation
Dans le but de visualiser de données, j'ai décidé d'utiliser la bibliothèque graphique(d3.js) JavaScript qui permet l'affichage de données numériques sous une forme graphique et dynamique.
##  Source
À la recherche d'une source pour les données, j’ai trouvé le référentiel de données CSSE Johns Hopkins sur GitHub qui est mis à jour fréquemment. Les données sont stockées au format CSV, j'avais donc besoin d'un moyen de les charger dans un site Web. Heureusement, j'ai trouvé ce lien pour accéder aux données : https://github.com/CSSEGISandData/COVID-19/issues/8. Ce lien (API JSON) m’a permis d’exposer de données. En effet, en se rendant à cette URL, on peut avoir les données du site au format JSON.
## Exemple
Ce graphique montre le nombre cumulé de cas détectés de COVID-19 dans une sélection des 3 pays.
![Cas confirmés](/chart/Capture1.png)
Ce graphique montre l'évolution du nombre de décès identifiés par mois dans les pays sélectionnés.
![Cas déces](/chart/Capture2.png)
