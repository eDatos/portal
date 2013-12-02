# Instalación de OpenCMS

[http://localhost:8082/opencms/setup/](http://localhost:8082/opencms/setup/)

# Importar portal del istac

Administración
[http://localhost:8082/opencms/opencms/system/workplace/views/workplace.jsp](http://localhost:8082/opencms/opencms/system/workplace/views/workplace.jsp)

user: Admin
password: admin

Importar módulo : es.gobcan.istac.web_2.0.4.zip
Importar contenidos : contenidos_istac_des-opencms_20130816.zip


# OpenCMS instalación del módulo

[http://localhost:8082/opencms/opencms/system/workplace/views/workplace.jsp](http://localhost:8082/opencms/opencms/system/workplace/views/workplace.jsp)

Ir a  `Administration View`  >  `Module Management` > `Import Module with HTTP`

**Reiniciar el servidor**

# Configuración del módulo

## Creación de contenido

El módulo se compone de dos páginas:

* **index.html** : Muestra la lista de colecciones. Se corresponde con la página 1
* **view.html** : Muestra el detalle de queries y collections. Se corresponde con la página 2 y 3


View: Explorer
Site: /sites/default/istac/metamac

	new > structured contents > metamac
		Name: metamac.html

Edit metamac.html
ApiUrl: 

	http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0

index.html

	Containers >
		name: centercontainer
		type: center

	Elements >
		Content element: /istac/metamac/metamac.html
	    Formatter: /system/modules/org.siemac.metamac.metamac-portal/formatters/collection.jsp


Por último hace falta modificar la plantilla que utiliza la vista. Botón derecho, properties

    /system/modules/es.gobcan.istac.web/templates/plantilla_1col.jsp


Repetir los pasos anteriores pero esta vez creando el fichero **view.html** y utilizando como formatter **view.jsp**

### Configuración del opencms

Para pertitir que el opencms exporte las fuentes como recursor estáticos modifica el fichero `opencms/WEB-INF/config/opencms-importexport.xml` y añade los nuevos sufijos:

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

