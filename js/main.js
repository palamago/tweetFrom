var labelType, useGradients, nativeTextSupport, animate,queryStringList;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
	//I'm setting this based on the fact that ExCanvas provides text support for IE
	//and that as of today iPhone/iPad current text support is lame
	labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
	nativeTextSupport = labelType == 'Native';
	useGradients = nativeCanvasSupport;
	animate = !(iStuff || !nativeCanvasSupport);


	 // get the current URL
	 var url = window.location.toString();
	 //get the parameters
	 url.match(/\?(.+)$/);
	 var params = RegExp.$1;
	 // split up the query string and store in an
	 // associative array
	 var params = params.split("&");
	 queryStringList = {};
	 
	 for(var i=0;i<params.length;i++)
	 {
	 	var tmp = params[i].split("=");
	 	queryStringList[tmp[0]] = unescape(tmp[1]);
	 }

})();

jQuery(document).ready(function(){

	var LOADER = new Loader(),DATA = new Data(),VIZ = new Viz(),username,avatar,data,initialized=false;

 	$("#form").submit(function(e) {
        initLoad();
        e.preventDefault();
        return false;
	});

	$("#generate").on("click", function(event){
		initLoad();
	});

	function initLoad(){
		$('#resultBlock').hide();
		$('#userInfo img').attr('src','');

		username = $('#username').val();
		//loader on
		LOADER.open();
		
		//Listener to retrieve Async info
		$(DATA).on('retrieveInfoComplete',loadComplete);
		DATA.retrieveInfo(username);
	}

	//deep linking
	if(queryStringList['u'] && queryStringList['u']!=''){
		$('#username').val(queryStringList['u']);
		initLoad();
	}

	//load complete callback
	function loadComplete(e){
		$(DATA).off('retrieveInfoComplete',loadComplete);
		avatar = DATA.getAvatarImageUrl(username);
		//Listener to Async data generation
		$(VIZ).on('renderComplete',renderComplete);
		VIZ.render(username,avatar,e.pieData,e.barData);
	}

	//render complete callback
	function renderComplete(){
		$(VIZ).off('renderComplete',renderComplete);
		LOADER.close();
		addTweetButton();
	}

	function getFinalUrl(){
		var url = window.location.toString();
		url=url.split('?');
		url = url[0];
		url += '?u='+$('#username').val();
		return encodeURIComponent(url);
	}

	function addTweetButton(){
		//var tweetButton = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="{URL}" data-text="Check from what devices I\'m using Twitter: " data-via="palamago" data-size="large" data-count="none">Tweet</a>';
		

		var tweetButton = '<iframe allowtransparency="true" frameborder="0" scrolling="no" '+
		'src="https://platform.twitter.com/widgets/tweet_button.html?'+
		'url={URL}&'+
		'count=none&'+
		'lang=en&'+
		'size=l&'+
		'text=Check%20from%20what%20devices%20I\'m%20using%20Twitter&'+
		'via=palamago" '+
		'class="twitter-share-button twitter-count-vertical" '+
		'title="Twitter Tweet Button"></iframe>';


        var exp = new RegExp("{URL}","gi");
        tweetButton = tweetButton.replace(exp,getFinalUrl());

		$('#tweetButtonContainer').html(tweetButton);

	};

});



