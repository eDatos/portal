# Wrapper para grunt-webfont

- Hacemos *docker build -t grunt-webfont .* para descargar el docker con la última versión de grunt-webfont y fontforge
- Compartimos desde VirtualBox en la docker-machine (*default*) carpeta permanente, automontable, "w" con la ruta "W:\" en la máquina default asociada a docker, para que desde dentro sea accesible la ruta /w/ISTAC/2010-metamac/04-git/metamac-portal/metamac-portal-web-client/
- En este punto, ejecutamos *bash grunt-webfont.sh*. Contiene simplemente los parámetros para lanzar el contenedor de docker y ejecutar la tarea grunt webfont
- Si hubiera fallos, probar con un único svg e ir avanzando, hay ocasiones en las que un único carácter con errores paraliza todo el proceso