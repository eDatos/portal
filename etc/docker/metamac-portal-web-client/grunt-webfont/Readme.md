# Wrapper para grunt-webfont

- Hacemos *docker build -t grunt-webfont .* para descargar el docker con la última versión de grunt-webfont y fontforge
- Compartimos desde VirtualBox en la docker-machine (*default*) carpeta permanente, automontable, "Proyectos" con la ruta "D:\Proyectos" en la máquina default asociada a docker, para que desde dentro sea accesible la ruta /w/ISTAC/2010-metamac/04-git/metamac-portal/metamac-portal-web-client/
-- Si la versión de docker instalada en windows es la que usa la docker-machine, y la versión es 1.11.1, es posible que la carpeta compartida no esté disponible aunque esté configurada y debamos montar a mano dicha carpeta cada vez que levantamos la máquina mediante *mkdir /w* y *sudo mount -t vboxsf Proyectos /w*
- En este punto, ejecutamos *bash grunt-webfont.sh*. Contiene simplemente los parámetros para lanzar el contenedor de docker y ejecutar la tarea grunt webfont
- Si hubiera fallos, probar con un único svg e ir avanzando, hay ocasiones en las que un único carácter con errores paraliza todo el proceso