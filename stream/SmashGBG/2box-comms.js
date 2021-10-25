var piio = new PiioConnector("2box-comms");

const imageSlug = "NFP-Commentary-1080.png";
const staticLayoutPath = "/_resources/overlays/" + imageSlug;

var isVisible = true;
var isActive = true;
var setVisibleTimeout;

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
}

function setVisible(){
	if(setVisibleTimeout){
		clearTimeout(setVisibleTimeout);
	}
	var visible = isVisible && isActive;
	setVisibleTimeout = setTimeout(() => {
		document.getElementById("nameC1").classList.toggle("hidden", !visible);
		document.getElementById('nameC2').classList.toggle("hidden", !visible);
		document.getElementById('infoC1').classList.toggle("hidden", !visible);
		document.getElementById('infoC2').classList.toggle("hidden", !visible);
	}, visible ? 1200 : 0);
}

function setLayoutType() {
	const bg = document.getElementById("bg");
	// note: can set up dynamic layout setup here
	bg.src = staticLayoutPath;
}

window.onload = init;
piio.on("scoreboard", (data) => {
    // check if new if we want to use Animated BG
	setLayoutType();
	
    // scoreboard update
    const caster1 = piio.getCaster(1);
	const caster1Info = caster1.pronoun != "" ? ( caster1.twitter != "" ? `${caster1.pronoun} ・ ${caster1.twitter}` : caster1.pronoun) : caster1.twitter;
	const caster1Teams = piio.getPlayerTeams(caster1);
	const caster1Name = caster1.getDisplayName(caster1Teams, 'sponsor');
	document.getElementById('nameC1').insertValueResize(caster1Name);
	document.getElementById('infoC1').insertValueResize(caster1Info);
	
	const caster2 = piio.getCaster(2);
	const caster2Info = caster2.pronoun != "" ? ( caster2.twitter != "" ? `${caster2.pronoun} ・ ${caster2.twitter}` : caster2.pronoun) : caster2.twitter;
	const caster2Teams = piio.getPlayerTeams(caster2);
    const caster2Name = caster2.getDisplayName(caster2Teams, 'sponsor');
	document.getElementById('nameC2').insertValueResize(caster2Name);
    document.getElementById('infoC2').insertValueResize(caster2Info);
});