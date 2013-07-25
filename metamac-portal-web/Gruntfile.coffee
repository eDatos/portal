module.exports = (grunt) ->
    _ = require('underscore')
    path = require('path')

    grunt.loadTasks 'tasks'
    grunt.loadNpmTasks 'grunt-contrib-less'
    grunt.loadNpmTasks 'grunt-contrib-handlebars'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-open'

    grunt.registerTask('dev', ['less:dev', 'less:map', 'handlebars', 'include:dev'])
    grunt.registerTask('pro', ['less:pro', 'less:map', 'handlebars', 'uglify', 'include:pro'])
    grunt.registerTask('default', 'pro')

    paths = {}
    paths.theme = 'src/main/webapp/WEB-INF/theme'
    paths.less = paths.theme + '/less'
    paths.lib = paths.theme + '/js/libs'
    paths.templates = paths.theme + "/js/stat4you/views"
    paths.js = "src/main/webapp/WEB-INF/theme/js"
    paths.modules = paths.js + "/stat4you/modules"
    paths.assets = "src/main/webapp/WEB-INF/theme/assets"

    modules =
        libs:
            src: [
                paths.lib + "/jquery-1.9.0.js"
                paths.lib + "/tracekit.js"
                paths.lib + "/i18n.js"
                paths.lib + "/underscore.js"
                paths.lib + "/underscore.string.js"
                paths.lib + "/backbone.js"
                paths.lib + "/backbone.marionette.js"
                paths.lib + "/backbone.wreqr.js"
                paths.lib + "/handlebars.runtime.js"
                paths.lib + "/bootstrap.js"
                paths.lib + "/modernizr-2.5.3.js"
                paths.lib + "/moment.js"
                paths.lib + "/cookies.js"
                paths.lib + "/jquery.dotdotdot-1.5.0-packed.js"
                paths.js + "/stat4you/Stat4you.js"
                paths.js + "/stat4you/track.js"
                paths.js + "/stat4you/libs/HandlebarsHelpers.js"
                paths.js + "/stat4you/views/HandlebarsTemplates.js"
                paths.js + "/stat4you/modules/TemplateManager.js"

                # modules always included

                paths.js + "/stat4you/modules/signin/SigninView.js"
            ],
            dest: paths.assets + "/js/libs.js"
        navbar:
            src: [
                paths.js + "/stat4you/modules/navbar/NavbarView.js"
                paths.js + "/stat4you/modules/user/Favourite.js"
                paths.js + "/stat4you/modules/user/Favourites.js"
                paths.js + "/stat4you/modules/user/User.js"
                paths.js + "/stat4you/libs/NavigationSearch.js"
                paths.js + "/stat4you/libs/AjaxForm.js"
            ]
            dest: paths.assets + "/js/navbar.js"
        comments:
            src: [
                paths.js + "/libs/ba-linkify.js"
                paths.modules + "/comments/Comment.js"
                paths.modules + "/comments/Comments.js"
                paths.modules + "/comments/CommentView.js"
                paths.modules + "/comments/CommentsView.js"
                paths.modules + "/comments/CommentsMain.js"
            ]
            dest: paths.assets + "/js/comments.js"
        index:
            src: [
                paths.js + "/stat4you/libs/smartscroll.js"
                paths.js + "/stat4you/mixins/FetchEventsForCollection.js"
                paths.js + "/stat4you/mixins/InfiniteScrollView.js"
                paths.modules + "/search/SearchActiveProvider.js"
                paths.modules + "/search/SearchFacetsCollection.js"
                paths.modules + "/search/SearchQueryModel.js"
                paths.modules + "/search/SearchResultsCollection.js"
                paths.modules + "/search/SearchIndexRouter.js"
                paths.modules + "/search/SearchHeaderView.js"
                paths.modules + "/search/SearchView.js"
                paths.modules + "/search/SearchMain.js"

                paths.js + "/stat4you/mixins/PaginableCollection.js"
                paths.modules + "/datasets/Dataset.js"
                paths.modules + "/datasets/Datasets.js"
                paths.modules + "/datasets/DatasetView.js"
                paths.modules + "/datasets/DatasetsView.js"
                paths.modules + "/index/IndexView.js"
            ]
            dest: paths.assets + "/js/index.js"
        providers:
            src: [
                paths.js + "/stat4you/mixins/PaginableCollection.js"
                paths.modules + "/datasets/Dataset.js"
                paths.modules + "/datasets/Datasets.js"
                paths.modules + "/datasets/DatasetView.js"
                paths.modules + "/datasets/DatasetsView.js"
                paths.modules + "/providers/Provider.js"
                paths.modules + "/providers/Providers.js"
                paths.modules + "/providers/ProvidersView.js"
                paths.modules + "/providers/ProviderDetailView.js"
                paths.modules + "/providers/ProvidersRouter.js"
            ]
            dest: paths.assets + "/js/providers.js"
        search:
            src: [
                paths.js + "/stat4you/libs/smartscroll.js"
                paths.js + "/stat4you/mixins/FetchEventsForCollection.js"
                paths.js + "/stat4you/mixins/InfiniteScrollView.js"
                paths.modules + "/search/SearchActiveProvider.js"
                paths.modules + "/search/SearchFacetsCollection.js"
                paths.modules + "/search/SearchQueryModel.js"
                paths.modules + "/search/SearchResultsCollection.js"
                paths.modules + "/search/SearchRouter.js"
                paths.modules + "/search/SearchHeaderView.js"
                paths.modules + "/search/SearchView.js"
                paths.modules + "/search/SearchMain.js"
            ]
            dest: paths.assets + "/js/search.js"
        profile:
            src: [
                paths.js + "/libs/Backbone.ModelBinder.js"
                paths.js + "/stat4you/mixins/PaginableCollection.js"
                paths.modules + "/datasets/Dataset.js"
                paths.modules + "/datasets/Datasets.js"
                paths.modules + "/datasets/DatasetView.js"
                paths.modules + "/datasets/DatasetsView.js"
                paths.modules + "/profile/ProfileFavouritesView.js"
                paths.modules + "/profile/ProfileReadView.js"
                paths.modules + "/profile/ProfileUpdateView.js"
                paths.modules + "/profile/ProfileRouter.js"
            ]
            dest: paths.assets + "/js/profile.js"
        dataset:
            src: [
                #libs
                paths.js + "/libs/isOverflowed.js"
                paths.js + "/libs/jquery.json-2.3.min.js"
                paths.js + "/libs/jquery-disable-text-selection-1.0.0.js"
                paths.js + "/libs/css_browser_selector.js"
                paths.js + "/libs/spin-min-1.2.5.js"
                paths.js + "/libs/highcharts.js"
                paths.js + "/libs/d3.v2.js"
                paths.js + "/libs/jquery.mousewheel.js"
                paths.js + "/libs/jquery.jscrollpane.js"
                paths.js + "/libs/jquery.ba-resize.js"

                # svg
                paths.js + "/stat4you/modules/svg/Exporter.js"
                paths.js + "/stat4you/modules/svg/SVGNode.js"

                # DATASET MODULE
                paths.modules + "/dataset/DatasetPermalink.js"
                paths.modules + "/dataset/PermalinkBuilder.js"
                paths.modules + "/dataset/DatasetActionsView.js"
                paths.modules + "/dataset/DatasetExportView.js"
                paths.modules + "/dataset/dataset-main.js"
                paths.modules + "/dataset/dataset-options-model.js"
                paths.modules + "/dataset/dataset-options-view.js"
                paths.modules + "/dataset/dataset-page-view.js"
                paths.modules + "/dataset/DatasetWidgetPageView.js"
                paths.modules + "/dataset/DatasetInfoView.js"
                paths.modules + "/dataset/DatasetVisualizationView.js"
                paths.modules + "/dataset/dataset-router.js"

                # data
                paths.js + "/stat4you/modules/dataset/model/data/ApiResponse.js"
                paths.js + "/stat4you/modules/dataset/model/data/ApiRequest.js"
                paths.js + "/stat4you/modules/dataset/model/data/NumberFormatter.js"
                paths.js + "/stat4you/modules/dataset/model/data/BigDataCacheBlock.js"
                paths.js + "/stat4you/modules/dataset/model/data/BigDataCache.js"
                paths.js + "/stat4you/modules/dataset/model/data/BigData.js"
                paths.js + "/stat4you/modules/dataset/model/data/Data.js"
                paths.js + "/stat4you/modules/dataset/model/Dataset.js"
                paths.js + "/stat4you/modules/dataset/model/Metadata.js"

                # components
                paths.js + "/stat4you/components/tooltip/Tooltip.js"
                paths.js + "/stat4you/components/sidebar/SidebarStateModel.js"
                paths.js + "/stat4you/components/sidebar/SidebarView.js"
                paths.js + "/stat4you/components/searchbar/SearchbarView.js"
                paths.js + "/stat4you/components/accordion/AccordionView.js"
                paths.js + "/stat4you/components/accordion/AccordionItemView.js"

                # filters
                paths.js + "/stat4you/modules/dataset/filter/FilterOptionsDimensionRestriction.js"
                paths.js + "/stat4you/modules/dataset/filter/FilterOptionsTable.js"
                paths.js + "/stat4you/modules/dataset/filter/FilterOptions.js"

                paths.js + "/stat4you/modules/dataset/filter/popup/Filter-dimension-view.js"
                paths.js + "/stat4you/modules/dataset/filter/popup/Filter-view.js"

                paths.js + "/stat4you/modules/dataset/filter/sidebar/FilterSidebarDimensionStateModel.js"
                paths.js + "/stat4you/modules/dataset/filter/sidebar/FilterSidebarCategoryView.js"
                paths.js + "/stat4you/modules/dataset/filter/sidebar/FilterSidebarDimensionView.js"
                paths.js + "/stat4you/modules/dataset/filter/sidebar/FilterSidebarView.js"
                paths.js + "/stat4you/modules/dataset/filter/sidebar/OrderSidebarView.js"


                # visual elements
                #paths.js + "/stat4you/libs/jquery-ui-dataset-table-2.1.0.js"
                paths.js + "/stat4you/modules/dataset/visual-element/Base.js"
                #paths.js + "/stat4you/modules/dataset/visual-element/Table.js"
                paths.js + "/stat4you/modules/dataset/visual-element/Column.js"
                paths.js + "/stat4you/modules/dataset/visual-element/Line.js"
                paths.js + "/stat4you/modules/dataset/visual-element/Pie.js"
                paths.js + "/stat4you/modules/dataset/visual-element/CanvasTable.js"
                paths.js + "/stat4you/modules/dataset/visual-element/line/DetailZoomModel.js"
                paths.js + "/stat4you/modules/dataset/visual-element/line/DetailZoomView.js"
                paths.js + "/stat4you/modules/dataset/visual-element/Map.js"

                # canvas table
                paths.js + "/libs/lru.js"
                paths.js + "/libs/jquery.hotkeys.js"
                paths.js + "/libs/key_status.js"
                paths.js + "/libs/jquery.ajaxmanager.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/Utils.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/primitives/Point.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/primitives/Cell.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/primitives/Size.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/primitives/Rectangle.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/DataSourceDataset.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/Delegate.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/zones/Zone.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/zones/BodyZone.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/zones/RightScrollZone.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/zones/BottomScrollZone.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/zones/LeftHeaderZone.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/zones/TopHeaderZone.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/zones/SpinnerZone.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/View.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/ScrollManager.js"
                paths.js + "/stat4you/modules/dataset/visual-element/table/KeyboardManager.js"

                # map
                paths.js + "/stat4you/modules/dataset/visual-element/map/MapTooltipDelegate.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/GeoJsonConverter.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/MapContainerView.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/MapView.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/ZoomView.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/LegendView.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/CreditsView.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/RangesView.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/MapModel.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/ShapesApi.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/ShapesStore.js"
                paths.js + "/stat4you/modules/dataset/visual-element/map/Shapes.js"

                # Utils
                paths.js + "/stat4you/modules/dataset/utils/VisualElementManager.js"
                paths.js + "/stat4you/modules/dataset/utils/FullScreen.js"
            ]
            dest: paths.assets + "/js/dataset.js"
        admin:
            src: [
                paths.js + "/libs/Backbone.ModelBinder.js"
                paths.js + "/stat4you/mixins/PaginableCollection.js"
                paths.js + "/stat4you/mixins/SelectableCollection.js"
                paths.modules + "/datasets/Dataset.js"
                paths.modules + "/datasets/Datasets.js"

                paths.modules + "/admin/remove/DatasetSelectionCollection.js"
                paths.modules + "/admin/remove/RemoveDatasetsTableRowView.js"
                paths.modules + "/admin/remove/RemoveDatasetsTableView.js"
                paths.modules + "/admin/remove/RemoveStateModel.js"
                paths.modules + "/admin/remove/RemoveView.js"
                paths.modules + "/admin/remove/RemoveRouter.js"

                paths.modules + "/admin/status/StatusModel.js"
                paths.modules + "/admin/status/StatusCollection.js"
                paths.modules + "/admin/status/StatusView.js"
            ]
            dest: paths.assets + "/js/admin.js"


    includeConfig =
        modules: modules
        dest: 'src/main/webapp/WEB-INF/views/includes'
        pathToRemove: 'src/main/webapp/WEB-INF/theme'
        pathToAdd: '${contextPath}/theme/${applicationVersion}/'

    handlebarsTemplateNameProcesor = (srcFile) ->
        rootRelative = srcFile.substring(paths.templates.length + 1)
        ext = path.extname(rootRelative)
        dir = path.dirname(rootRelative)
        baseName = path.basename(rootRelative, ext)
        dir + "/" + baseName

    uglifyOptions =
        options:
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'

    config =
        pkg: grunt.file.readJSON('package.json')

        less:
            dev:
                src: paths.less + '/bootstrap.less'
                dest: paths.assets + '/css/main.css'
            pro:
                src: paths.less + '/bootstrap.less'
                dest: paths.assets + '/css/main.css'
                options:
                    yuicompress: true
            map:
                src : paths.less + "/dataset/maps-export.less"
                dest: paths.assets + '/css/map.css'
                options:
                    yuicompress: true

        handlebars:
            compile:
                options:
                    namespace: "Handlebars.templates"
                    wrapped: true
                    processName: handlebarsTemplateNameProcesor

                src: paths.templates + "/**/*.html"
                dest: paths.templates + "/HandlebarsTemplates.js"

        watch:
            less:
                files: paths.less + '/**/*.less'
                tasks: ['less:dev', 'less:map']

            handlebars:
                files: paths.templates + "/**/*.html"
                tasks: 'handlebars'

            include:
                files: 'Gruntfile.js'
                tasks: 'include:dev'

        uglify: _.extend(modules, uglifyOptions)

        include:
            dev: _.extend({dev: true}, includeConfig),
            pro: _.extend({dev: false}, includeConfig)

        connect:
            options:
                port: 9000
                hostname: 'localhost'
            test: {}

        open:
            test:
                path: 'http://localhost:<%= connect.options.port %>/src/test/javascript/runner/runner.html'


    grunt.registerTask('bdd', [
        'connect:test'
        'open:test'
        'watch'
    ])

    grunt.initConfig(config)
