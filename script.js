let siz;
function setup() {
  let wWid = Math.min(windowWidth, 500)
  createCanvas(wWid, wWid);
  noLoop()
  noFill()
  textSize(siz)
  textAlign(CENTER, CENTER)
  siz = (wWid / 6) * 0.8;
}

arr = [['', '', ''], ['', '', ''], ['', '', '']]
function draw() {
  if (isX) { // this ai is stupid and needs the handicap of first move
    let [r, c] = computerMove(isX);
    arr[r][c] = isX ? 'x' : 'o'
    moven++;
    isX = !isX
  }
  background(220);
  line(width/3, 0, width/3, height)
  line(width*2/3, 0, width*2/3, height)
  line(0, height/3, width, height/3)
  line(0, height*2/3, width, height*2/3)
  
  for (let r = 0; r < 3; r++)
	for (let c = 0; c < 3; c++) {
	  y = height/6+ r*height/3;
	  x = width/6 + c*width/3;
	  switch (arr[r][c]) {
	    case 'x':
	      line(x+siz, y+siz, x-siz, y-siz)
	      line(x+siz, y-siz, x-siz, y+siz)
	    break;
	    case 'o':
	      circle(x, y, siz*2)
	    break;
	  }
	}
  
  for (let row of arr) if (winCheck(row)) return win(row[0]);
  for (let c = 0; c < 3; c++) if (winCheck(arr.map(r => r[c]))) return win(arr[0][c]);
  for (let p = 0; p < 2; p++) if (winCheck([arr[0][p ? 0 : 2], arr[1][1], arr[2][p ? 2 : 0]])) return win(arr[1][1]);
}

isX = true
function mouseClicked() {
  if (isX) return;
  c = Math.floor(mouseX/(width/3))
  r = Math.floor(mouseY/(height/3))
  if (arr[r][c] != '') return; 
  arr[r][c] = isX ? 'x' : 'o'
  lastplayermove = [r,c]
  isX = !isX
  redraw()
}

let moven = 0;
let lastplayermove = null
function computerMove(iAmX) {
	const emptyspots = [];
	for (let r = 0; r < 3; r++) emptyspots[r] = [true,true,true]

	if (arr[1][1] === '') return [1, 1];
	else emptyspots[1][1] = false;

	if (moven === 1) {
		if (lastplayermove[0] % 2 === 0 && lastplayermove[1] % 2 === 0) return Math.random() < 0.5 ? [lastplayermove[0], 1] : [1, lastplayermove[1]];
		else if (lastplayermove[0] === 1) return [Math.random() < 0.5 ? 0 : 2, lastplayermove[1]];
		else return [lastplayermove[0], Math.random() < 0.5 ? 0 : 2];
	}

	for (let r = 0; r < 3; r++)
	for (let c = 0; c < 3; c++)
		if (arr[r][c] !== '') emptyspots[r][c] = false;

	let almostEnemyWins = [];
	function iter(items, coords) {
		let wc = almostWinCheck(items);
		if (!wc) return;
		if (wc[0] === iAmX ? 'x' : 'o') {
			return coords[wc[1]]
		} else {
			almostEnemyWins.push(coords[wc[1]])
		}
	}
	for (let r = 0; r < 3; r++) {
		let n = iter(arr[r], [[r, 0], [r, 1], [r, 2]]);
		if (n) return n;
	}
	for (let c = 0; c < 3; c++) {
		let n = iter(arr.map(r => r[c]), [[0, c], [1, c], [2, c]]);
		if (n) return n;
	}
	for (let p = 0; p < 2; p++) {
		let co = [[0, p ? 0 : 2], [1, 1], [2, p ? 2 : 0]];
		let n = iter(co.map(([r,c]) => arr[r][c]), co);
		if (n) return n;
	}
	if (almostEnemyWins.length > 0) return almostEnemyWins[0];
	let spots = emptyspots.flatMap((row, r) => row.map((cell, c) => cell ? [r,c] : null).filter(c=>c));
	return spots[Math.floor(Math.random() * spots.length)];
}

function almostWinCheck(spaces) {
	let items = new Set(spaces);
	items.delete('')
	outer:
	for (let item of items) {
		let otherindex = -1;
		for (let i = 0; i < spaces.length; i++) {
			if (spaces[i] !== item) {
				if (spaces[i] !== '') continue outer;
				if (otherindex !== -1) continue outer;
				otherindex = i;
			}
		}
		if (otherindex !== -1) return [item, otherindex];
	}
	return null;
}

function winCheck(spaces) {
	return (spaces[0] != '' && spaces[0] === spaces[1] && spaces[1] === spaces[2]) ? spaces[0] : null;
}

function win(player) {
	if (!player) return;
  background(0)
  fill(0xfff)
  text(player+" Wins!", width/2, height/2)
  noFill()
}
