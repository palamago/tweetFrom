function Viz() {
}

Viz.prototype = (function() {

	var _pieChart=undefined;
	var _barChart=undefined;

	var _renderPieChart = function(json) {

	    $('#infovis').html('');
	
	   	//init PieChart
	    _pieChart = new $jit.PieChart({
		  //id of the visualization container
		  injectInto: 'infovis',
		  //whether to add animations
		  animate: true,
		  //offsets
		  offset: 30,
		  sliceOffset: 5,
		  labelOffset: -50,
		  //slice style
		  type: useGradients? 'stacked:gradient' : 'stacked',
		  //whether to show the labels for the slices
		  showLabels:true,
		  //resize labels according to
		  //pie slices values set 7px as
		  //min label size
		  resizeLabels: 10,
		  //label styling
		  Label: {
		    type: labelType, //Native or HTML
		    size: 30,
		    family: 'Arial',
		    color: 'white'
		  },
		  //enable tips
		  Tips: {
		    enable: true,
		    onShow: function(tip, elem) {
		       tip.innerHTML = "<b>" + elem.label + "</b>: " + elem.value + "%";
		    }
		  }
		});
		
		//load JSON data.
		_pieChart.loadJSON(json);
    };

   	var _renderBarChart = function(json) {

        $('#podium').html('');
        
        _barChart = new $jit.BarChart({  
		  //id of the visualization container  
		  injectInto: 'podium',  
		  //whether to add animations  
		  animate: true,  
		  //horizontal or vertical barcharts  
		  orientation: 'vertical',  
		  //bars separation  
		  barsOffset: 10,  
		  //visualization offset  
		  Margin: {  
		    top:5,  
		    left: 5,  
		    right: 5,  
		    bottom:5  
		  },  
		  //labels offset position  
		  labelOffset: 5,  
		  //bars style  
		  type: useGradients? 'stacked:gradient' : 'stacked',  
		  //whether to show the aggregation of the values  
		  showAggregates:false,  
		  //whether to show the labels for the bars  
		  showLabels:true,  
		  //labels style  
		  Label: {  
		    type: labelType, //Native or HTML  
		    size: 20,  
		    family: 'Arial',  
		    color: 'orange'  
		  },  
		  //add tooltips  
		  Tips: {  
		    enable: true,  
		    onShow: function(tip, elem) {  
		       tip.innerHTML = "<b>" + elem.label + "</b>: " + elem.value + "%";
		    }  
		  }  
		});  

		//load JSON data.  
		_barChart.loadJSON(json);  
   	};

	var _reset = function(json) {
		_pieChart = undefined;
		_barChart = undefined;
	};

    return {

        constructor:Viz,

        render:function(tu, avatar, completeJson, podiumJson) {
        	_reset();

			$('.resultBlock').hide();
			$('#userInfo img').attr('src',avatar);
			$('#userInfo .username').html('@'+tu);
			$('.resultBlock').show();
			
			_renderPieChart(completeJson);
			_renderBarChart(podiumJson);

			var event = jQuery.Event("renderComplete");
			$(this).trigger(event);
        }

    };
})();
