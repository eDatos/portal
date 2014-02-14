# Instalación de OpenCMS

[http://localhost:8082/opencms/setup/](http://localhost:8082/opencms/setup/)

# Acceso a Administración
[http://localhost:8082/opencms/opencms/system/workplace/views/workplace.jsp](http://localhost:8082/opencms/opencms/system/workplace/views/workplace.jsp)

user: Admin
password: admin

# Importar portal del istac
Acceder a View -> Administration (Selector en la parte superior)

Module management -> Import Module with HTTP (Está en metamac-portal-opencms/istac/es.gobcan.istac.web_2.0.4.zip)
Database management -> Import File with HTTP (Está en metamac-portal-opencms/istac/contenidos_istac_des_opencms_20130816.zip)

# OpenCMS instalación del módulo (metamac-portal-opencms)

Module management -> Import Module with HTTP (Está en metamac-portal-opcenms/target/metamac-portal-opencms-numerodeversion)

**Reiniciar el servidor**

# Configuración del módulo

## Creación de contenido

El módulo se compone de dos páginas:

* **index.html** : Muestra la lista de colecciones. Se corresponde con la página 1
* **view.html** : Muestra el detalle de queries y collections. Se corresponde con la página 2 y 3


Crear los siguientes  dentro de istac/metamac desde View explorer (offline) -> New

metamac.html
- type: structured content -> metamac
- Edit:
-- ApiURL: http://estadisticas.arte-consultores.com/statistical-resources/apis/statistical-resources/v1.0

index.html
- type: containerpage
- properties -> individual properties -> template -> /system/modules/es.gobcan.istac.web/templates/plantilla_1col.jsp
- Edit
-- Containers
--- Name: centercontainer
--- Type: center
--- Elements
---- content element: /istac/metamac/metamac.html
---- formatter: /system/modules/org.siemac.metamac.metamac-portal/formatters/collection.jsp

view.html
- type: containerpage
- properties -> individual properties -> template -> /system/modules/es.gobcan.istac.web/templates/plantilla_1col.jsp
- Edit
-- Containers
--- Name: centercontainer
--- Type: center
--- Elements
---- content element: /istac/metamac/metamac.html
---- formatter: /system/modules/org.siemac.metamac.metamac-portal/formatters/view.jsp

Publish

### Configuración del opencms

Para permitir que el opencms exporte las fuentes como recursor estáticos modifica el fichero `opencms/WEB-INF/config/opencms-importexport.xml` y añade los nuevos sufijos:

         <staticexport enabled="true">
                    ...
                    <defaultsuffixes>
                            ...
                            <suffix key=".woff" />
                            <suffix key=".ttf" />
                            <suffix key=".svg" />
                            <suffix key=".eot" />
                    </defaultsuffixes>
         </staticexport>

Existe una guía quizá más detallada en METAMAC-2125
