//VARS VARS VARS

let cols, rows;
let w = 100;
let grid;
let playing = false;
let synth;
let font;

// POEM
let words = ["I", "like", "to", "think", "and", "sooner", "the", "better!",
"of", "a", "cybernetic", "meadow", "where", "mammals", "and", "computers",
"live", "together", "in", "mutually", "programming", "harmony",
"like", "pure", "water", "touching", "clear", "sky", "I", "like", "to",
 "think", "right", "now", "please!", "of", "a", "cybernetic", "forest", "filled", 
 "with", "pines", "and", "electronics", "where", "deer", "stroll", "peacefully", "past", "computers", 
 "as", "if", "they", "were", "flowers", "with", "spinning", "blossoms", "I", "like", "to", "think", "it", 
 "has", "to", "be", "of", "a", "cybernetic", "ecology", "where", "we", "are", "all", "free", "of", "our", 
 "labors", "and", "joined", "back", "to", "nature", "returned", "to", "our", "mammal", "brothers", "and", 
 "sisters", "and", "all", "watched", "over", "by", "machines", "of", "loving", "grace"];


// LOAD FONTS 
function preload() {
  font = loadFont('fonts/syntMono.otf');
}


function setup() {
  frameRate(7);
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / w);
  rows = floor(height / w);

  // Create synth with reverb
  synth = new Tone.PolySynth({
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.001,
      decay: 0.7,
      sustain: 0.9,
      release: 1
    }
  }).connect(new Tone.Reverb({
    decay: 6,
    wet: 0.90
  }).toDestination());

  createButton("life").position(width / 2 - 30, height / 2).mousePressed(startGame);
  noLoop();
}

function startGame() {
  playing = true;
  grid = createRandomGrid();
  loop();
}

function draw() {
  background(0);

  if (playing) {
    generate();
    playNotes();
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * w;

      if (grid[i][j] === 1) {
        // Display poem
        displayPoem(x, y, calculateTextSize());
        
      }
    }
  }
}

function createRandomGrid() {
  let grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
  return grid;
}

function generate() {
  let nextGen = new Array(cols);
  for (let i = 0; i < cols; i++) {
    nextGen[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let neighbors = countNeighbors(grid, i, j);

      if (state === 0 && neighbors === 3) {
        nextGen[i][j] = 1;
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGen[i][j] = 0;
      } else {
        nextGen[i][j] = state;
      }
    }
  }
  grid = nextGen;
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

let maxNotesPerGeneration = 5; // Set the maximum number of notes per generation

function playNotes() {
  let notesPlayed = 0;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 0 && random() < 0.01 && notesPlayed < maxNotesPerGeneration) {
        playRandomNote();
        notesPlayed++;
      }
    }
  }
}


function playRandomNote() {
  const scale = ["C3", "E3", "F3", "G3", "B4", "D4"];
  const randomNote = scale[floor(random(scale.length))];
  synth.triggerAttackRelease(randomNote, "16n");
}

function displayPoem(x, y, customTextSize) {
  fill(255);
  textFont(font);
  textSize(customTextSize);
  textAlign(CENTER, CENTER);
  let randomWord = words[floor(random(words.length))];
  text(randomWord, x + w / 2, y + w / 2);
}

function calculateTextSize() {
  // Adjust the text size based on the number of live cells
  let liveCellCount = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        liveCellCount++;
      }
    }
  }

  // Map live cell count to text size (adjust the values as needed)
  return map(liveCellCount, 0, cols * rows, 5, 200);
}