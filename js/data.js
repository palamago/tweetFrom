function Data() {
}

Data.prototype = (function() {

    var _sourcesInfo = [],_username = '',_instance,_fromData={},_toBarData={label:["Tweets"],values:[]},_toPieData={label:["Tweets"],values:[]},_cantTweets=0;

    var _reset = function() {
        _sourcesInfo = [];
        _username = '';
        _instance,_fromData={};
        _toBarData={label:["Tweets"],values:[]};
        _toPieData={label:["Tweets"],values:[]};
        _cantTweets = 0;
    };

    var _retrieveTweetsInfo = function() {
        var url = "https://api.twitter.com/1/statuses/user_timeline.json?include_rts=0&include_entities=false&screen_name="+_username+"&count=200&trim_user=true&callback=?";
        $.getJSON(url)
        .success(function(data){
        	_processInfo(data);
        	var event = jQuery.Event("retrieveInfoComplete");
			event.pieData = _toPieData;
            event.barData = _toBarData;
	    	$(_instance).trigger(event);
        })
        .error(function() { alert("error"); });
    };

    var _processInfo = function(data) {
    	var fuente,temp,exp;

        _cantTweets = data.length;

        $('#totalTweets').html(_cantTweets);
        //resume data
    	$.each(data,function(i,e){
    		temp = e.source;

            //resolve name
    		if(temp.indexOf('a>')<0){
    			key = temp;
                if(key=="web"){
                    key="twitter.com";
                }
    		} else {
                key = $(temp).html();
    		}

       		if(_fromData[key]){
    			_fromData[key].cant++;
    		}else{
				_fromData[key]=_getEmptyObj(e.source);    			
    		}
            _fromData[key].link=e.source;
    	});

        //create Jit input
        var cant;
        $.each(_fromData,function(i,e){
			obj={};
			obj.label = i;
			obj.values = [];
            cant = Math.round((e.cant*100)/_cantTweets);
			obj.values.push(cant);
			_toPieData.values.push(obj);
		});

        console.log(_toPieData);

        //order
        _toPieData.values.sort(function(a, b){
            return b.values[0]-a.values[0];
        })

        console.log(_toPieData);

        _toBarData.values[0] = _toPieData.values[1];
        _toBarData.values[1] = _toPieData.values[0];
        _toBarData.values[2] = _toPieData.values[2];

   		return;

    };

    var _getEmptyObj = function(source){
    	var link;
    	if(source=="web"){
    		link="twitter.com";
    	}else{
    		link=source;
    	}
    	return {
       				cant:1,
       				link:link
       			};
    }

    return {

        constructor:Data,

        retrieveInfo: function(username) {
            _reset();
        	_instance = this;
        	_username = username;
        	_retrieveTweetsInfo();
       	},

        getAvatarImageUrl: function(username) {
            return "https://api.twitter.com/1/users/profile_image?screen_name="+username+"&size=original";
        }

    };
})();
