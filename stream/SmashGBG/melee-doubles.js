var piio = new PiioConnector("melee-doubles");

var isVisible = true;
var isActive = true;
var setVisibleTimeout;

var teamNameRotatorTimeout;
var teamNameRotatorVar = 0;

function init() {
	if(window.obsstudio){
		window.obsstudio.onVisibilityChange = (visiblity) => {
			isVisible = visiblity;
			setVisible();
		};
		window.obsstudio.onActiveChange = (active) => {
			isActive = active;
			setVisible();
		};
	}
	teamNameRotatorTimeout = setTimeout(rotateTeamName, 1000);
}

function setVisible(){
	if(setVisibleTimeout){
		clearTimeout(setVisibleTimeout);
	}
	var visible = isVisible && isActive;
	setVisibleTimeout = setTimeout(() => {
		document.getElementById("round").classList.toggle("hidden", !visible);
		document.getElementById('nameP1').classList.toggle("hidden", !visible);
		document.getElementById('scoreP1Text').classList.toggle("hidden", !visible);
		document.getElementById('nameP2').classList.toggle("hidden", !visible);
		document.getElementById('scoreP2Text').classList.toggle("hidden", !visible);
	}, visible ? 1200 : 0);
}

const imageSlug = "NFP-Gameplay-Overlay-Doubles.png";
const staticLayoutPath = "/_resources/overlays/" + imageSlug;

function setLayoutType() {
	const bg = document.getElementById("bg");
	// note: can set up dynamic layout setup here
	bg.src = staticLayoutPath;
}

function setStocksAndPortraits() {
	const elements = [
		{
			character: piio.getCharacter(1),
			stock: document.getElementById("stockP1"), 
		},
		{
			character: piio.getCharacter(2),
			stock: document.getElementById("stockP2"), 
		},
	];

	elements.forEach((p, i) => {
		if (p.character !== null) {
			console.log(p.character);
			p.stock.src = `/namedStocks/${p.character.name} ${p.character.skins[p.character.defaultSkin]}.png`;
		} else {
			console.log("no char");
			p.stock.src = "/namedStocks/A Sandbag.png";
		}
	});
}

function rotateTeamName() {

	if(teamNameRotatorTimeout){
		clearTimeout(teamNameRotatorTimeout);
	}

	const enabled = piio.getField("teamnames").enabled;

	var visible = isVisible && isActive;
	if (!visible) {
		document.getElementById('nameP1').classList.toggle("hidden", !visible);
		document.getElementById('nameP2').classList.toggle("hidden", !visible);
		teamNameRotatorTimeout = setTimeout(rotateTeamName, 8000);
		return;
	}

	if (!enabled) {
		//const player1 = piio.getPlayer(1);
		//const player1Teams = piio.getPlayerTeams(player1);
		//player1Name = player1.getDisplayName(player1Teams, 'sponsor');
		player1Name = piio.getTeamName(1);
		document.getElementById('nameP1').insertValueResize(player1Name);
		//const player2 = piio.getPlayer(2);
		//const player2Teams = piio.getPlayerTeams(player2);
		//player2Name = player2.getDisplayName(player2Teams, 'sponsor');
		player2Name = piio.getTeamName(2);
		document.getElementById('nameP2').insertValueResize(player2Name);
	} else {
		if (teamNameRotatorVar == 0) {
			player1Name = piio.getTeamName(1);
			document.getElementById('nameP1').insertValueResize(player1Name);
			player2Name = piio.getTeamName(2);
			document.getElementById('nameP2').insertValueResize(player2Name);
			teamNameRotatorVar = 1;
		} else {
			player1Name = piio.getTeamPlayers(1).map(player => player.name).join(" / ");
			document.getElementById('nameP1').insertValueResize(player1Name);
			player2Name = piio.getTeamPlayers(2).map(player => player.name).join(" / ");
			document.getElementById('nameP2').insertValueResize(player2Name);
			teamNameRotatorVar = 0;
		}
	}

	teamNameRotatorTimeout = setTimeout(rotateTeamName, 8000);
}

window.onload = init;
piio.on("scoreboard", (data) => {
    // check if new if we want to use Animated BG
	setLayoutType();

	// scoreboard update
	// setStocksAndPortraits()

    const round = piio.getFieldValue("round");
	const roundText = `${round}`;
	document.getElementById("round").insertValueResize(roundText);

	const leftcolor  = piio.getFieldValue("leftcolor");
	const rightcolor = piio.getFieldValue("rightcolor");
	/* 
		No Color -> white (#231f20 text)
		Red      -> #d1212c (white text)
		Green    -> #15a411 (white text)
		Blue     -> #216fd1 (white text)
	*/
	
	if (leftcolor == 'No Color') { 
		document.getElementById('scoreP1').style.background = "#242424";
		document.getElementById('scoreP1').style.color = "#efefef";
	}
	if (rightcolor == 'No Color') { 
		document.getElementById('scoreP2').style.background = "#242424";
		document.getElementById('scoreP2').style.color = "#efefef";
	}

	if (leftcolor == 'Red') { 
		document.getElementById('scoreP1').style.background = "#d1212c";
		document.getElementById('scoreP1').style.color = "#ffffff";
	}
	if (rightcolor == 'Red') { 
		document.getElementById('scoreP2').style.background = "#d1212c";
		document.getElementById('scoreP2').style.color = "#ffffff";
	}

	if (leftcolor == 'Green') { 
		document.getElementById('scoreP1').style.background = "#15a411";
		document.getElementById('scoreP1').style.color = "#ffffff";
	}
	if (rightcolor == 'Green') { 
		document.getElementById('scoreP2').style.background = "#15a411";
		document.getElementById('scoreP2').style.color = "#ffffff";
	}

	if (leftcolor == 'Blue') { 
		document.getElementById('scoreP1').style.background = "#216fd1";
		document.getElementById('scoreP1').style.color = "#ffffff";
	}
	if (rightcolor == 'Blue') { 
		document.getElementById('scoreP2').style.background = "#216fd1";
		document.getElementById('scoreP2').style.color = "#ffffff";
	}

	const team1Score = piio.getScore(1);
	document.getElementById('scoreP1Text').insertValueResize(team1Score);

	const team2Score = piio.getScore(2);
    document.getElementById('scoreP2Text').insertValueResize(team2Score);
});