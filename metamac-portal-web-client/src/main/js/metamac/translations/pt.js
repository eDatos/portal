I18n.translations || (I18n.translations = {});

I18n.translations.pt = {
	
        number : {
            format : {
                separator : ",", /* Decimal */
                delimiter : " ", /* Thousands */
                strip_insignificant_zeros : false
            }
        },  
        filter : {
            button : {
                edit : "Modificar seleção",
                info : "Informação",
                table : "Tabela de dados",
                canvasTable : "Tabela de dados",
                column : "Gráfico de colunas",
                line : "Gráfico de linhas",
                map : "Mapa",
                mapbubble : "Mapa de símbolos",
                fullscreen : "Ecrã inteiro",
                share : "Partilhar",
                download : "Download",
                accept : "Aceitar",
                cancel : "Cancelar",
                selectAll : "Selecionar tudo",
                deselectAll : "Desselecionar tudo",
                reverseOrder : "Ordem inversa",
                close : "Fechar",
                visualize : "Visualizar",
                embed : "Widget"
            },
            download : {
                selection : "Download da seleção",
                all : "Download de tudo"
            },
            share : {
                permanent : "Ligação permanente:"
            },
            embed : {
                instructions : "Seleciona, copia e cola este código na tua página: "
            },  
            text : {
                fixedDimensions : "Valores fixos",
                leftDimensions : "Linhas",
                topDimensions : "Colunas",
                fixedDimensionX : "Dimensão Fixa",
                horizontalAxis : "Eixo horizontal",
                columns : "Colunas",
                lines : "Linhas",
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
                    title : "Filtro"
                },
                order : {
                    title : "Ordem",
                    info : {
                        fixed : "",
                        left : "",
                        top : ""
                    },
                    canvasTable : {
                        fixed : "Valores fixos",
                        left : "Linhas",
                        top : "Colunas"
                    },
                    column : {
                        fixed : "Valores fixos",
                        left : "Eixo horizontal",
                        top : "Colunas"
                    },
                    line : {
                        fixed : "Valores fixos",
                        left : "Eixo horizontal",
                        top : "Linhas"
                    },
                    map : {
                        fixed : "Valores fixos",
                        left : "Territórios"
                    },
                    mapbubble : {
                        fixed : "Valores fixos",
                        left : "Territórios"
                    }

                },
                help : {
                    title : "Ajuda",
                    body : "<a href='#'>Lorem ipsum dolor</a> sit amet, consectetur adipiscing elit. Ut condimentum accumsan metus, non mollis augue laoreet sit amet. Nulla facilisi. Nunc laoreet dui eget ullamcorper accumsan. Cras eu adipiscing nulla, at commodo est. Mauris tristique diam in quam vestibulum, eget molestie erat semper. Sed ullamcorper quam vitae porta elementum. Ut quam dui, viverra at sem id, viverra aliquet quam. Donec facilisis neque eu ante euismod, nec consectetur elit pharetra. Nunc eget sem a arcu suscipit commodo nec sit amet nulla. Nullam lorem diam, convallis et dui id, convallis sodales nunc. Fusce mi tortor, aliquam id tempus eget, tincidunt porta arcu. Cras tempus, velit at dapibus semper, urna mauris imperdiet erat, sed commodo eros nibh eu nisl. Morbi commodo libero a rhoncus aliquam. Ut hendrerit mauris et odio viverra venenatis."
                }
            }
        },
        ve : {
            map : {
                nomap : "Mapa indisponível"
            },
            mapbubble : {
                nomap : "Mapa indisponível"
            }
        },

        entity : {
            dataset : {  
                statisticalOperation : "Ooperação estatística",
                validFrom : "Válido desde",
                validTo : "Válido até",
                replacesVersion : "Substituir versão",
                isReplacedByVersion : "É sustituído pela versão",
                publishers : "Publicadores",
                contributors: "Contribuidores de publicación",
                mediators: "Mediadores",
                replaces: "Substitui",
                isReplacedBy: "Substituído por",
                rightsHolder: "Titular dos direitos",
                copyrightDate : "Data de copyright",
                license : "Licença",
                nolicense : "Licença indisponível",
                accessRights: "Direitos de acesso",
                subjectAreas : "Áreas",
                formatExtentObservations: "Número de observações",
                dateNextUpdate: "Data da próxima atualização",
                updateFrequency: "Frequência de atualização",
                statisticOfficiality: "Estatísticas Oficiais",
                bibliographicCitation: "Citação bibliográfica",
                
                dimensions : {
                    title : "Dimensões"
                },
        
                language : "Idioma",     

                datasetAttributes : "Atributos ao nível de dataset"

            }
        },
        date : {
            formats : {
                "default" : "%d-%m-%Y",
                "short" : "%d de %B",
                "long" : "%d de %B de %Y"
            },
            day_names : ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
            abbr_day_names: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
            month_names: ["null", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            abbr_month_names: ["null", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            meridian : ["am", "pm"]
            
            
        }
};
