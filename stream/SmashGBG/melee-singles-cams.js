var piio = new PiioConnector("melee-singles-cams");

var isVisible = true;
var isActive = true;
var setVisibleTimeout;
var infoRotatorTimeout;

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
	infoRotatorTimeout = setTimeout(infoRotatorPronoun, 1000);
}

function setVisible(){
	if(setVisibleTimeout){
		clearTimeout(setVisibleTimeout);
	}
	var visible = isVisible && isActive;
	setVisibleTimeout = setTimeout(() => {
		document.getElementById("bestof").classList.toggle("hidden", !visible);
		document.getElementById("round").classList.toggle("hidden", !visible);
		document.getElementById('nameP1').classList.toggle("hidden", !visible);
		document.getElementById('scoreP1').classList.toggle("hidden", !visible);
		document.getElementById('nameP2').classList.toggle("hidden", !visible);
		document.getElementById('scoreP2').classList.toggle("hidden", !visible);
	}, visible ? 1200 : 0);
}

const imageSlug = "NFP-Gameplay-Overlay-Main-Cams-1080.png";
const staticLayoutPath = "/_resources/overlays/" + imageSlug;

function setLayoutType() {
	const bg = document.getElementById("bg");
	// note: can set up dynamic layout setup here
	bg.src = staticLayoutPath;
}

function infoRotatorPronoun() {
	for (let i = 1; i <= 2; i++) {
		const player = piio.getPlayer(i);
		let element = document.getElementById(`p${i}inforotate`);
		if (player.pronoun != "") {
			element.insertValueResize(player.pronoun.toLowerCase());
		} else if (player.twitter == "") {
			// display nothing if player has neither pronouns or twitter
			element.insertValueResize(" ");
		}
	}
	infoRotatorTimeout = setTimeout(infoRotatorTwitter, 8000);
}

function infoRotatorTwitter() {
	for (let i = 1; i <= 2; i++) {
		const player = piio.getPlayer(i);
		let element = document.getElementById(`p${i}inforotate`);
		if (player.twitter != "") {
			element.insertValueResize(player.twitter);
		} else if (player.pronoun == "") {
			element.insertValueResize(" ");
		}
	}
	infoRotatorTimeout = setTimeout(infoRotatorPronoun, 8000);
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

window.onload = init;
piio.on("scoreboard", (data) => {
    // check if new if we want to use Animated BG
	setLayoutType();

	// scoreboard update
	// setStocksAndPortraits()

    const bestof = piio.getFieldValue("bestof");
	const bestofText = `${bestof}`;
	document.getElementById("bestof").insertValueResize(bestofText);

    const round = piio.getFieldValue("round");
	const roundText = `${round}`;
	document.getElementById("round").insertValueResize(roundText);

	const team1Score = piio.getScore(1);
	const player1 = piio.getPlayer(1);
	const player1Teams = piio.getPlayerTeams(player1);
	player1Name = player1.getDisplayName(player1Teams, 'sponsor');
	document.getElementById('nameP1').insertValueResize(player1Name);
	document.getElementById('scoreP1').insertValueResize(team1Score);

	const player2 = piio.getPlayer(2);
	const player2Teams = piio.getPlayerTeams(player2);
	const team2Score = piio.getScore(2);
    player2Name = player2.getDisplayName(player2Teams, 'sponsor');
    document.getElementById('nameP2').insertValueResize(player2Name);
    document.getElementById('scoreP2').insertValueResize(team2Score);
});