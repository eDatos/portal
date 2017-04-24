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
            info : "Información",
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
            selectAll : "Marcar",
            deselectAll : "Desmarcar",
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
                title : "Filtrar",
                search : "Buscar"
            },
            order : {
                title : "Ordenar",
                info : {
                    fixed : "",
                    left : "",
                    top : ""
                },
                canvasTable : {
                    fixed : "Fijadas",
                    left : "Filas",
                    top : "Columnas"
                },
                column : {
                    fixed : "Fijadas",
                    left : "Eje X",
                    axisy : "Eje Y",
                    top: "Columnas"
                },
                line : {
                    fixed : "Fijadas",
                    left : "Eje X",
                    axisy : "Eje Y",
                    top : "Lineas"
                },
                map : {
                    fixed : "Fijadas",
                    left : "Territorios"
                },
                mapbubble : {
                    fixed : "Fijadas",
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
            title: "Título",
            subtitle: "Subtítulo",
            abstract: "Resumen",
            measureDimensionCoverageConcepts: "Conceptos que forman el cubrimiento de la unidad de medidad",
            statisticalOperation : "Operación estadística",
            validFrom : "Válido desde",
            validTo : "Válido hasta",
            dateStart : "Periodo inicial",
            dateEnd : "Periodo final",
            version : "Número de versión",
            versionRationale : "Motivo del cambio",
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
            formatExtentObservations: "Tamaño de la tabla",
            lastUpdate: "Fecha de la última actualización",
            dateNextUpdate: "Fecha de próxima actualización",
            updateFrequency: "Frecuencia de actualización",
            statisticOfficiality: "Oficialidad estadística",
            bibliographicCitation: "Citación bibliográfica",
            measureConcepts : {
                title: "¿Qué miden los datos?",
                annotations: "Notas generales"
            },
            
            section : {
                validity: "Validez de los datos",
                descriptors: "Descriptores de los datos",
                dimensions: "¿En base a qué se miden los datos?",
                datasetAttributes : "Notas de tabla",
                version: "Version",
                dataUpdates: "Actualización de datos",
                reuse: "Reutilización",
                developers : "Información para desarrolladores"
            },
    
            language : "Idioma",   

            apiDocumentationUrl : "Acceso a la documentación de la API",
            apiUrl : "Acceso al recurso en la API",

            nextVersion : {
                title: "Actualización",
                enum: {
                    NON_SCHEDULED_UPDATE: "Sin actualización programada",
                    NO_UPDATES: "Sin actualizaciones",
                    SCHEDULED_UPDATE: "Actualización programada"
                }                
            }
        },
        observation : {
            measure: {
                title: 'Datos de la observación'
            },
            attributes : {         
                title: 'Notas de la observación',     
                primaryMeasure : 'Atributos a nivel de observación',
                combinatedDimensions: 'Atributos a nivel de dimensión',
            }
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