<?php

include('simple_html_dom.php');

function getRSSFeed($feed_url,$file,$feedTitle) {
	
	$content = file_get_contents($feed_url);
	$x = new SimpleXmlElement($content);

	if (sizeof($x->channel->item) > 3) {

		$getNews = array();
		$getNews["title"] = $feedTitle;

		foreach($x->channel->item as $entry) {
			$temp["title"] = $entry->title."";
			$temp["description"] = $entry->description."";
			$temp["link"] = $entry->link."";
			$t = strtotime($entry->pubDate."");
			$temp["date"] = date('d. F Y',$t);
			$getNews["items"][] = $temp;
		}

		$getNews = json_encode($getNews);
		$file = fopen($file,"w");
		fwrite($file,$getNews);
		fclose($file);

	}
	
}

if (filemtime("kunststoffeDE.data") < (time()-3600)) {
	getRSSFeed("https://www.kunststoffe.de/en/news/overview/rss","kunststoffeDE.data","kunststoffe.de");
}

if (filemtime("plasticseuropeORG.data") < (time()-10)) {
	getRSSFeed("http://www.plasticseurope.org/dmz/rss.aspx?FeeRef=MENU&FeeFilter=10448","plasticseuropeORG.data","plasticseurope.org");
}



$coperionFile = "coperion.data";

function getCoperionFeed($feed_url, $coperionFile) {
	
	$html = file_get_html($feed_url);
	$coperionNews = array();

	foreach($html->find('div.news-latest-item') as $e)  {
		
		$text = explode(" &ndash; ", $e->find("p")[0]->innertext);

		$t = strtotime($text[0]);
		$temp["date"] = date('d. F Y',$t);
		$temp["title"] = $e->find("h2 a")[0]->innertext;
		$temp["description"] = htmlspecialchars($text[1]);
		$temp["link"] = $entry->link."";
		$coperionNews["items"][] = $temp;
	}

	$coperionNews = json_encode($coperionNews);
	$file = fopen($coperionFile,"w");
	fwrite($file,$coperionNews);
	fclose($file);

}

if (filemtime($coperionFile) < (time()-3600)) {
	getCoperionFeed("http://www.coperion.com/news/", $coperionFile);
}




$weatherFile = "weather.data";
function loadWeather($places, $weatherFile) {

	$apiKey = "67dc5ac222e7244ea37a69deaf88a290";
	$check == true;
	$newPlaces = array(); 

	foreach ($places as $place) {
	
		$html = file_get_contents("http://api.openweathermap.org/data/2.5/forecast/city?q=".urlencode($place)."&APPID=".$apiKey);
		$html = json_decode($html);
		
		if (sizeof($html->list) > 0) {

			$temp = array();

			$temp["name"] = $place;
			$tempIn = floatval($html->list[0]->main->temp) - 273.15;
			$temp["temp"] = sprintf("%.1f",$tempIn);
			$temp["weather"] = $html->list[0]->weather[0]->main;

			$newPlaces[$place] = $temp;

		} else {

			$check = false;
			break;

		}

	}

	$newPlaces = json_encode($newPlaces);
	$file = fopen($weatherFile,"w");
	fwrite($file,$newPlaces);
	fclose($file);

}


if (filemtime($weatherFile) < (time()-3600)) {
	$places = array("Cologne","Houston","Valencia","São Paulo","Yulin");
	loadWeather($places,$weatherFile);
}

?>