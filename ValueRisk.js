function ValueRisk() {
  var that = this;
  this.display = function(element) {
		var MIN_BUBBLE_SIZE = 5;

        var QUARTERS_BACK = 2;
        var NUM_QUARTERS = 12;
        var QUARTERS =  [
            { label: "Q4 2011", start: "2011-10-01", end: "2011-12-31" },
            { label: "Q1 2012", start: "2012-01-01", end: "2012-03-31" },
            { label: "Q2 2012", start: "2012-04-01", end: "2012-06-30" },
            { label: "Q3 2012", start: "2012-07-01", end: "2012-09-30" },
            { label: "Q4 2012", start: "2012-10-01", end: "2012-12-31" }
        ];
        var CCOLORS = [
        	'rgba(204,  0,  0, .6)',
        	'rgba(204,204,  0, .6)',
        	'rgba(  0,204,  0, .6)',
        	'rgba(  0,102,204, .6)',
        	'rgba(102,  0,204, .6)',
        	'rgba( 96, 96, 96, .6)',
        	'rgba(204,102,  0, .6)',
        	'rgba(  0,  0,204, .6)'
        ];

        var rallyDataSource = null;
        var typeDropDown = null;
        var quarterDropDown = null;

        function renderChart(data){
            console.log("Render chart");
            console.log(data);

            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'chart',
                    defaultSeriesType: 'scatter'
                },
                title: { text: 'Portfolio Value vs. Risk' },
                //subtitle: { text: QUARTERS[parseInt(quarterDropDown.getValue())].label },
                xAxis: {
                    minPadding: 0.1,
                    maxPadding: 0.1,
                    min: 0,
                    title: {
                        enabled: true,
                        text: 'Value'
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Risk'
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b><br/>'+
                                'Value: ' + this.x +', Risk: '+ this.y +', Size: ' + this.point.size;
                    }
                },
                legend: {
                    layout: 'vertical',
                    style: {
                        left: '100px',
                        top: '70px',
                        bottom: 'auto'
                    },
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            symbol: 'circle',
                            states: {
                                hover: {
                                    enabled: false
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: true
                                }
                            }
                        }
                    }
                },
                series: data
            });
        }

        function onTypeChange( cb, args ) {
            console.log( args );

            loadData(0, args.item.TypePath);
        }

        function quarterChanged( cb, args ){
            if( typeDropDown && typeDropDown.getValue() ) {
                loadData(args.value, typeDropDown.getValue());
            }
        }

        /**
         * loadData
         * @arg quarter the index in the quarter array. 0 == this current quarter. NOTE: Ignoring now...
         * @arg type ref of the portfolio item type
         */
        function loadData(quarter, type) {
            console.log('loading data....');

            //var qObj = QUARTERS[parseInt(quarter)];
            var queryConfig = {
                key: 'portfolioItems',
                type: type.replace(/\//g, '-'),
                fetch: 'PlannedEndDate,PreliminaryEstimate,InvestmentCategory,ValueScore,RiskScore,Project,Name,FormattedID,Value',
                order: 'InvestmentCategory'
                //query: rally.sdk.util.Query.and([ 'Type = "'+ type + '"', 'PlannedEndDate >= "' + qObj.start + '"', 'PlannedEndDate <= "' + qObj.end + '"'])
            };
            rallyDataSource.findAll(queryConfig, collectResults);
        }

        function getInvestmentCategory(item){
            if(item.InvestmentCategory === null ) {
                return "None";
            }
            return item.InvestmentCategory;
        }

        function collectResults(results) {
            console.log(results);

            var series = [];
            var ccount = 0;
            var currentSeries = { name: null };
            dojo.forEach( results.portfolioItems, function(item) {
                if( getInvestmentCategory(item) != currentSeries.name ) {
                    currentSeries = { name: getInvestmentCategory(item), data: [], color: CCOLORS[ccount++] };
                    series.push(currentSeries);
                }
                var bubbleSize = MIN_BUBBLE_SIZE;
                var sizeText = "Unknown";
                if ( item.PreliminaryEstimate ) {
                    bubbleSize = MIN_BUBBLE_SIZE * item.PreliminaryEstimate.Value;
                    sizeText = item.PreliminaryEstimate.Name;
                }
                currentSeries.data.push( { name: item.FormattedID + ": " + item.Name, x: item.ValueScore, y: item.RiskScore, size: sizeText, marker: { radius: bubbleSize } });
            });

            renderChart( series );
        }

        function onLoad() {
            rallyDataSource = new rally.sdk.data.RallyDataSource(
                    "__WORKSPACE_OID__",
                    "__PROJECT_OID__",
                    "__PROJECT_SCOPING_UP__",
                    "__PROJECT_SCOPING_DOWN__");

            rallyDataSource.setApiVersion("1.37");

            /*
             var quarters = [];
             dojo.forEach(QUARTERS, function( q, i ) {
             quarters.push( { label: q.label, value: i });
             });
             quarterDropDown = new rally.sdk.ui.basic.Dropdown({ label: 'Quarter: ', showLabel: true, items: quarters });
             quarterDropDown.display("quarters", quarterChanged);
             */

            var typeCfg = {
                label:'Type: ',
                showLabel:true,
                type: 'typeDefinition',
                defaultDisplayValue: 'Feature',
                attribute:'Name',
                order:'Ordinal desc',
                fetch:'Ordinal,TypePath',
                query: '((Parent.Name = "Portfolio Item") and (Creatable = true))'
            };
            typeDropDown = new rally.sdk.ui.ObjectDropdown(typeCfg, rallyDataSource);
            typeDropDown.display('type', onTypeChange);
        }

        rally.addOnLoad(onLoad);
  };
}
