## Homework Manager ##

An unserer Schule gibt es häufig das Problem, dass die Lehrer die Hausaufgaben nicht rechtzeitig ansagen, oder dass die Schüler einfach nicht mitbekommen, dass der Lehrer welche aufgegeben hat.

 Der **Homework Manager** sorgt in diesem Fall für eine einfachere Kommunikation zwischen Lehrern und Schülern. Der Lehrer kann die Hausaufgaben in dem Homework Manager eintragen, und die Schüler können diese dann abrufen. Neben der konkreten Aufgabe kann der Lehrer auch angeben, zu wann die Hausaufgaben erledigt werden sollen. 

###Plattformen###
Den Homework Manager gibt es sowohl als **Website** als auch als **Android Applikation**.

###Aufbau/Architektur###

![Aufbau](Aufbau_Architektur_HomeworkManager.png)
Zum Speichern der zentralen Daten dient eine Firebase Datenbank, auf welche der NodeJS-Server und die Android-App zugreifen können. Durch diese Architektur könne die Hausaufgaben zentral verwaltet und vom Schüler abgerufen werden.