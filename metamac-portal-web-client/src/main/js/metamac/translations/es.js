I18n.translations || (I18n.translations = {});

I18n.translations.es = {
	
	number : {
		format : {
			separator : ",", /* Decimal */
			delimiter : ".", /* Thousands */
			strip_insignificant_zeros : false
		}
	},
    filter : {
        button : {
            edit : "Cambiar selección",
            table : "Tabla de datos",
            canvasTable : "Tabla de datos",
            column : "Gráfico de columnas",
            line : "Gráfico de líneas",
            map : "Mapa",
            mapbubble : "Mapa de símbolos",
            fullscreen : "Pantalla completa",
            share : "Compartir",
            download : "Descarga",
            accept : "Aceptar",
            cancel : "Cancelar",
            selectAll : "Marcar todo",
            deselectAll : "Desmarcar todo",
            reverseOrder : "Invertir orden",
            close : "Cerrar",
            visualize : "Consultar",
            embed : "Widget"
        },
        download : {
            selection : "Descargar selección",
            all : "Descargar todo"
        },  
        share : {
            permanent : "Enlace permanente:"
        },
        embed : {
            instructions : "Selecciona, copia y pega este código en tu página"
        },
        text : {
            fixedDimensions : "Valores fijados",
            leftDimensions : "Filas",
            topDimensions : "Columnas",
            fixedDimensionX : "Dimensión fija",
            horizontalAxis : "Eje horizontal",
            columns : "Columnas",
            lines : "Lineas",
            sectors : "Sectores",
            map : "Territorios",
            mapbubble : "Territorios",
            "for" : "Para"
        },
        sidebar : {
            info : {
                title: "Info"
            },
            filter : {
                title : "Filtrar"
            },
            order : {
                title : "Ordenar",
                canvasTable : {
                    fixed : "Valores fijados",
                    left : "Filas",
                    top : "Columnas"
                },
                column : {
                    fixed : "Valores fijados",
                    left : "Eje horizontal",
                    top : "Columnas"
                },
                line : {
                    fixed : "Valores fijados",
                    left : "Eje horizontal",
                    top : "Lineas"
                },
                map : {
                    fixed : "Valores fijados",
                    left : "Territorios"
                },
                mapbubble : {
                    fixed : "Valores fijados",
                    left : "Territorios"
                }

            },
            help : {
                title : "Ayuda",
                body : "<a href='#'>Lorem ipsum dolor</a> sit amet, consectetur adipiscing elit. Ut condimentum accumsan metus, non mollis augue laoreet sit amet. Nulla facilisi. Nunc laoreet dui eget ullamcorper accumsan. Cras eu adipiscing nulla, at commodo est. Mauris tristique diam in quam vestibulum, eget molestie erat semper. Sed ullamcorper quam vitae porta elementum. Ut quam dui, viverra at sem id, viverra aliquet quam. Donec facilisis neque eu ante euismod, nec consectetur elit pharetra. Nunc eget sem a arcu suscipit commodo nec sit amet nulla. Nullam lorem diam, convallis et dui id, convallis sodales nunc. Fusce mi tortor, aliquam id tempus eget, tincidunt porta arcu. Cras tempus, velit at dapibus semper, urna mauris imperdiet erat, sed commodo eros nibh eu nisl. Morbi commodo libero a rhoncus aliquam. Ut hendrerit mauris et odio viverra venenatis."
            }
        }
    },
    ve : {
        map : {
            nomap : "Mapa no disponible"
        },
        mapbubble : {
            nomap : "Mapa no disponible"
        }
    },

    entity : {
        dataset : {  
            statisticalOperation : "Operación estadística",
            validFrom : "Válido desde",
            validTo : "Válido hasta",
            replacesVersion : "Reemplaza versión",
            isReplacedByVersion : "Es reemplazado por versión",
            publishers : "Publicadores",
            contributors: "Contribuidores de publicación",
            mediators: "Mediadores",
            replaces: "Reemplaza a",
            isReplacedBy: "Es reemplazado por",
            rightsHolder: "Titular de los derechos",
            copyrightDate : "Fecha de copyright",
            license : "Licencia",
            nolicense : "Licencia no disponible",
            accessRights: "Derechos de acceso",
            subjectAreas : "Áreas",
            formatExtentObservations: "Número de observaciones",
            dateNextUpdate: "Fecha de próxima actualización",
            updateFrequency: "Frecuencia de actualización",
            statisticOfficiality: "Oficialidad estadística",
            bibliographicCitation: "Citación bibliográfica",
            
            dimensions : {
                title : "Dimensiones"
            },
    
            language : "Idioma",   

            datasetAttributes : "Atributos a nivel de dataset"

        }
    },
    date : {
        formats : {
            "default" : "%d/%m/%Y",
            "short" : "%d de %B",
            "long" : "%d de %B de %Y"
        },
        day_names : ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        abbr_day_names : ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        month_names : [null, "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        abbr_month_names : [null, "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        meridian : ["am", "pm"]
        
        
    }

};