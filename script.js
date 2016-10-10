$(document).ready(function(){

	var _W = 1024
	var _H = 768

	// landscape
	// easing lib

	jQuery.easing.def = "easeInOutQuad";

	var mapMarginDefault = 55
	//var leftFlagWidth = $("#mapDiv .leftFlag").width()-30
	var leftFlagWidth = 130

	var durchsatzBsp = "2.500 kg/h"
	var produktionsmengeBsp = "40 t"
	var produktuntergruppeBsp = "PA 1234"
	//var heute = new Date()
	var didShowWarning = false
	var showingTable = false
	var dayView = false
	var graphView = false
	var isAtPage = 0
	var infoNumber = 0
	var todayTabNumber = 0
	var onInfoPage = 0

	var newsListe = ["Schöne Anlage, <b>@coperion</b>",
		"hdf <b>#coperion</b> euer stand ist so klasse",
		// "<b>#coperion</b> ich werde meine drei Erstgeborenen nach euch benennen.",
		// "Doperion <b>@coperion</b>",
		// "I can’t <b>#coperion</b> with dat awesumness",
		"<i>Raw Oil: <b>$&thinsp;48,97<b></i> <span style = 'color: #29cc29'>▼</span>"
	]

	var tage = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	var monate = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	//var materialListe = ["Stickstoff", "Kindertränen", "Diamant", "Knete", "Milka", "Müllermilch", "Atommüll", "Sternenstaub", "Rinderfilet", "Argon", "Süßstoff"]
	var thstndrd = "th"
	if (heute.getDate() == 1 || heute.getDate() == 11 || heute.getDate() == 21 || heute.getDate() == 31) {
		thstndrd = "st"
	} else if (heute.getDate() == 2 || heute.getDate() == 12 || heute.getDate() == 22) {
		thstndrd = "nd"
	} else if (heute.getDate() == 3 || heute.getDate() == 13 || heute.getDate() == 23) {
		thstndrd = "rd"
	} 
	$("#header h2").html(tage[heute.getDay()] + " " + monate[heute.getMonth()] + " " + heute.getDate() + " | " + heute.getHours() + ":" + heute.getMinutes())

	function loadHome(){

		$("body").removeClass("hideNav");
		$("#mapDiv").removeClass("blur blurwhite");

		console.log("go home");
		onInfoPage = 0

		$("#mapDiv .mapInfo").each(function(index, value) {
			var soManyEntries = parseInt($(this).children("ul").children("li").length)
			$(this).children(".line").css({"height": soManyEntries*15+34+"px"})
			if ($(this).css("opacity") < 0.1 ){
				$(this).stop(true).css({"opacity": "0"})
				// place information
				if ($(this).css("text-align") == "right"){
					$(this).css(
					// {	"margin-left": -leftFlagWidth+parseInt(($(this).attr("data-x")))+"px",
						{"right": _W-parseInt(($(this).attr("data-x")))+"px",
						"margin-top": 10+parseInt(($(this).attr("data-y")))+"px",
						"height": soManyEntries*15+45+"px",
					});
				} else {
					$(this).css(
					{	"margin-left": $(this).attr("data-x")+"px",
						"margin-top": 10+parseInt(($(this).attr("data-y")))+"px",
						"height": soManyEntries*15+45+"px",
					});
				}

				// start animate information
				$(this).stop(true).delay(300+index*100).animate({"opacity": 1, "margin-top": $(this).attr("data-y")+"px", "height": parseInt($(this).height())+10+ "px"}, 600, "easeInOutBack");

				$(".attentionIcnContainer").remove()
				didShowWarning = false
			}
		});

		// start animate map
		$("#mapDiv #map").stop(true).delay(50).animate({"width": "100%", "margin-left": "0%", "margin-top": mapMarginDefault+"px", "opacity": 1}, duration = 900, "easeInOutQuart")

		// disable popup
		$("#popup").stop(true).animate({"opacity": 0}, duration = 500)
		$("#popup").css({"pointer-events" : "none"})
		hideExtended()

		// zeug einblenden
		$("#toggle").css({"pointer-events": "auto"}).animate({"opacity": 1})
		$("#toggleText").animate({"opacity": 1})
		$("#btns").css({"pointer-events": "auto"}).animate({"opacity": 1})
		$(".night").delay(300).animate({"opacity": 0.25})			
	}

	loadHome()

	// tag / woche umschalten
	function switchDayWeek(){
		var noneListPopup = 0
		if (showingTable == true && isAtPage == 0){
			noneListPopup = 1
		} else if ($("#popup").css("opacity") > 0.5){
			noneListPopup = 2
		}

		console.log(noneListPopup)

		if (noneListPopup != 0){
			if (dayView == true) {
				dayView = false
				if (noneListPopup == 1) {
					$("#btns2").children("li:first").removeClass("active")
					$("#btns2").children("li:last").addClass("active")
				} else {
					$("#btns3").children("p:last").children("img").attr({"src": "img/radio_off.png"})
					$("#btns3").children("p:first").children("img").attr({"src": "img/radio_on.png"})
				}
				
			} else {
				dayView = true
				if (noneListPopup == 1) {
					$("#btns2").children("li:first").addClass("active")
					$("#btns2").children("li:last").removeClass("active")
				} else {
					$("#btns3").children("p:last").children("img").attr({"src": "img/radio_on.png"})
					$("#btns3").children("p:first").children("img").attr({"src": "img/radio_off.png"})
				}
			}

			if (noneListPopup == 1){
				$(".columnShort").children("ul:gt(0)").children("li").each(animateBars)
			} else {
				$(".infoMaterials").children("div:eq(1)").children("ul:eq(0)").children("li").each(animateBars)
			}

			function animateBars(){
				if ($(this).children(".empty")){
					var x = $(this).parent().index(".columnShort ul")
					var y = $(this).index()

					if (noneListPopup == 2){
						x = $(this).index()+1
						y = infoNumber*2+1
					}

					var sumLinesTogether = [1,2]
					if (y == 3){
						sumLinesTogether = [4,5]
					} else if (y == 5){
						sumLinesTogether = [7,8,9]
					} else if (y == 7){
						sumLinesTogether = [11]
					} else if (y == 9){
						sumLinesTogether = [13,14,15,16]
					}
					
					var needed = 0
					for (i = 0; i < sumLinesTogether.length; i++){
						if (dayView == true){
							needed = needed + productionNeedDay[sumLinesTogether[i]][x-1]
						} else{
							needed = needed + productionNeedWeek[sumLinesTogether[i]][x-1]
						}
					}
					needed = Math.floor(parseInt(needed*0.01)*100)

					var stock = parseFloat($(this).children(".empty").children(".emptyNumber").html()) + 0.1*parseInt($(this).children(".empty").children(".emptyNumber").children("comma").html())
					
					//var scaleFactor = 100/(500000/stock+99)
					//$(this).html(needed + " " + scaleFactor)
					$(this).children(".empty").children(".full").children(".used").children("p").html(makeNumberSexy(needed/1000))
					if (dayView == true){
						var delta = parseInt($(this).children(".empty").children(".full").css("margin-right"))
						var duration = 1100-needed/stock
						if (duration < 500){
							duration = 500
						}

						$(this).children(".empty").children(".full").children(".used").animate({"width": (needed/10)/stock+"%"}, duration = duration, "easeInOutQuart")
						$(this).children(".empty").children(".full").children(".used.bgRed").removeClass("active")
						$(this).children(".empty").children(".full").children(".used.bgRed").parent().siblings(".emptyNumber").animate({"margin-left": -delta+"px"}, duration = duration)
					} else {
						var duration = needed/stock
						if (duration > 1000){
							duration = 1000
						}

						$(this).children(".empty").children(".full").children(".used").animate({"width": (needed/10)/stock+"%"}, duration = duration, "easeInOutQuart")
						$(this).children(".empty").children(".full").children(".used.bgRed").addClass("active")
						$(this).children(".empty").children(".full").children(".used.bgRed").parent().siblings(".emptyNumber").delay(duration-900).animate({"margin-left": "0px"})
					}
				}
			}
		}
	}
	$("#btns2").children("li").on("click", switchDayWeek)
	$("#btns3").children("p").on("click", switchDayWeek)


	function switchTableGraph(){
		if (graphView == true){
			graphView = false
			$(".graphImg").hide()
			$("#btns4").children("li:first").addClass("active")
			$("#btns4").children("li:last").removeClass("active")
			$("#infoNames").show().siblings("p").show()
			$("#valTab").show()
			$("#graphBtns").hide()
			$("#graphBtns").children("p").removeClass("active").hide()
			$("#graphBtns").children("p:first").addClass("active")

		} else {
			$(".mapInfo").eq(infoNumber).children(".information").children("li").each(function(i,v){
				$("#graphBtns").children("p").eq(i).show()
				$(".graphImg").eq(i+1).attr({"src": "img/g_" + infoNumber + "_" + i + ".png"})
			})
			graphView = true
			$(".graphImg:eq(0)").show()
			$(".graphImg:eq(1)").show()
			$("#btns4").children("li:first").removeClass("active")
			$("#btns4").children("li:last").addClass("active")
			$("#infoNames").hide().siblings("p").hide()
			$("#valTab").hide()
			$("#graphBtns").show()
		}
	}
	$("#btns4").children("li").on("click", switchTableGraph)

	function toggleLineGraph(){
		var number = $(this).index()
		console.log(number)
		if ($(this).hasClass("active")){
			$(this).removeClass("active")
			$(".graphImg:eq(" + (number+1) + ")").hide()
		} else {
			$(this).addClass("active")
			$(".graphImg:eq(" + (number+1) + ")").show()
		}
	}
	$("#graphBtns").children("p").on("click", toggleLineGraph)

	// nummer hinter komma klein schreiben
	function makeNumberSexy(number){
		var beforeComma = Math.floor(number)
		var afterComma = parseInt((number - beforeComma)*10)

		return (beforeComma + ".<comma>" + afterComma + "</comma>")
	}


	// click on information
	function clickInfo(){


		if ($(this).css("opacity") > 0.9 && $("#warningPopup").css("opacity") < 0.1){

			$("#mapDiv").addClass("blur blurwhite");
			$("body").addClass("hideNav");
			//console.log($(this).attr("data-infoId"))

			var x = parseFloat($(this).attr("data-x"))
			var y = parseFloat($(this).attr("data-y"))
			var marginX = _W/2-2*x
			var marginY = _H/2-2*y-2*mapMarginDefault
			infoNumber = $(this).index(".mapInfo")

			if ( window.sendSpacebrewMessage ) {
				window.sendSpacebrewMessage( 'plantActivated', {
					plantIndex: parseInt( infoNumber, 10 ),
					plantName: $(this).find( 'h2' ).text(),
					plantId: $(this).attr( 'data-plant-id' )
				} );
			}

			// map an neue Stelle schieben
			$("#mapDiv #map").stop(true).animate({"width": "200%", "margin-left": marginX+"px", "margin-top": marginY+"px", "opacity": 1}, duration = 700)
			$(".night").delay(100).animate({"opacity": 0})

			// mapInfos an neue Stelle schieben und ausblenden
			$("#mapDiv .mapInfo").each(function(index, value) {
				if ($(this).css("text-align") == "right"){
					$(this).stop(true).animate({"opacity": 0, 
					"right": _W/2+20 +2*(x-parseFloat($(this).attr("data-x")))+"px",
					"margin-top": _H/2 -2*(y-parseFloat($(this).attr("data-y"))) -2*mapMarginDefault + "px"
					}, duration = 700)
				} else {
					$(this).stop(true).animate({"opacity": 0, 
					"margin-left": _W/2 -2*(x-parseFloat($(this).attr("data-x")))+"px",
					"margin-top": _H/2 -2*(y-parseFloat($(this).attr("data-y"))) -2*mapMarginDefault + "px"
					}, duration = 700)
				}
			});

			$("#popup").stop(true).animate({"opacity": 1}, {duration: 500, queue: false})
			$("#popup").css({"pointer-events" : "auto"})
			$("#popup").css({"background-position" : "-210px -60px", "background-size": "1024px"})
			$("#popup").animate({"background-size": "2048px", "background-position-x" : (-x*2+322) + "px", "background-position-y": (-y*2+85+mapMarginDefault) + "px"}, {duration: 700, queue: false})

			// im popup informationen anpassen
			$("#popup h2").html($(this).children("h2").html() + " <time>" + $(this).children("h3").html() + "</time>")
			//$("#graphImg").attr({"src": "img/graph_" + infoNumber + ".png"})
	
			// auf produktions-tab resetten
			$("#popup h3").removeClass("activebtn")
			$("#popup .preselected").addClass("activebtn")
			$("#popup .preselected").siblings().css({"background-color": "#e8ebef"})
			// soundso viele tabs für die linien machen
			$("#valTab").children().remove()
			$(".scrollableY2").children().remove()
			$(this).children(".information").children().each(function(i,v){

				// an liste daten anhängen
				$("#valTab").append("<div><li class = 'bold'>"+ $(this).children("b").html()+"<dot>•</dot></li><ul></ul><div>")
				if ($(this).children("dot").hasClass("red")){
					$("#valTab dot:eq("+i+")").addClass("red")
				}
			})

			clickOnBtn(4);

			// zeug ausblenden
			$("#toggle").css({"pointer-events": "none"}).animate({"opacity": 0})
			$("#toggleText").animate({"opacity": 0})
			$("#btns").css({"pointer-events": "none"}).animate({"opacity": 0})

		} else {
			loadHome()
		}
	}
	$("#mapDiv .mapInfo").on("click", clickInfo)


	// click on map: load home
	function goHomeMaybe(){
		if ($("#map:animated").width() == null){
			loadHome()
		}
	}
	$("#closeBtn").on("touchstart", function(){
		$(this).css({"opacity": 0.5})
	})
	$("#closeBtn").on("click", function(){
		$(this).css({"opacity": 0.3})
		goHomeMaybe()
	})
	$("#mapDiv #background").on("click", goHomeMaybe)


	// click on toggle
	function toggleViews(){

		if ($(this).index() == 4){

			if (showingTable == false){ 

				$("#mapDiv").removeClass("blur");
				$("#tableTabs h4.active").removeClass("active");

				//$(this).attr({"src": "img/list_filled_fafafa.png"})
				//$("#toggleText").html("Liste")
				showingTable = false
				// $("#tableTabs h4").animate({"bottom": "0px"})
				$("#closeBtn2").animate({"opacity":0})
				$("#techLegend").animate({"opacity":0})
				$("#btns2").animate({"opacity": 0})

				$("body").css({"overflow": "hidden"})
				$("#technical").stop(true).animate({"margin-top" : "780px"}, 400, function(){
					$(this).css({"pointer-events": "none", "display": "none"})
					$("body").css({"overflow": "visible"})
				})

				$(this).addClass("active");
				showingTable = true

				showWarningCoperion()

			} else {

				if ($(this).is( ".active" ) == false) {

					$("#mapDiv").removeClass("blur");
					$("#tableTabs h4.active").removeClass("active");
					showingTable = false
					$("#closeBtn2").animate({"opacity":0})
					$("#techLegend").animate({"opacity":0})
					$("#btns2").animate({"opacity": 0})

					$("body").css({"overflow": "hidden"})
					$("#technical").stop(true).animate({"margin-top" : "780px"}, 400, function(){
						$(this).css({"pointer-events": "none", "display": "none"})
						$("body").css({"overflow": "visible"})
					})

					// Open New
					$(this).addClass("active");
					showingTable = true
					$(this).addClass("active");
					showWarningCoperion()

				} else {

					ms_timeout = setTimeout( function () {
						$('#marketing-sales').removeClass( 'is-active' );
					}, 100 );

					$("#tableTabs h4.active").removeClass("active");
					showingTable = false;

					$("#mapDiv").removeClass("blur");

				}

				
			}

		} else {

			ms_timeout = setTimeout( function () {
				$('#marketing-sales').removeClass( 'is-active' );
			}, 100 );

			hideExtended();
			$("#mapDiv").removeClass("blur");

			// console.log($(this).index())

			//if ($(this).attr("src") == "img/list_filled_fafafa.png"){
			if (showingTable == false){

				if ($(this).index() == 0){
					$("#btns2").animate({"opacity": 1})
				}

				$("#mapDiv").addClass("blur");

				$(this).addClass("active");

				showingTable = true
				buildTable($(this).index())
				// $(this).siblings().animate({"bottom": "-40px"})
				$("#closeBtn2").animate({"opacity": 0.3})
				$("#techLegend").animate({"opacity": 1})
				dayView = false
				$("#btns2").children("li:first").removeClass("active")
				$("#btns2").children("li:last").addClass("active")

				//$(this).attr({"src": "img/world_filled_blau.png"})
				//$("#toggleText").html("Karte")
				$("#technical").stop(true).css({"pointer-events": "auto", "margin-top": "780 px", "display": "block"}).animate({"margin-top" : "75px"}, 400)

			} else {
		
				if ($(this).is( ".active" ) == false && $(this).attr("id") != "closeBtn2") {

					$("#tableTabs h4.active").removeClass("active");
					$("#mapDiv").addClass("blur");

					//$(this).attr({"src": "img/list_filled_fafafa.png"})
					//$("#toggleText").html("Liste")
					showingTable = false
					// $("#tableTabs h4").animate({"bottom": "0px"})
					$("#closeBtn2").animate({"opacity":0})
					$("#techLegend").animate({"opacity":0})
					$("#btns2").animate({"opacity": 0})

					$("body").css({"overflow": "hidden"})
					$("#technical").stop(true).animate({"margin-top" : "780px"}, 400, function(){
						$(this).css({"pointer-events": "none", "display": "none"})
						$("body").css({"overflow": "visible"})
					})

					// Open New
					$(this).addClass("active");

					if ($(this).index() == 0){
						$("#btns2").animate({"opacity": 1})
					}

					showingTable = true
					buildTable($(this).index())
					// $(this).siblings().animate({"bottom": "-40px"})
					$("#closeBtn2").animate({"opacity": 0.3})
					$("#techLegend").animate({"opacity": 1})
					dayView = false
					$("#btns2").children("li:first").children("img").attr({"src": "img/radio_off.png"})
					$("#btns2").children("li:last").children("img").attr({"src": "img/radio_on.png"})

					//$(this).attr({"src": "img/world_filled_blau.png"})
					//$("#toggleText").html("Karte")
					$("#technical").stop(true).css({"pointer-events": "auto", "margin-top": "780 px", "display": "block"}).animate({"margin-top" : "75px"}, 400)

				} else {

					$("#mapDiv").removeClass("blur");

					$("#tableTabs h4.active").removeClass("active");

					//$(this).attr({"src": "img/list_filled_fafafa.png"})
					//$("#toggleText").html("Liste")
					showingTable = false
					// $("#tableTabs h4").animate({"bottom": "0px"})
					$("#closeBtn2").animate({"opacity":0})
					$("#techLegend").animate({"opacity":0})
					$("#btns2").animate({"opacity": 0})

					$("body").css({"overflow": "hidden"})
					$("#technical").stop(true).animate({"margin-top" : "780px"}, 400, function(){
						$(this).css({"pointer-events": "none", "display": "none"})
						$("body").css({"overflow": "visible"})
					})

				}



			}
		}
	}
	//$("#toggle").on("touchend", toggleViews)

	$("#closeBtn2").on("touchstart, click", function(){
		$(this).css({"opacity": 0.5})
		// toggleViews();


		$("#tableTabs h4.active").removeClass("active");
		showingTable = false;
		$("#closeBtn2").animate({"opacity":0});
		$("#techLegend").animate({"opacity":0});
		$("#btns2").animate({"opacity": 0});
		$("body").css({"overflow": "hidden"});
		$("#technical").stop(true).animate({"margin-top" : "780px"}, 400, function(){
			$(this).css({"pointer-events": "none", "display": "none"})
			$("body").css({"overflow": "visible"})
			$("#mapDiv").removeClass("blur");
		})

	})
	// $("#closeBtn2").on("click", function(){
	// 	$(this).css({"opacity": 0.3})
	// 	$("#mapDiv").removeClass("blur");
	// 	toggleViews()
	// })

	// table tabs
	$("#tableTabs h4").on("touchstart", function(){
		// $(this).css({"background-color": "#457"})
	
	})
	$("#tableTabs h4").on("touchend", toggleViews)


	// PRODUCTION PLAN EINMAL LADEN
	function loadPlan(){

		var $productionPlanColumn = $(".productionPlanColumn")

		for(i = 0; i < tableHeads[1].length; i++){
			$productionPlanColumn.first().clone().insertAfter($(".productionPlanColumn").last()).children("h4").html(tableHeads[1][i] + " <img src='img/toggleTable.png' width = 11 class = 'collapseBtn'>")

			$productionPlanColumn = $(".productionPlanColumn")

			// headings hinzufügen
			for (k = 0; k < tableSubHeads[1][i].length; k++){
				if (k >= 1){
					$(".productionPlanColumn").last().children("ul").last().clone().insertAfter($(".productionPlanColumn").last().children("ul").last())
				}

				$(".productionPlanColumn").last().children("ul").last().children(".tabHeading").html(tableSubHeads[1][i][k])
				if (subHeadsCurrent[i][k] != "") {
					$(".productionPlanColumn").last().children("ul").last().children(".tabHeading").parent().addClass("current");
					$(".productionPlanColumn ul.current").append("<div class='indicator'></div>");
				} else {
					$(".productionPlanColumn").last().children("ul").last().children(".tabHeading").parent().removeClass("current");
					// $(".indicator").remove();
				}
				
			}
		}

		currentDayPercent.init();

		$(".productionPlanColumn").insertAfter($(".productionPlanColumn:first"))
		$(".productionPlanColumn:first").remove()


		$("#techNames").children().each(function(){
			if ($(this).children("dot").length == 1){
				$(this).show()
			}
		})

		$(".productionPlanColumn ul").css({"width": "52px"})

		// heute schwarz färben
		$(".tabHeading").each(function(){
			if ($(this).html() == tage[heute.getDay()]){
				$(this).css({"background-color": "#2e2e2e", "color": "white"})
				todayTabNumber = $(this).index(".tabHeading")
				return false
			}
		})

		$productionPlanColumn.children("ul").children("li").each(function(){
		 	if ($(this).html() == " - "){
		 		var y = $(this).index("")
		 		var x = $(this).parent().index(".productionPlanColumn ul")*3

		 		var v1 = 0
		 		var v2 = 0
		 		var v3 = 0
		 		if (productionPlan[y].length > 1){
		 			v1 = productionPlan[y][x]
		 			v2 = productionPlan[y][x+1]
		 			v3 = productionPlan[y][x+2]
		 		}

		 		if (v1 == 0){
		 			$(this).html("<div class = 'freeTime'></div>")
		 		} else if (v1 == 7){
		 			$(this).html("<div class = 'waitingTime'></div>")
		 		} else if (v1 == 6){
		 			$(this).html("<div class = 'rystTime'></div>")
		 		} else if (v1 == 8){
		 			$(this).html("<div class = 'emptyTime'></div>")
		 		} else {
		 			$(this).html("<div class = 'productionTime clickableEntry'><p>" + v1 + "</p></div>")
		 		}

		 		if (v2 == 0){
		 			$(this).append("<div class = 'freeTime'></div>")
		 		} else if (v2 == 7){
		 			$(this).append("<div class = 'waitingTime'></div>")
		 		} else if (v2 == 6){
		 			$(this).append("<div class = 'rystTime'></div>")
		 		} else if (v2 == 8){
		 			$(this).append("<div class = 'emptyTime'></div>")
		 		} else {
		 			$(this).append("<div class = 'productionTime clickableEntry'><p>" + v2 + "</p></div>")
		 		}

		 		if (v3 == 0){
		 			$(this).append("<div class = 'freeTime'></div>")
		 		} else if (v3 == 7){
		 			$(this).append("<div class = 'waitingTime'></div>")
		 		} else if (v3 == 6){
		 			$(this).append("<div class = 'rystTime'></div>")
		 		} else if (v3 == 8){
		 			$(this).append("<div class = 'emptyTime'></div>")
		 		} else {
		 			$(this).append("<div class = 'productionTime clickableEntry'><p>" + v3 + "</p></div>")
		 		}
				
		 	}
		 	if ($(this).children("div:eq(0)").html() == $(this).children("div:eq(1)").html() && $(this).children("div:eq(1)").html() == $(this).children("div:eq(2)").html() && $(this).children("div:eq(0)").html()){
		 		$(this).children("div:eq(0)").children("p").css({"opacity":0})
		 		$(this).children("div:eq(2)").children("p").css({"opacity":0})
		 	}
		 	else if ($(this).children("div:eq(0)").html() == $(this).children("div:eq(1)").html()){
		 		$(this).children("div:eq(0)").children("p").css({"opacity":0})
		 		$(this).children("div:eq(1)").children("p").addClass("halfToLeft")
		 		if ($(this).children("div:eq(2)").html() != ""){
		 			$(this).children("div:eq(2)").addClass("smallerBoxL")
		 		}
		 	}
		 	else if ($(this).children("div:eq(1)").html() == $(this).children("div:eq(2)").html() && $(this).children("div:eq(1)").html() != ""){
		 		$(this).children("div:eq(1)").children("p").css({"opacity":0})
		 		$(this).children("div:eq(2)").children("p").addClass("halfToLeft")
		 		if ($(this).children("div:eq(0)").html() != ""){
		 			$(this).children("div:eq(0)").addClass("smallerBoxR")
			 	}
		 	}
		})
	}
	loadPlan()

	// Materialbedarf für Zeiten ausrechnen
	function calculateMaterial(){
		for (i = 0; i < productionPlan.length; i++){
			for (k = 0; k < productionPlan[i].length; k++){
				var materials = recipeValues[productionPlan[i][k]-1]
				for (l = 0; l < 7; l++){
					if (materials && k <= 1*3-1){
						productionNeedDay[i][l] = productionNeedDay[i][l] + materials[l]*8
					}
					if (materials && k <= 2*3-1){
						productionNeedTwoDays[i][l] = productionNeedTwoDays[i][l] + materials[l]*8
					}
					if (materials && k <= 7*3-1){
						productionNeedWeek[i][l] = productionNeedWeek[i][l] + materials[l]*8
					}
				}
			}
		}
	}
	calculateMaterial()

	// heute blinken lassen
	var blinkToday = false
	function updateDate(){
		if (blinkToday == true){
			blinkToday = false
			$(".darkenToday").removeClass("darkenToday")

		} else {
			blinkToday = true
			var earlyLateNight = 2
			if (heute.getHours() >= 6 && heute.getHours() < 14){
				earlyLateNight = 0
			} else if (heute.getHours() < 22){
				earlyLateNight = 1
			}
			var atRecipe = [0,7,7,0,7,7,0,7,7,7,0,7,0,7,7,7,7]

			console.log($(".productionPlanColumn").children("ul").eq(todayTabNumber).children("li").length)
			if (earlyLateNight == 1){
				$(".productionPlanColumn").children("ul").eq(todayTabNumber).children("li").each(function(i,v){
					if (i <= 6){
						$(this).children("div:nth-child(3n-2)").addClass("darkenToday")
						atRecipe[i] = $(this).children("div:nth-child(3n-2)").children("p").html()
					} else if (i <= 12){
						$(this).children("div:nth-child(3n-1)").addClass("darkenToday")
						atRecipe[i] = $(this).children("div:nth-child(3n-1)").children("p").html()
					} else {
						$(this).children("div:nth-child(3n-0)").addClass("darkenToday")
						atRecipe[i] = $(this).children("div:nth-child(3n-0)").children("p").html()
					}
				})
			} else if (earlyLateNight == 0){
				$(".productionPlanColumn").children("ul").eq(todayTabNumber-1).children("li").each(function(i,v){
					if (i <= 6){
						$(this).children("div:nth-child(3n-0)").addClass("darkenToday")
						atRecipe[i] = $(this).children("div:nth-child(3n-0)").children("p").html()
					}
				})
				$(".productionPlanColumn").children("ul").eq(todayTabNumber).children("li").each(function(i,v){
					if (i <= 6){
					} else if (i <= 12){
						$(this).children("div:nth-child(3n-2)").addClass("darkenToday")
						atRecipe[i] = $(this).children("div:nth-child(3n-2)").children("p").html()
					} else {
						$(this).children("div:nth-child(3n-1)").addClass("darkenToday")
						atRecipe[i] = $(this).children("div:nth-child(3n-1)").children("p").html()
					}
				})
			} else if (earlyLateNight == 2){
				$(".productionPlanColumn").children("ul").eq(todayTabNumber).children("li").each(function(i,v){
					if (i <= 6){
						$(this).children("div:nth-child(3n-1)").addClass("darkenToday")
						atRecipe[i] = $(this).children("div:nth-child(3n-1)").children("p").html()
					} else if (i <= 12){
						$(this).children("div:nth-child(3n-0)").addClass("darkenToday")
						atRecipe[i] = $(this).children("div:nth-child(3n-0)").children("p").html()
					}
				})
				$(".productionPlanColumn").children("ul").eq(todayTabNumber+1).children("li").each(function(i,v){
					if (i > 12){
						$(this).children("div:nth-child(3n-2)").addClass("darkenToday")
						atRecipe[i] = $(this).children("div:nth-child(3n-2)").children("p").html()
					}
				})
			}

			// auf hauptseite durchsatz anpassen
			atRecipe.splice(12,1)
			atRecipe.splice(10,1)
			atRecipe.splice(6,1)
			atRecipe.splice(3,1)
			atRecipe.splice(0,1)
			$(".information").children("li").each(function(i,v){
				if (atRecipe[i]){
					$(this).children("value:first").html(recipeValues[atRecipe[i]-1][7])
				} else {
					$(this).children("value:first").html("0 kg/h")
				}
			})

			// im infofenster übernehmen
			if ($("#popup").css("opacity") > 0.5 && onInfoPage == 2){
				var plus = 0
				if (infoNumber == 1){
					plus = 3
				} else if (infoNumber == 2){
					plus = 6
				} else if (infoNumber == 3){
					plus = 10
				} else if (infoNumber == 4){
					plus = 12
				}
				$("#valTab ul li").remove()
				$("#valTab").children("div").each(function(i1,v1){
					$(".productionPlanColumn").children("ul").each(function(i2,v2){
						var content = $(this).children("li").eq(i1+plus+1).html()
						$("#valTab ul").eq(i1).append("<li>" + content + "</li>")
					})
				})
			}
		}
	}
	updateDate()
	setInterval(updateDate, 800)

	// materialbars laden
	function loadMaterialBar(element, x,y, inPopup){
		var sumLinesTogether = [1,2]
		if (y == 3){
			sumLinesTogether = [4,5]
		} else if (y == 5){
			sumLinesTogether = [7,8,9]
		} else if (y == 7){
			sumLinesTogether = [11]
		} else if (y == 9){
			sumLinesTogether = [13,14,15,16]
		}
		//element.html(x + " " + y)
		
		var needed = 0
		for (i2 = 0; i2 < sumLinesTogether.length; i2++){
			needed = needed + productionNeedWeek[sumLinesTogether[i2]][x-1]
		}
		var stock = stockData[y][x-1]

		if (needed != 0){
			//$(this).html(needed)	
			element.html("<div class = 'empty'><div class = 'full'><div class = 'used'><p>a</p></div><p></p></div><p class = 'emptyNumber'>c</p></div>")

			needed = Math.floor(parseInt(needed*0.01)*100)
			var scaleFactor = 100/(500000/stock+99)

			var duration = scaleFactor*1000
			if (stock < needed){
				scaleFactor = scaleFactor*stock/needed
			}
			var w1 = scaleFactor*100
			var w2 = 100*needed/stock

			element.children(".empty").children(".full").css({"width": 0}).animate({"width": w1+"%"}, duration = duration).siblings(".emptyNumber").html(makeNumberSexy(stock/1000) ).siblings(".full").children(".used").css({"width": w2+"%"}).children("p").html(makeNumberSexy(needed/1000))

			if (stock < needed){

				if (inPopup == true) {
					w1 = w1*4
					w2 = w2*w1*0.01
				} else {
					w1 = w1 * element.children(".empty").width()*0.01
					w2 = w2*w1*0.01
				}
				var delta = w2 - w1
				element.children(".empty").children(".full").css({"margin-right": 0}).animate({"margin-right": delta + "px"}, {duration: duration, queue: false}).children(".used").addClass("bgRed active")
			}
			element.removeClass("notNeeded");
		} else {
			element.addClass("notNeeded");
			element.html("")
		}
	}

	// productbars laden (ähnlich materialbars)
	function loadProductBar(element, x,y, inPopup){
		var sumLinesTogether = [1,2]
		if (y == 3){
			sumLinesTogether = [4,5]
		} else if (y == 5){
			sumLinesTogether = [7,8,9]
		} else if (y == 7){
			sumLinesTogether = [11]
		} else if (y == 9){
			sumLinesTogether = [13,14,15,16]
		}
		//element.html(x + " " + y)
		
		var needed = soldProductData[y][x-1]
		var stock = finishedProductData[y][x-1]

		if (needed != 0){
			//$(this).html(needed)	
			element.html("<div class = 'empty'><div class = 'full'><div class = 'used'><p>a</p></div><p></p></div><p class = 'emptyNumber'>c</p></div>")

			needed = Math.floor(parseInt(needed*0.01)*100)
			var scaleFactor = 10/(240000/stock+9)

			var duration = scaleFactor*1000
			if (stock < needed){
				scaleFactor = scaleFactor*stock/needed
			}
			var w1 = scaleFactor*100
			var w2 = 100*needed/stock

			element.children(".empty").children(".full").css({"width": 0}).animate({"width": w1+"%"}, duration = duration).siblings(".emptyNumber").html(makeNumberSexy((stock-needed)/1000) + "&thinsp;t").siblings(".full").children(".used").css({"width": w2+"%"}).children("p").html(makeNumberSexy(needed/1000) + "&thinsp;t")

			if (stock < needed){

				if (inPopup == true) {
					w1 = w1*4
					w2 = w2*w1*0.01
				} else {
					w1 = w1 * element.children(".empty").width()*0.01
					w2 = w2*w1*0.01
				}
				var delta = w2 - w1
				element.children(".empty").children(".full").css({"margin-right": 0}).animate({"margin-right": delta + "px"}, {duration: duration, queue: false}).children(".used").addClass("bgRed")
			}
			element.removeClass("notNeeded");
		} else {
			element.addClass("notNeeded");
			element.html("")
		}
	}

	// VERSCHIEDENE TABELLEN LADEN
	function buildTable(number){

		$("#technical").attr("data-tech",number);

		console.log("prepare "+number)
		isAtPage = number

		// spalten löschen
		$("#techLegend").html("")
		$(".columnLong").first().show().css({"margin-right": 0})
		$(".columnShort").first().show().css({"margin-right": 0})
		$(".columnLong").each(function(index, value){
			if (index >= 1){
				$(this).remove()
			}
		})
		$(".columnShort").each(function(index, value){
			if (index >= 1){
				$(this).remove()
			}
		})

		// plan ein-/ ausblenden
		if (number == 1){
			$(".productionPlanColumn").show()
		} else{
			$(".productionPlanColumn").hide()
		}

		// spalte 1 klonen
		if (number == 0 || number == 2) {
			for(i = 0; i < tableHeads[number].length; i++){
				if (number == 0){
					$(".columnShort").first().clone().insertAfter($(".columnShort").last()).children("h4").html(tableHeads[number][i] + " <img src='img/toggleTable.png' width = 11 class = 'collapseBtn'>")
				} else {
					$(".columnShort").first().clone().insertAfter($(".columnShort").last()).children("h4").html(tableHeads[number][i]).addClass("clickableEntry")
				}

				// headings hinzufügen
				for (k = 0; k < tableSubHeads[number][i].length; k++){
					if (k >= 1){
						$(".columnShort").last().children("ul").last().clone().insertAfter($(".columnShort").last().children("ul").last())
					}

					$(".columnShort").last().children("ul").last().children(".tabHeading").html(tableSubHeads[number][i][k])
				}
			}
			if (number == 1){
				$("#techLegend").html("<span>values</span> tons <abc style = 'color: #a3bacf; font-size: 14pt'></abc>planned <abc style = 'color: #7c9cbb; font-size: 14pt; margin-left: 20px'></abc>stock")
			} else if (number == 2) {
				$("#techLegend").html("<b>Finished products warehouse:</b> <abc style = 'color: #a3bacf; font-size: 14pt'></abc>sold, but still in the warehouse <abc style = 'color: #7c9cbb; font-size: 14pt; margin-left: 20px'></abc>for sale available")
			} else {
				$("#techLegend").html("<span>values</span> tons <abc style = 'color: #a3bacf; font-size: 14pt'></abc>booked for production <abc style = 'color: #7c9cbb; font-size: 14pt; margin-left: 20px'></abc>on stock and ordered")
			}
			
		} else if (number != 1) {
			for(i = 0; i < tableHeads[number].length; i++){
				$(".columnLong").first().clone().insertAfter($(".columnLong").last()).children("h4").html(tableHeads[number][i] + " <img src='img/toggleTable.png' width = 11 class = 'collapseBtn'>")

				// headings hinzufügen
				for (k = 0; k < tableSubHeads[number][i].length; k++){
					if (k >= 1){
						$(".columnLong").last().children("ul").last().clone().insertAfter($(".columnLong").last().children("ul").last())
					}

					$(".columnLong").last().children("ul").last().children(".tabHeading").html(tableSubHeads[number][i][k])
				}
			}
			$(".columnShort").insertAfter($(".columnLong:first"))
		}
		$(".countryInfo").last().css({"margin-right": 300+"px"})
		$(".columnLong").first().hide()
		$(".columnShort").first().hide()

		// DIESES VERSCHISSENE CSS UMGEHEN, DAS DIE ÜBERSCHRIFT NICHT KÜRZEN KANN
		if (number != 0 && number != 2){
			$(".countryInfo:gt(1)").each(function(){
				$(this).children("h4").css({"max-width" : $(this).children("ul").length*160 + "px"})
			})
		}

		// WERTE EINFÜGEN

		if (number == 0 || number == 2){
			// position rausfinden:
			// $(".countryInfo").children("ul").children("li").each(function(){
			// 	if ($(this).html() == " - "){
			// 		$(this).html($(this).parent().index(".countryInfo ul") + " / " + $(this).index())
			// 	}
			// })

			$("#techNames").children().each(function(){
				if ($(this).children("dot").length == 1){
					$(this).hide()
				}
			})
			$("#extraLine").show()

			// kleine balken laden
			$(".columnShort").children("ul:gt(0)").css({"width": "180px"}).children("li").each(function(){
				if ($(this).html() == " - "){
					var x = $(this).parent().index(".columnShort ul")
					var y = $(this).index()
					if (number == 0){
						loadMaterialBar($(this), x,y, false)
					} else {
						loadProductBar($(this), x,y, false)
					}
				}
			})
		
		} else if (number == 1){
			// production plan
			$("#techNames").children().each(function(){
				if ($(this).children("dot").length == 1){
					$(this).show()
				}
			})
			$("#extraLine").hide()

			$("#techLegend").html("<abc style = 'color: #29cc29; font-size: 14pt'></abc>production <abc style = 'color: #ffca00; font-size: 14pt; margin-left: 20px'></abc>set-up <abc style = 'color: #cc2929; font-size: 14pt; margin-left: 20px'></abc>maintenance")

		} else if (number == 2){
			// finished products
			$("#techLegend").html("")

		} else if (number == 3){
			// efficiency
			$("#techNames").children().each(function(){
				if ($(this).children("dot").length == 1){
					$(this).show()
				}
			})
			$("#extraLine").hide()

			$(".columnLong").children("ul").children("li").each(function(){
				if ($(this).html() == " - "){
					var x = $(this).index()
					var y = $(this).parent().index(".columnLong ul")
					if (y > 0){
						$(this).html(efficiencyVal[x-1][y-1])
						//$(this).html(x + " " + y)
						if ((x == 4 && y == 7) || (x == 5 && y == 4) || (x == 5 && y == 5) || (x == 5 && y == 6) || (x == 5 && y == 7) || (x == 5 && y == 9) || (x == 8 && y == 8) || (x == 9 && y == 6) || (x == 13 && y == 10) || (x == 15 && y == 9)){
							$(this).css({"color": "#ff8400"})
						} else if ((x == 15 && y == 4) || (x == 15 && y == 5) || (x == 15 && y == 9) || (x == 15 && y == 10) || (x == 16 && y == 4) || (x == 16 && y == 5) || (x == 16 && y == 6) || (x == 16 && y == 9) || (x == 16 && y == 10) || (x == 13 && y == 7) || (x == 14 && y == 8)){
							$(this).css({"color": "red"})
						}
					}
				}
			})
			$("#techLegend").html("*in the last 12 months")
		}

	}






	// click on btn
	function clickOnBtn(givenNumber){

		var number = givenNumber
		onInfoPage = 0
		if (jQuery.type(givenNumber) != "number"){
			number = $(this).attr("data-btn")
		}
		$(this).siblings().children("img").attr({"src": "img/radio_off.png"})
		$(this).children("img").attr({"src": "img/radio_on.png"})

		if (number != 8){
			$("#btns4").hide()
		}

		// auf wochenansicht resetten
		dayView = false
		$("#btns3").children("p:last").children("img").attr({"src": "img/radio_off.png"})
		$("#btns3").children("p:first").children("img").attr({"src": "img/radio_on.png"})
		graphView = true
		switchTableGraph()

		// richtige seite anzeigen
		if (number == 4 || number == 6){
			$(".infoValues").hide()
			$(".infoMaterials").show()
		} else if (number == 5 || number == 7){
			$(".infoValues").show()
			$(".infoMaterials").hide()
		}

		// buttons am linken rand
		if (number <= 3){
			$("#mapDiv .mapInfo li value").each(function(index, value){
				if ($(this).attr("data-id") == number){
					$(this).show()
				} else {
					$(this).hide()
				}
			})
		}

		// buttons in popup
		else if (number == 4){

			$(".infoMaterials li").remove()

			for(i = 0; i < 7; i++){
				$aboutUlHead = $(".infoMaterials").children("div:eq(0)").children("ul")
				$aboutUlVal = $(".infoMaterials").children("div:eq(1)").children("ul")
				$aboutUlVal.append("<li>-</li>")

				var x = $aboutUlVal.children("li:last").index()
				var y = infoNumber*2+1
				$aboutUlHead.append("<li>"+tableHeads[0][x]+"</li>")
				loadMaterialBar($aboutUlVal.children("li:last"), x+1,y, true)
			}

			$(".infoMaterials").children(".materialLegend:first").html("<abc style = 'color: #a3bacf; font-size: 14pt'></abc>planned")
			$(".infoMaterials").children(".materialLegend:last").html("<abc style = 'color: #7c9cbb; font-size: 14pt'></abc>stock")
			$("#btns3").show()

		} else if (number == 5){
			// production plan
			onInfoPage = 2
			$(".scrollableY.infoValues").children("p").html("")
			$("#infoNames li").remove()
			for(i = 0; i < tableHeads[1].length; i++){
				$("#infoNames").append("<li>" + tableHeads[1][i] + "</li>")
				for (k = 0; k < tableSubHeads[1][i].length; k++){
					$("#infoNames").append("<li style = 'margin-left: 96px; padding-left: 4px; padding-right: 4px'>" + tableSubHeads[1][i][k] + "</li>")
					if (k == 0){
						$("#infoNames li:last").css({"margin-top": "-30px"})
					} else if (k >= 5){
						$("#infoNames li:last").css({"opacity": 0.5})
					}
					if (i == 0 && $("#infoNames li:last").html() == tage[heute.getDay()]){
						$("#infoNames li:last").css({"background-color": "#2e2e2e", "color": "white"})
					}
				}
			}

			// einträge von productionPlanColumn kopieren
			var plus = 0
			if (infoNumber == 1){
				plus = 3
			} else if (infoNumber == 2){
				plus = 6
			} else if (infoNumber == 3){
				plus = 10
			} else if (infoNumber == 4){
				plus = 12
			}
			$("#valTab ul li").remove()
			$("#valTab").children("div").each(function(i1,v1){
				$(".productionPlanColumn").children("ul").each(function(i2,v2){
					var content = $(this).children("li").eq(i1+plus+1).html()
					$("#valTab ul").eq(i1).append("<li>" + content + "</li>")
				})
			})

		} else if (number == 6){
			// finished products
			$(".infoMaterials li").remove()

			for(i = 0; i < 5; i++){
				$aboutUlHead = $(".infoMaterials").children("div:eq(0)").children("ul")
				$aboutUlVal = $(".infoMaterials").children("div:eq(1)").children("ul")
				$aboutUlVal.append("<li>-</li>")

				var x = $aboutUlVal.children("li:last").index()
				var y = infoNumber*2+1
				$aboutUlHead.append("<li class = 'clickableEntry' style = 'font-weight: normal'>Recipe "+ (x+1) +"</li>")
				loadProductBar($aboutUlVal.children("li:last"), x+1,y, true)
			}

			$(".infoMaterials").children(".materialLegend:first").html("<abc style = 'color: #a3bacf; font-size: 14pt'></abc>sold")
			$(".infoMaterials").children(".materialLegend:last").html("<abc style = 'color: #7c9cbb; font-size: 14pt'></abc>for sale available")
			$("#btns3").hide()

		} else if (number == 7){
			$("#btns4").show()
			$(".scrollableY.infoValues").children("p").html("*in the last 12 months")
			$("#infoNames li").remove()
			for(i = 0; i < tableHeads[3].length; i++){
				$("#infoNames").append("<li>" + tableHeads[3][i] + "</li>")
			}

			$("#valTab ul li").remove()
			var plus = 0
			if (infoNumber == 1){
				plus = 3
			} else if (infoNumber == 2){
				plus = 6
			} else if (infoNumber == 3){
				plus = 10
			} else if (infoNumber == 4){
				plus = 12
			}

			$("#infoNames li").each(function(i1, v1){
				$("#valTab ul").each(function (i2, v2){
					$(this).append ("<li>" + efficiencyVal[i2+plus][i1] + "</li>")
					var x = i2+plus+1
					var y = i1+1
					if ((x == 4 && y == 7) || (x == 5 && y == 4) || (x == 5 && y == 5) || (x == 5 && y == 6) || (x == 5 && y == 7) || (x == 5 && y == 9) || (x == 8 && y == 8) || (x == 9 && y == 6) || (x == 13 && y == 10) || (x == 15 && y == 9)){
							$(this).children("li:last").css({"color": "#ff8400"})
					} else if ((x == 15 && y == 4) || (x == 15 && y == 5) || (x == 15 && y == 9) || (x == 15 && y == 10) || (x == 16 && y == 4) || (x == 16 && y == 5) || (x == 16 && y == 6) || (x == 16 && y == 9) || (x == 16 && y == 10) || (x == 13 && y == 7) || (x == 14 && y == 8)){
							$(this).children("li:last").css({"color": "red"})
					}
				})
			})

		} else if (number == 8){
			showWarningCoperion()

		}

		// if (number >= 5 && number <= 6){
		// 	$(".infoValues").show()
		// 	$(".infoMaterials").hide()

		// 	$("#valTab ul li").remove()
		// 	$("#infoNames li").each(function(index, value){
		// 		$("#valTab ul").each(function (index, value){
		// 			if (Math.random() < 0.1){
		// 				$(this).append ("<li class = 'clickableEntry'>"+Math.floor(Math.random()*100)+" •</li>")
		// 			} else {
		// 				$(this).append ("<li>"+Math.floor(Math.random()*100)+"</li>")
		// 			}
		// 		})
		// 	})
		// }

		if (number > 3){
			if (number == 8){
				$(this).removeClass("activebtn").css({"background-color": "white"})
			}	else{
				$(this).siblings().removeClass("activebtn").css({"background-color": "white"})
				$(this).addClass("activebtn")
			}
		}
	}
	clickOnBtn(1);
	$("#btns li").on("click", clickOnBtn)
	$("#popup h3").on("touchend", clickOnBtn)
	$("#popup h3").on("touchstart", function(){
		$(this).css({"background-color": "#eee"})
	})

	// click on clickableEntry
	function clickOnClickableEntry(){
		if ($("#popup_extended").css("opacity") < 0.1){
			var left = parseInt($(this).offset().left)
			var top = parseInt($(this).offset().top)
			var content = $(this).children("p").html()
			var contentSelf = $(this).html()

			if (contentSelf == "Recipe 1"){
				content = 1
			} else if (contentSelf == "Recipe 2"){
				content = 2
			} else if (contentSelf == "Recipe 3"){
				content = 3
			} else if (contentSelf == "Recipe 4"){
				content = 4
			} else if (contentSelf == "Recipe 5"){
				content = 5
			}

			// inhalt austauschen
			if (content) {
				var number = parseInt(content)
				$("#popup_extended").children("ul").children("li").remove()
				$("#popup_extended").children("ul").append("<li class = 'heading'>" + recipes[number-1][0] + "</li>")
				for (i = 0; i < recipes[number-1].length-1; i++){
					$("#popup_extended").children("ul").append("<li>" + recipes[number-1][i+1] + "</li>")
				}
			}

			// ryst / waiting info
			if ($(this).hasClass("rystTime")){
				left = left + 4
				$("#popup_extended").children("ul").children("li").remove()
				$("#popup_extended").children("ul").append("<li class = 'heading'>set-up</li>")
			} else if ($(this).hasClass("waitingTime")){
				left = left + 4
				$("#popup_extended").children("ul").children("li").remove()
				$("#popup_extended").children("ul").append("<li class = 'heading'>maintenance</li>")
			}

			// platzieren
			if (showingTable == true){
				if (content){
					top = top - 5
				} else {
					left = left + 20
				}
				if (contentSelf == "Recipe 1" || contentSelf == "Recipe 2" || contentSelf == "Recipe 3" || contentSelf == "Recipe 4" || contentSelf == "Recipe 5"){
					top = top + 13
					left = left + 83
				}
			} else if (contentSelf == "Recipe 1" || contentSelf == "Recipe 2" || contentSelf == "Recipe 3" || contentSelf == "Recipe 4" || contentSelf == "Recipe 5"){
				left = left + 20
			}
			if($(this).hasClass("attentionIcn") == true){
				left = 352
				top = 160
			}
			$("#popup_extended").stop().animate({"opacity": 1}, duration = 150)
			$("#popup_extended").css({"left": left-$("#popup_extended").width()/2 + 10+"px", "top": top + 40 +"px"})
			$("#popup_extended img").css({"margin-left": ($("#popup_extended").width()/2-25) + "px"})

		}	else{
			hideExtended()
		}
	}
	$(document).on("click", ".clickableEntry", clickOnClickableEntry)
	$(document).on("click", "#popup .attentionIcn", clickOnClickableEntry)
	$(document).on("click", "#popup .rystTime", clickOnClickableEntry)
	$(document).on("click", "#popup .waitingTime", clickOnClickableEntry)

	function hideExtended(){
		$("#popup_extended").animate({"opacity": 0}, duration = 150)
	}
	$("#popup").on("click", hideExtended)
	$("#technical").on("touchstart", hideExtended)


	// technische ansicht: spalten abwechselnd färben
	$("#technical").children("div").children("ul").each(function(index1, value1){
		$(this).children("li").each(function(index2, value2){
			if (index2 != 0 && $(this).html() != " <br><br> " && $(this).html() != " <br> " ){
				if (index2%2 == 0){
					$(this).css({"background-color":"#f6f6f6"})
				} else {
					$(this).css({"background-color":"#e3e3e3"})
					$(this).addClass("contentline");
				}
			}
			if ($(this).html() == " <br> ") {
				$(this).addClass("contentline-empty")
			}
		})
	})

	// technische ansicht: linke spalte locken
	var $techNames = $("#techNames")
	var $technical = $("#technical")
	$(technical).scroll(function(){
		$techNames.scrollTop($(this).scrollTop())
	});

	// technische ansicht: spalten ausblenden
	function toggleTechTab(){
		if ($(this).hasClass("clickableEntry") == false){
			var toWidth = 30
			var toOpacity = 0

			if ($(this).parent().data("originalWidth") == null){
				$(this).parent().data("originalWidth", $(this).parent().width())
			}

			if ($(this).parent().width() < 32){
				toWidth = $(this).parent().data("originalWidth")
				toOpacity = 1
				$(this).removeClass("collapsed")
			} else {
				$(this).addClass("collapsed")
			}
			$(this).parent().stop().animate({"width": toWidth+ "px"}, duration = 500)
			$(this).siblings().stop().animate({"opacity": toOpacity}, duration = 500)
		}
	}

	$(document).on("click", "#technical h4", toggleTechTab)
	


	// Warning popup

	// function showWarning(){
	// 	$("#warningPopup").delay(2000).animate({"zoom": "100%", "opacity": 1}, duration = 350, "easeOutBack").css({"pointer-events": "auto"})
	// 	if (didShowWarning == false){
	// 		didShowWarning = true
	// 		$("#theBrokenPlant").stop(true).delay(2000).queue(function(){
	// 			// popup kann daneben auftauchen
	// 			// light schnitte
	// 			$(this).append('<div class = "attentionIcnContainer"> <img class = "attentionIcn" src = "img/attention_icn.png" width = 20> </div>')
	// 		})
	// 	}
	// }
	function showWarningCoperion(){
		showMarketingAndSales();
		apiData.parse();
		// $("#warningPopup").animate({"zoom": "100%", "opacity": 1}, duration = 350, "easeOutBack").css({"pointer-events": "auto"})
	}

	setInterval(function(){
		$(".attentionIcn").animate({"zoom":" 1.2", "vertical-align" : "-3px"}).animate({"zoom":" 1", "vertical-align": "-3px"})
	}, 2000);

	// auslöser: oben links hinklicken (soll das rein?)
	//$("#header img:first").on("click", showWarning)

	$("#warningPopup .answer").on("touchstart", function(){
		$(this).css({"background-color": "#606060"})
	})
	$("#warningPopup .answer").on("touchend", function(e){
		e.stopPropagation();
		$(this).css({"background-color": "#6f7070"})
		$("#warningPopup").animate({"zoom": "90%", "opacity": 0}).css({"pointer-events": "none"})
		$("#tableTabs h4.active").removeClass("active");
		if ($(this).index(".answer") == 1){
			//window.location.href = "https://mycoperion.coperion.com"
		}
	})


	// exit app
	$("#exitBtn").on("click", function(){
		if ( window.sendSpacebrewMessage ) {
			window.sendSpacebrewMessage( 'appCloses' );
		}

		setTimeout( function () {
			window.close();
		}, 150 );
	})


	// update time
	function updateTime(){

		//heute = new Date()

		// zeit testen
		//heute = new Date(1991, 08, 30, 10, 15, 30, 0)

		$(".mapInfo h3").each(function(){
			var hours = (24 + parseInt(heute.getHours()) + parseInt($(this).attr("data-timezone")))%24
			var minutes = ("00" + heute.getMinutes()).substr(-2)

			if (hours <= 12){
				$(this).html(hours + ":" + minutes + " AM")
			} else {
				$(this).html(hours-12 + ":" + minutes + " PM")
			}
		})

		// nacht positionieren

		var nightPos = -(25/6)*heute.getHours()+30
		$(".night").first().css({"left": nightPos + "%"})
		$(".night").last().css({"left": nightPos + 100 + "%"})
	}
	updateTime()
	setInterval(updateTime, 60000)


	// news tigger

	var newsListeNummer = 1
	function updateTigger(){

		$("#tigger p").first().html($("#tigger p").last().html())

		$("#tigger p").last().html(newsListe[newsListeNummer%newsListe.length])
		newsListeNummer = newsListeNummer + 1

		$("#tigger p").first().css({"margin-top": 29-$("#tigger p").first().height()*0.5 + "px"}).animate({"margin-top": -$("#tigger p").first().height() + "px"})
		$("#tigger p").last().css({"margin-top": 29-$("#tigger p").last().height()*0.5 + "px"})
	}
	$("#tigger p").last().html(newsListe[0])
	updateTigger()
	setInterval(updateTigger, 5000)




	// from the interwebs: dieses schwachsinnige kontextmenü aufhalten
	window.oncontextmenu = function(event) {
		event.preventDefault()
		event.stopPropagation()
		return false
	};

	if ( window.sendSpacebrewMessage ) {
		window.sendSpacebrewMessage( 'appOpened' );
	}
});

// function toggleMarketingAndSales () {
// 	$('#marketing-sales').toggleClass( 'is-active' );
// }

// $( '#marketing-sales' ).on( 'click', hideMarketingAndSales );

var ms_timeout;

function showMarketingAndSales () {
	clearTimeout( ms_timeout );

	ms_timeout = setTimeout( function () {
		$('#marketing-sales').addClass( 'is-active' );
	}, 100 );

}

function hideMarketingAndSales () {
	ms_timeout = setTimeout( function () {
		$('#marketing-sales').removeClass( 'is-active' );
	}, 100 );
}

// WERTE

var heute = new Date()
//heute = new Date(1991, 07, 28, 23, 15, 30, 0)
var weekStart = new Date(heute.getTime() - (heute.getDay()+6)%7 * 24 * 60 * 60 * 1000)
var productionDates = [
	weekStart,
	new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
	new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000),
	new Date(weekStart.getTime() + 13 * 24 * 60 * 60 * 1000),
	new Date(weekStart.getTime() + 14 * 24 * 60 * 60 * 1000),
	new Date(weekStart.getTime() + 20 * 24 * 60 * 60 * 1000),
	new Date(weekStart.getTime() + 21 * 24 * 60 * 60 * 1000),
	new Date(weekStart.getTime() + 27 * 24 * 60 * 60 * 1000),
]


var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
var daySubHeads = new Array();
var subHeadsCurrent = new Array();
for (var f = 0; f < 4; f++) {
	daySubHeads[f] = new Array();	
	subHeadsCurrent[f] = new Array();	
	for (var n = 0; n < 7; n++) {
		daySubHeads[f][n] = days[n] + " " + new Date(productionDates[f].getTime() + (n*86400000)).getDate();
		if (new Date().toDateString() == new Date(productionDates[f].getTime() + (n*86400000)).toDateString()) {
			subHeadsCurrent[f][n] = "current";
		} else {
			subHeadsCurrent[f][n] = "";
		}
	};
};


var tableHeads = [
	["PE", "PP", "Add. Powder + Y", "Add. Pellets + B", "Premix", "GF", "CaCO3"],
	[productionDates[0].getDate() + "." + parseInt(productionDates[0].getMonth()+1) + ". – " + productionDates[1].getDate() + "." + parseInt(productionDates[1].getMonth()+1) + ".", productionDates[2].getDate() + "." + parseInt(productionDates[2].getMonth()+1) + ". – " + productionDates[3].getDate() + "." + parseInt(productionDates[3].getMonth()+1)+ ".", productionDates[4].getDate() + "." + parseInt(productionDates[4].getMonth()+1) + ". – " + productionDates[5].getDate() + "." + parseInt(productionDates[5].getMonth()+1)+ ".", productionDates[6].getDate() + "." + parseInt(productionDates[6].getMonth()+1) + ". – " + productionDates[7].getDate() + "." +parseInt( productionDates[7].getMonth()+1)+ "."],
	["Recipe 1", "Recipe 2", "Recipe 3", "Recipe 4", "Recipe 5"],
	["Availability", "Ø product change over [min.]", "maintenance", "scrap rate", "customer complaints"],
	["Produktionsbestand", "Verkaufspreis", "Herstellungskosten"],
	["Spalte 1", "Spalte 2", "Spalte 3", "Spalte 4"],
]




var tableSubHeads = [
	[
		[], [], [], [], [], [], [],
	],
	[
		[]
	],
	[
		[], [], [], [], [], 
	],
	[
		[], [], [], [], [], [], [], [], [], [], [], [], 
	],
	[
		[], [], [], [], 
	],
	[
		[], [], [], [], 
	],
]

tableSubHeads[1] = daySubHeads;

var productionPlan = [
	[],
	[1,1,0, 1,1,0, 6,2,0, 2,2,0, 2,6,0, 0,0,0, 0,0,0, 
	3,3,0, 3,3,0, 6,1,0, 1,1,0, 6,2,0, 0,0,0, 0,0,0, 
	2,2,0, 2,2,0, 6,3,0, 3,3,0, 6,1,0, 0,0,0, 0,0,0, 
	1,1,0, 1,1,0, 6,3,0, 3,3,0, 7,2,0, 0,0,0, 0,0,0],
	[2,2,0, 2,2,0, 2,6,0, 3,3,0, 3,3,0, 0,0,0, 0,0,0, 
	3,3,0, 4,4,0, 4,6,0, 2,2,0, 2,6,0, 0,0,0, 0,0,0, 
	3,3,0, 4,4,0, 4,6,0, 2,2,0, 2,6,0, 0,0,0, 0,0,0, 
	3,3,0, 3,3,0, 3,3,0, 3,3,0, 4,7,0, 0,0,0, 0,0,0],
	[],
	[1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 0,0,0, 0,0,0,
	8,8,0, 8,8,0, 8,8,0, 8,8,0, 8,8,0, 0,0,0, 0,0,0,
	8,8,0, 8,8,0, 8,8,0, 8,8,0, 8,6,0, 0,0,0, 0,0,0,
	2,2,0, 2,2,0, 2,2,0, 2,2,0, 2,2,0, 0,0,0, 0,0,0],
	[3,3,0, 3,3,0, 3,3,0, 4,4,0, 5,6,0, 0,0,0, 0,0,0,
	2,2,0, 2,2,0, 2,6,0, 3,3,0, 3,3,0, 0,0,0, 0,0,0,
	3,4,0, 4,4,0, 5,6,0, 2,2,0, 6,3,0, 0,0,0, 0,0,0,
	3,3,0, 3,3,0, 3,3,0, 4,4,0, 5,7,0, 0,0,0, 0,0,0],
	[],
	[1,1,1, 1,1,1, 1,1,1, 1,1,1, 1,1,1, 0,0,0, 0,0,0,
	1,1,1, 1,1,1, 1,1,1, 1,1,1, 1,1,1, 0,0,0, 0,0,0,
	1,1,6, 2,2,2, 2,2,2, 2,2,2, 2,2,2, 0,0,0, 0,0,0,
	2,2,2, 2,2,2, 2,2,2, 2,2,2, 2,2,2, 0,0,0, 0,0,0],
	[3,3,3, 3,3,3, 3,3,3, 3,3,3, 3,3,3, 0,0,0, 0,0,0,
	3,3,3, 3,3,4, 4,4,4, 4,4,4, 4,4,4, 0,0,0, 0,0,0,
	4,4,4, 4,4,4, 4,5,5, 5,5,5, 5,5,5, 0,0,0, 0,0,0,
	4,4,4, 3,3,3, 3,3,3, 3,3,3, 3,3,7, 0,0,0, 0,0,0],
	[1,1,1, 1,1,1, 1,1,6, 2,2,2, 2,2,2, 0,0,0, 0,0,0,
	6,3,3, 3,3,3, 3,3,3, 3,3,3, 3,3,3, 0,0,0, 0,0,0,
	6,2,2, 2,2,2, 2,2,6, 1,1,1, 1,1,1, 0,0,0, 0,0,0,
	6,2,2, 2,2,2, 2,2,6, 3,3,3, 3,7,1, 0,0,0, 0,0,0],
	[],
	[2,2,2, 2,2,2, 2,2,6, 3,3,3, 3,3,3, 0,0,0, 0,0,0,
	3,3,4, 4,4,4, 4,4,6, 1,1,1, 1,1,6, 0,0,0, 0,0,0,
	3,3,3, 3,3,3, 3,3,6, 1,1,1, 1,1,6, 0,0,0, 0,0,0,
	2,2,2, 2,2,2, 2,2,6, 3,3,3, 3,3,7, 0,0,0, 0,0,0],
	[],
	[1,1,0, 1,1,0, 1,6,0, 2,2,0, 2,2,0, 0,0,0, 0,0,0,
	2,6,0, 1,1,0, 1,1,0, 2,2,0, 2,2,0, 0,0,0, 0,0,0,
	2,2,0, 2,2,0, 2,2,0, 2,2,0, 2,2,0, 0,0,0, 0,0,0,
	2,2,0, 2,2,0, 2,2,0, 2,2,0, 2,2,0, 0,0,0, 0,0,0],
	[3,3,0, 3,3,0, 3,3,0, 3,3,0, 3,3,0, 0,0,0, 0,0,0,
	3,3,0, 4,4,0, 4,4,0, 4,4,0, 5,5,0, 0,0,0, 0,0,0,
	3,3,0, 3,3,0, 3,3,0, 4,4,0, 4,4,0, 0,0,0, 0,0,0,
	5,5,0, 3,3,0, 3,3,0, 3,3,0, 7,3,0, 0,0,0, 0,0,0],
	[1,1,0, 1,1,0, 1,6,0, 2,2,0, 2,2,0, 0,0,0, 0,0,0,
	2,2,0, 2,2,0, 2,6,0, 3,3,0, 3,6,0, 0,0,0, 0,0,0,
	1,1,0, 1,1,0, 6,3,0, 3,3,0, 3,6,0, 0,0,0, 0,0,0,
	2,2,0, 2,2,0, 2,6,0, 3,3,0, 3,7,0, 0,0,0, 0,0,0],
	[8,8,0, 8,8,0, 8,8,0, 8,8,0, 8,8,0, 0,0,0, 0,0,0,
	8,8,0, 8,8,0, 8,8,0, 8,8,0, 8,8,0, 0,0,0, 0,0,0,
	8,8,0, 8,8,0, 8,8,0, 8,8,0, 8,8,0, 0,0,0, 0,0,0,
	8,8,0, 8,8,0, 8,8,0, 8,8,0, 8,8,0, 0,0,0, 0,0,0,]
]

var recipes = [
	["Recipe 1 – Performance 2.500 kg/h", "67% PE", "3% Additives (Powder) + Yellow (Pellets)", "30% CaCO3"],
	["Recipe 2 – Performance 2.600 kg/h ", "47% PP", "3% Premix", "50% CaCO3"],
	["Recipe 3 – Performance 3.000 kg/h", "47% PP", "3% Additives (Pellets) + Black (Pellets)", "50% GF"],
	["Recipe 4 – Performance 2.800 kg/h", "67% PP", "3% Additives (Pellets) + Black (Pellets)", "30% GF"],
	["Recipe 5 – Performance 2.600 kg/h", "87% PP", "3% Additives (Pellets) + Black (Pellets)", "10% GF"],
]

var recipeValues = [
	//PE, PP, Additive PG, Additive GS, Premix, GF, CaCO3,  >> Durchsatz
	[1675, 0, 75, 0, 0, 0, 750, "2500 kg/h"],
	[0, 1222, 0, 0, 780, 0, 1300, "2600 kg/h"],
	[0, 1410, 0, 90, 0, 1500, 0, "3.000 kg/h"],
	[0, 1876, 0, 84, 0, 840, 0, "2.800 kg/h"],
	[0, 2262, 0, 78, 0, 260, 0, "2.600 kg/h"]
]

// stockData, finishedProductData, soldProductData sind relativ frei erfunden und richtet sich grob nach den infos auf dem plan mit dem spongebob
var stockData = [
	[],
	[22500*2.6, 25000*5.9, 2000*1.9, 2000*1.8, 7500*8, 10000*6, 40000*3.1],
	[],
	[22500*2.3, 25000*4.9, 2000*3.4, 2000*3.2, 7500*2, 15000*7.1, 40000*1.8],
	[],
	[22500*14.1, 25000*9.7, 2000*6.9, 2000*5.4, 7500*5.8, 15000*12.6, 40000*6.1],
	[],
	[22500*0.9, 35000*1.1, 2000*1.1, 2000*5.1, 20000*2.5, 20000*4.9, 40000*2.4],
	[],
	[22500*6.7, 25000*8.9, 2000*4, 2000*4, 7500*7.5, 7500*18.1, 40000*4],
]

var finishedProductData = [
	[],
	[4*2500*8, 4*2600*8, 0, 0, 0],
	[],
	[3*2500*8, 0, 2*3000*8, 2*2800*8, 1*2600*8],
	[],
	[12*2500*8, 0, 6*3000*8, 0, 0],
	[],
	[0, 6*2600*8, 0, 0, 0],
	[],
	[10*2500*8, 0, 6*3000*8, 0, 0],
]

var soldProductData = [
	[],
	[3.5*2500*8, 3*2600*8, 0, 0, 0],
	[],
	[2*2500*8, 0, 0*3000*8, 2*2800*8, 0.8*2600*8],
	[],
	[10*2500*8, 0, 6*3000*8, 0, 0],
	[],
	[0, 4*2600*8, 0, 0, 0],
	[],
	[8*2500*8, 0, 6*3000*8, 0, 0],
]

var efficiencyVal =[
	["4016&thinsp;h/y", "90", "40&thinsp;h/y", "2,20%", "3" ],
	["4016&thinsp;h/y", "84", "65&thinsp;h/y", "1,90%", "1" ],
	[],
	["4032&thinsp;h/y", "162", "25&thinsp;h/y", "1,40%", "0" ],
	["4032&thinsp;h/y", "192", "18&thinsp;h/y", "1,10%", "1" ],
	[],
	["5976&thinsp;h/y", "84", "35&thinsp;h/y", "1,90%", "1" ],
	["5976&thinsp;h/y", "93", "28&thinsp;h/y", "2,40%", "4" ],
	["5976&thinsp;h/y", "84", "45&thinsp;h/y", "2,00%", "1" ],
	[],
	["6000&thinsp;h/y", "135", "51&thinsp;h/y", "3,40%", "5" ],
	[],
	["4000&thinsp;h/y", "66", "31&thinsp;h/y", "3,50%", "3" ],
	["4000&thinsp;h/y", "75", "28&thinsp;h/y", "0,70%", "4" ],
	["4000&thinsp;h/y", "111", "45&thinsp;h/y", "4,70%", "1" ],
	["4000&thinsp;h/y", "87", "59&thinsp;h/y", "1,20%", "2" ],
]

var productionNeedDay = [
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
]

var productionNeedTwoDays = [
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
]

var productionNeedWeek = [
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
]



var currentDayPercent = {

	init: function() {

		currentDayPercent.productionTime();
		setInterval(function(){ currentDayPercent.productionTime(); }, 60000);

	},

	getPercent: function() {

		var tempNow = Math.floor(Date.now() / 1000);
		var start = new Date();
		start.setHours(0,0,0,0);
		start = Math.floor(start.getTime() / 1000);
		var timePercent = ((tempNow - start) / 86400)*100;
		return timePercent;

	},

	mapRange: function(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	},

	productionTime: function() {

		var setProgress = parseInt(currentDayPercent.mapRange(currentDayPercent.getPercent(), 0, 100, 0, 61));
		$(".productionPlanColumn ul.current .indicator").css('margin-left', setProgress+'px');

	}


}


var apiData = {

	data_rss: new Array(),
	data_coperion: new Array(),
	data_weather: new Array(),

	init: function() {

		apiData.loadData();
		setInterval(apiData.loadData(), 1800);

	},

	parse: function() {

		apiData.parseRSS($("#mkt_rss").data("default"),"#mkt_rss",$("#mkt_rss").data("count"));
		apiData.parseCop("#mkt_cop",3);

	},

	refreshServerData: function() {

		$.ajax({
			dataType: "json",
			url : "api/data.php",
			success : function (data) {
				
			}
		});

	},

	loadData: function() {

		apiData.loadFeed("api/kunststoffeDE.data");
		apiData.loadFeed("api/plasticseuropeORG.data");
		apiData.loadCoperion("api/coperion.data");
		apiData.loadWeather("api/weather.data");
		apiData.refreshServerData();

	},

	loadFeed: function(loadurl) {

		$.ajax({
			dataType: "json",
			url : loadurl,
			success : function (data) {
				apiData.data_rss[data.title] = data;
			}
		});

	},

	loadCoperion: function(loadurl) {

		$.ajax({
			dataType: "json",
			url : loadurl,
			success : function (data) {
				apiData.data_coperion = data;
			}
		});

	},

	loadWeather: function(loadurl) {

		$.ajax({
			dataType: "json",
			url : loadurl,
			success : function (data) {
				apiData.data_weather = data;
				apiData.updateWeather();
			}
		});

	},

	updateWeather: function() {

		$( ".mapInfo" ).each(function() {
 			
			var current = $(this).data("name");
			var temperature = apiData.data_weather[current].temp;
			var weather = apiData.data_weather[current].weather;

			$(this).attr("data-temp", temperature + "°C");
			$(this).attr("data-weather", weather);
 			

		});

	}, 

	parseRSS: function(data,target,count) {

		var loadData = apiData.data_rss[data];
		var currentCount = count;

		$( target + " .content" ).innerHTML = "";

		$(loadData.items).each(function(index) {

			currentCount = currentCount - 1;

			if (currentCount >= 0) {

				var current = $(this);

				$( target + " .content" ).append(

					'<div class="news-item">' + 
					'<h4>' + current[0].title + '</h4>' + 
					'<h5>' + current[0].date + '</h5>' + 
					'<p>' + current[0].description + '</p>' + 
					'</div>'

				);

			} 

		});

	}, 

	parseCop: function(target,count) {

		var loadData = apiData.data_coperion;

		var currentCount = count;

		$( target + " .content" ).innerHTML = "";

		$(loadData.items).each(function(index) {

			currentCount = currentCount - 1;

			if (currentCount >= 0) {

				var current = $(this);

				$( target + " .content" ).append(

					'<div class="news-item">' + 
					'<h4>' + current[0].title + '</h4>' + 
					'<h5>' + current[0].date + '</h5>' + 
					'<p>' + current[0].description + '</p>' + 
					'</div>'

				);

			} 

		});

	}


}

apiData.init();


var marketing = {

	init: function() {

		$("#marketing-sales .marketingNav > div").on("click", function(){

			$("#marketing-sales .marketingNav > div").removeClass("active");
			$(this).addClass("active");

			var tab = $(this).data("target");

			$(".marketingTab").removeClass("active");
			$( "#"+tab+".marketingTab").addClass("active");

		});


	}

	// Update Funktion einbauen


}

marketing.init();