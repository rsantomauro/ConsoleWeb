// original work https://www.codeproject.com/Articles/1066735/Command-Console-in-your-browser-via-HTML-Canvas-J
//console.js

var ctx = null;
var theCanvas = null;
var lineHeight = 20;

var widthOffset = 2;
var cursorWidth = 8;
var cursorHeight = 3;
var fontColor = "#C0C0C0";
var outputFont = '11pt Consolas';
//var outputFont = '12pt Tahoma';
//var outputFont = '9pt Courier New';
var charWidth;

var allUserCmds = [ ]; // array of strings to hold the commands user types
var currentCmd = ""; // string to hold current cmd user is typing

//var PROMPT = "c:\\>";
var PROMPT = "user@domain:/home/user$";
var promptWidth = null;
var promptPad = 3;
var leftWindowMargin = 2;
var cursor = null;
window.addEventListener("load", initApp);
var flashCounter = 1;

// line of code
var currentLineOfCode = "";

function initApp()
{
	theCanvas = document.getElementById("gamescreen");
	ctx = theCanvas.getContext("2d");
	ctx.font = outputFont;
	var metrics = ctx.measureText("W");
	// rounded to nearest int
	charWidth = Math.ceil(metrics.width);
	// promptWidth = charWidth * PROMPT.length + promptPad;
	// cursor position fixed
	promptWidth = charWidth * (PROMPT.length-2) + promptPad;
	cursor = new appCursor({x:promptWidth,y:lineHeight,width:cursorWidth,height:cursorHeight});

	window.addEventListener("resize", draw);
	window.addEventListener("keydown",keyDownHandler);
	window.addEventListener("keypress",showKey);
	initViewArea();
	setInterval(flashCursor,300);
	function appCursor (cursor){
		this.x = cursor.x;
		this.y = cursor.y;
		this.width = cursor.width;
		this.height = cursor.height;
	}
}

function drawNewLine(){
	ctx.font = outputFont;
	ctx.fillStyle = fontColor;
	var textOut = PROMPT;
	ctx.fillText  (textOut,leftWindowMargin, cursor.y + lineHeight);
}

function drawPrompt(Yoffset)
{
	ctx.font = outputFont;
	ctx.fillStyle = fontColor;
	var textOut = PROMPT;
	ctx.fillText  (textOut,leftWindowMargin, Yoffset * lineHeight);
}

function blotPrevChar(){
	blotOutCursor();
	ctx.fillStyle = "#000000";
	cursor.x-=charWidth;
	ctx.fillRect(cursor.x,cursor.y-(charWidth + widthOffset),cursor.width+3,15);
}

function blotOutCursor(){
	ctx.fillStyle = "#000000";
	ctx.fillRect(cursor.x,cursor.y,cursor.width,cursor.height);
}

function keyDownHandler(e){
	
	var currentKey = null;
	if (e.code !== undefined)
	{
		currentKey = e.code;
		console.log("e.code : " + e.code);
	}
	else
	{
		currentKey = e.keyCode;
		console.log("e.keyCode : " + e.keyCode);
	}
	console.log(currentKey);
	// handle backspace key
	if((currentKey === 8 || currentKey === 'Backspace') && document.activeElement !== 'text') {
			e.preventDefault();
			// promptWidth is the beginning of the line with the c:\>
			if (cursor.x > promptWidth)
			{
				blotPrevChar();
				if (currentCmd.length > 0)
				{
					currentCmd = currentCmd.slice(0,-1);
				}
			}
	}
	currentLineOfCode=currentLineOfCode+currentKey;
	console.log(currentLineOfCode);
	// handle <ENTER> key
	if (currentKey == 13 || currentKey == 'Enter')
	{
		// Chequeo ls
		if (currentLineOfCode == 'KeyLKeySEnter'){
			ctx.font = outputFont;
			ctx.fillStyle = fontColor;

			ctx.fillText  ("Hola",cursor.x, cursor.y);
			cursor.x += charWidth;
			currentCmd += String.fromCharCode(currentLineOfCode.charCode);
			currentLineOfCode = "";
		}
		blotOutCursor();
		drawNewLine();
		cursor.x=promptWidth-charWidth;
		cursor.y+=lineHeight;
		if (currentCmd.length > 0)
		{
			allUserCmds.push(currentCmd);
			currentCmd = "";
		}
	}
}

function showKey(e){
	blotOutCursor();

	ctx.font = outputFont;
	ctx.fillStyle = fontColor;

	ctx.fillText  (String.fromCharCode(e.charCode),cursor.x, cursor.y);
	cursor.x += charWidth;
	currentCmd += String.fromCharCode(e.charCode);
}

function flashCursor(){
	
	var flag = flashCounter % 3;

	switch (flag)
	{
		case 1 :
		case 2 :
		{
			ctx.fillStyle = fontColor;
			ctx.fillRect(cursor.x,cursor.y,cursor.width, cursor.height);
			flashCounter++;
			break;
		}
		default:
		{
			ctx.fillStyle = "#000000";
			ctx.fillRect(cursor.x,cursor.y,cursor.width, cursor.height);
			flashCounter= 1;
		}
	}
}
function cursor (cursor){
	this.x = cursor.x;
	this.y = cursor.y;
	this.width = cursor.width;
	this.height = cursor.height;
}

function initViewArea() {
	
	
	// the -5 in the two following lines makes the canvas area, just slightly smaller
	// than the entire window.  this helps so the scrollbars do not appear.
	ctx.canvas.width  =  window.innerWidth-5;
	ctx.canvas.height = window.innerHeight-5;
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
	
	ctx.font = outputFont;
	ctx.fillStyle = fontColor;
	var textOut = PROMPT;

	ctx.fillText  (textOut,leftWindowMargin, cursor.y);
	draw();
}

function draw()
{
	ctx.canvas.width  = window.innerWidth-5;
	ctx.canvas.height = window.innerHeight-5;
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
	ctx.font = outputFont;
	ctx.fillStyle = fontColor;
	
	for (var i=0;i<allUserCmds.length;i++)
	{
		drawPrompt(i+1);
		if (i == 0)
		{
			xVal = promptWidth;
		}
		else
		{
			xVal = promptWidth-charWidth;
		}
			
		ctx.font = outputFont;
		ctx.fillStyle = fontColor;
		for (var letterCount = 0; letterCount < allUserCmds[i].length;letterCount++)
		{
			ctx.fillText(allUserCmds[i][letterCount], xVal, lineHeight * (i+1));
			xVal+=charWidth;
		}
	}
	if (currentCmd != "")
	{
		drawPrompt(Math.ceil(cursor.y/lineHeight));
		ctx.font = outputFont;
		ctx.fillStyle = fontColor;
		xVal = promptWidth-charWidth;
		for (var letterCount = 0; letterCount < currentCmd.length;letterCount++)
		{
			ctx.fillText(currentCmd[letterCount], xVal, cursor.y);
			xVal += charWidth;
		}
	}
	else
	{
		drawPrompt(Math.ceil(cursor.y/lineHeight));
	}
}