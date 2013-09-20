# Instalación de OpenCMS

http://localhost:8082/opencms/setup/

# Importar portal del istac

Administración
http://localhost:8082/opencms/opencms/system/workplace/views/workplace.jsp

user: Admin
password: admin

Importar módulo : es.gobcan.istac.web_2.0.4.zip
Importar contenidos : contenidos_istac_des-opencms_20130816.zip


# OpenCMS instalación del módulo

http://localhost:8082/opencms/opencms/system/workplace/views/workplace.jsp

Ir a  `Administration View`  >  `Module Management` > `Import Module with HTTP`

**Reiniciar el servidor**

# Configuración del módulo

## Creación de página que lo incluye

View: Explorer
Site: /sites/default/istac/metamac

new > structured contents > metamac

Name: metamac.html

Edit metamac.html
ApiUrl: http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0

index.html

Containers >
name: centercontainer
type: center

> Elements >
Content element: /istac/metamac/metamac.html
    Formatter: /system/modules/org.siemac.metamac.metamac-portal/formatters/all.jsp



### Configurations

En fichero `opencms/WEB-INF/config/opencms-importexport.xml` añadir:

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

