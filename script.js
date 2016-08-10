$(document).ready(function(){

	var _W = 1024
	var _H = 768

	// landscape
	// easing lib

	jQuery.easing.def = "easeInOutQuad";

	console.log($(window).height())

	var mapMarginDefault = 70
	//var leftFlagWidth = $("#mapDiv .leftFlag").width()-30
	var leftFlagWidth = 130

	var durchsatzBsp = "2.500 kg/h"
	var produktionsmengeBsp = "40 t"
	var produktuntergruppeBsp = "PA 1234"
	var heute = new Date()

	var tage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
	var monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
	var materialListe = ["Stickstoff", "Kindertränen", "Diamant", "Knete", "Milka", "Müllermilch", "Atommüll", "Sternenstaub", "Rinderfilet", "Argon", "Süßstoff"]

	$("#header h2").html(tage[heute.getDay()] + ", " + heute.getDate() + ". " + monate[heute.getMonth()])

	function loadHome(){

		console.log("go home");

		$("#mapDiv .mapInfo").each(function(index, value) {
			var soManyEntries = parseInt($(this).children("ul").children("li").length)
			$(this).children(".line").css({"height": soManyEntries*15+33+"px"})
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
			}
		});

		// start animate map
		$("#mapDiv #map").stop(true).animate({"width": "100%", "margin-left": "0%", "margin-top": mapMarginDefault+"px", "opacity": 1}, duration = 900, "easeInOutQuart")

		// disable popup
		$("#popup").stop(true).animate({"opacity": 0}, duration = 500)
		$("#popup").css({"pointer-events" : "none"})
		hideExtended()

		// zeug einblenden
		$("#toggle").css({"pointer-events": "auto"}).animate({"opacity": 1})
		$("#toggleText").animate({"opacity": 1})
		$("#btns").css({"pointer-events": "auto"}).animate({"opacity": 1})
	}

	loadHome()


	// click on information
	function clickInfo(){
		if ($(this).css("opacity") > 0.9 ){
			//console.log($(this).attr("data-infoId"))

			var x = parseFloat($(this).attr("data-x"))
			var y = parseFloat($(this).attr("data-y"))
			var marginX = _W/2-2*x
			var marginY = _H/2-2*y-2*mapMarginDefault

			// map an neue Stelle schieben
			$("#mapDiv #map").stop(true).animate({"width": "200%", "margin-left": marginX+"px", "margin-top": marginY+"px", "opacity": 1}, duration = 700)

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

			$("#popup").stop(true).animate({"opacity": 1}, duration = 500);
			$("#popup").css({"pointer-events" : "auto"})

			// im popup informationen anpassen
			$("#popup h2").html($(this).children("h2").html())

			// auf produktions-tab resetten
			$("#popup h3").removeClass("activebtn")
			$("#popup .preselected").addClass("activebtn")
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
	$("#mapDiv #background").on("click", loadHome)

	// click on toggle
	function toggleViews(){
		console.log("toggle");
		if ($(this).attr("src") == "img/list_filled.png"){
			$(this).attr({"src": "img/world_filled.png"})
			//$("#toggleText").html("Karte")
			$("#technical").stop(true).css({"pointer-events": "auto", "margin-top": "700px", "display": "block"}).animate({"margin-top" : "100px"}, 400)
		} else {
			$(this).attr({"src": "img/list_filled.png"})
			//$("#toggleText").html("Liste")
			$("body").css({"overflow": "hidden"})
			$("#technical").stop(true).animate({"margin-top" : "700px"}, 400, function(){
				$(this).css({"pointer-events": "none", "display": "none"})
				$("body").css({"overflow": "visible"})
			})
		}
	}
	$("#toggle").on("touchend", toggleViews)


	// click on btn
	function clickOnBtn(givenNumber){

		var number = givenNumber
		if (jQuery.type(givenNumber) != "number"){
			number = $(this).attr("data-btn")
		}
		$(this).siblings().children("img").attr({"src": "img/radio_off.png"})
		$(this).children("img").attr({"src": "img/radio_on.png"})

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

			// rohmaterialien erfinden
			for(i = 0; i < parseInt(Math.random()*20+10); i++){
				$(".infoMaterials").children("div:eq(0)").children("ul").append("<li> " + materialListe[parseInt(Math.random()*10)] + " </li>")
			}

			// materialbalken anhängen
			$(".infoMaterials").children("div:eq(0)").children("ul").children("li").each(function(index, value){
				var completeNumber = parseInt(Math.random()*120+10)/10
				$(".infoMaterials").children("div:eq(1)").children("ul").append("<li><div class = 'empty'><div class = 'full'><div class = 'used'><p>aa</p></div><p>bb</p></div><p>"+completeNumber+" t</p></div></li>")
				// $(".infoMaterials").children("div:eq(2)").children("ul").append ("<li>"+Math.floor(Math.random()*100)+" t</li>").children("li").css({"right": "100px"})
				// $(".infoMaterials").children("div:eq(3)").children("ul").append ("<li>"+Math.floor(Math.random()*100)+"%</li>")
				// $(".infoMaterials").children("div:eq(4)").children("ul").append ("<li>"+Math.floor(Math.random()*100)+"%</li>")
			})

			// kleine balken laden
			$("#popup .full").each(function(index, value){
				var fullPercentage = parseInt(Math.random()*30+60)
				$(this).css({"width": 0}).animate({"width": Math.random()*30+60+"%"}, duration = fullPercentage*10)
				$(this).children("p").html(parseFloat(parseInt(0.1*fullPercentage*(parseFloat($(this).siblings("p").html())))/10) + " t")
			})
			$("#popup .used").each(function(index, value){
				var usedPercentage = parseInt(Math.random()*80+10)
				$(this).css({"width": 0}).animate({"width": usedPercentage+"%"}, duration = usedPercentage*10+200)
				$(this).children("p").html(parseFloat(parseInt(0.1*usedPercentage*(parseFloat($(this).siblings("p").html())))/10) + " t")
				// diesen wert noch von dem in der mitte abziehen?
				$(this).siblings("p").html(Math.floor(10*(parseFloat($(this).siblings("p").html())-parseFloat($(this).children("p").html())))/10 + " t")
			})

			$(".infoValues").hide()
			$(".infoMaterials").show()
		}
		else if (number == 5){
			$("#infoNames li").remove()
			$("#infoNames").append("<li> Linie </li><li> Produkte </li><li> Auslastung </li><li> Tonnage </li><li> Rohmaterial </li><li> Ausfälle </li><li> Downtime </li><li> Maschinen </li>")
		}
		else if (number == 6){
			$("#infoNames li").remove()
			$("#infoNames").append("<li> Bestellungen </li><li> Lieferzeit </li><li> Lagerbestand </li><li> Wartungsbedarf </li>")
		}
		else if (number == 7){
			$("#infoNames li").remove()
			$("#infoNames").append("<li> Produktionsbestand </li><li> Verkaufspreis / kg </li><li> Herstellungskosten </li>")
		}
		else if (number == 8){
			$("#infoNames li").remove()
			$("#infoNames").append("<li> Unfälle </li><li> Krankheitstage</li><li> Alienobduktionen </li>")
		}

		// werte erfinden
		if (number >= 5 && number <= 9){
			$(".infoValues").show()
			$(".infoMaterials").hide()

			$("#valTab ul li").remove()
			$("#infoNames li").each(function(index, value){
				$("#valTab ul").each(function (index, value){
					if (Math.random() < 0.1){
						$(this).append ("<li class = 'clickableEntry'>"+Math.floor(Math.random()*100)+" •</li>")
					} else {
						$(this).append ("<li>"+Math.floor(Math.random()*100)+"</li>")
					}
				})
			})
		}

		if (number > 3){
			$(this).siblings().removeClass("activebtn")
			$(this).addClass("activebtn")
		}

	}
	clickOnBtn(1);
	$("#btns li").on("click", clickOnBtn)
	$("#popup h3").on("click", clickOnBtn)

	// click on clickableEntry
	function clickOnClickableEntry(){
		$("#popup_extended").stop().animate({"opacity": 1}, duration = 150)
		$("#popup_extended").css({"left": parseInt($(this).offset().left)-80+"px", "top": parseInt($(this).offset().top)+30+"px"})
	}
	$(document).on('click', '.clickableEntry', clickOnClickableEntry)

	function hideExtended(){
		$("#popup_extended").animate({"opacity": 0}, duration = 150)
	}
	$("#popup").on("click", hideExtended)


	// technische ansicht: spalten abwechselnd färben
	$(".countryInfo").children("ul").each(function(index1, value1){
		$(this).children("li").each(function(index2, value2){
			if (index2%2 == 0){
				$(this).css({"background-color":"#457"})
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
		var toWidth = 30
		var toOpacity = 0

		if ($(this).parent().data("originalWidth") == null){
			$(this).parent().data("originalWidth", $(this).parent().width())
		}

		if ($(this).parent().width() < 32){
			toWidth = $(this).parent().data("originalWidth")
			toOpacity = 1
		}
		$(this).parent().stop().animate({"width": toWidth+ "px"}, duration = 500)
		$(this).siblings().stop().animate({"opacity": toOpacity}, duration = 500)
	}
	$("#technical h4").on("click", toggleTechTab)



	// from the interwebs: dieses schwachsinnige kontextmenü aufhalten
	window.oncontextmenu = function(event) {
		event.preventDefault()
		event.stopPropagation()
		return false
	};



});













