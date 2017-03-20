I18n.translations || (I18n.translations = {});

I18n.translations.en = {

    number : {
		format : {
			separator : ".", /* Decimal */
			delimiter : ",", /* Thousands */
			strip_insignificant_zeros : false
		}
	},	
    filter : {
        button : {
            edit : "Change selection",
            info : "Info",
            table : "Datatable",
            canvasTable : "Datatable",
            column : "Columns chart",
            line : "Lines chart",
            map : "Map",
            mapbubble : "Bubble map",
            fullscreen : "Fullscreen",
            share : "Share",
            download : "Download",
            accept : "Accept",
            cancel : "Cancel",
            selectAll : "Select all",
            deselectAll : "Deselect all",
            reverseOrder : "Reverse order",
            close : "Close",
            visualize : "Visualize",
            embed : "Widget"
        },
        download : {
        	selection : "Download selection",
    	    all : "Download All"
	    },
        share : {
            permanent : "Permanent link:"
        },
        embed : {
            instructions : "Select, copy and paste this code on your page:"
        },	
        text : {
            fixedDimensions : "Fixed values",
            leftDimensions : "Rows",
            topDimensions : "Columns",
            fixedDimensionX : "Fixed dimension",
            horizontalAxis : "Horizontal axis",
            columns : "Columns",
            lines : "Lines",
            sectors : "Sectors",
            map : "Territories",
            mapbubble : "Territories",
            "for" : "For"
        },
        sidebar : {            
            info : {
                title: "Info"
            },
            filter : {
                title : "Filter"
            },
            order : {
                title : "Sort",
                info : {
                    fixed : "",
                    left : "",
                    top : ""
                },
                canvasTable : {
                    fixed : "Fixed values",
                    left : "Rows",
                    top : "Columns"
                },
                column : {
                    fixed : "Fixed values",
                    left : "X axis",
                    top : "Y axis"
                },
                line : {
                    fixed : "Fixed values",
                    left : "X axis",
                    axisy : "Y axis",
                    top : "Lines"
                },
                map : {
                    fixed : "Fixed values",
                    left : "Territories"
                },
                mapbubble : {
                    fixed : "Fixed values",
                    left : "Territories"
                }

            },
            help : {
        		title : "Help",
        		body : "<a href='#'>Lorem ipsum dolor</a> sit amet, consectetur adipiscing elit. Ut condimentum accumsan metus, non mollis augue laoreet sit amet. Nulla facilisi. Nunc laoreet dui eget ullamcorper accumsan. Cras eu adipiscing nulla, at commodo est. Mauris tristique diam in quam vestibulum, eget molestie erat semper. Sed ullamcorper quam vitae porta elementum. Ut quam dui, viverra at sem id, viverra aliquet quam. Donec facilisis neque eu ante euismod, nec consectetur elit pharetra. Nunc eget sem a arcu suscipit commodo nec sit amet nulla. Nullam lorem diam, convallis et dui id, convallis sodales nunc. Fusce mi tortor, aliquam id tempus eget, tincidunt porta arcu. Cras tempus, velit at dapibus semper, urna mauris imperdiet erat, sed commodo eros nibh eu nisl. Morbi commodo libero a rhoncus aliquam. Ut hendrerit mauris et odio viverra venenatis."
        	}
        }
    },
    ve : {
        map : {
            nomap : "No map available"
        },
        mapbubble : {
            nomap : "No map available"
        }
    },

    entity : {
        dataset : {  
            measureDimensionCoverageConcepts: "Measure dimension coverage concepts",
        	statisticalOperation : "Statistical operation",
            validFrom : "Valid from",
            validTo : "Valido to",
            replacesVersion : "Replaces version",
            isReplacedByVersion : "Is replaced by version",
            publishers : "Publishers",
            contributors: "Contributors",
            mediators: "Mediators",
            replaces: "Replaces",
            isReplacedBy: "Is replaced by",
            rightsHolder: "Rights holder",
            copyrightDate : "Copyright date",
            license : "License",
            nolicense : "License no available",
            accessRights: "Access rights",
            subjectAreas : "Subject areas",
            formatExtentObservations: "Number of observations",
            lastUpdate: "Last update date",
            dateNextUpdate: "Next update date",
            updateFrequency: "Update frequency",
            statisticOfficiality: "Statistic officiality",
            bibliographicCitation: "Bibliographic citation",            
            
            dimensions : {
                title : "Dimensions"
            },
    
    		language : "Language",     

            datasetAttributes : "Dataset level attributes",
            apiUrl : "API access for developers"
        }
    },
    date : {
        formats : {
        	"default" : "%Y-%m-%d",
            "short" : "%b %d",
            "long" : "%B %d, %Y"
        },
        day_names : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        abbr_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        month_names: ["null", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        abbr_month_names: ["null", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        meridian : ["am", "pm"]
        
        
    }

};
