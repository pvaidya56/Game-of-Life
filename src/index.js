import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ButtonToolbar, Dropdown } from 'react-bootstrap';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import Card from 'react-bootstrap/Card'

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  }
  render() {
    return (
      <div className={this.props.boxClass}
      id={this.props.id}
      onClick={this.selectBox}
      />
    )
  }
}
class Grid extends React.Component {
  render() {
    const width = (this.props.cols * 16) + 1;
    var rowsArr = [];

    var boxClass = "";
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;
        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box 
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }
    return (
      <div className="grid" style={{width: width}}>
        {rowsArr}
        
      </div>
    )
  }
}

class Buttons extends React.Component {
  handleSelect = (e) => {
    this.props.gridSize(e);
  }
  render() {
    return (
      <div className="center">
        <ButtonToolbar>
          <button className="btn btn-default" onClick={this.props.playButton}>
            Play
          </button>
          <button className="btn btn-default" onClick={this.props.pauseButton}>
					  Pause
					</button>
					<button className="btn btn-default" onClick={this.props.clear}>
					  Clear
					</button>
					<button className="btn btn-default" onClick={this.props.slow}>
					  Slow
					</button>
					<button className="btn btn-default" onClick={this.props.fast}>
					  Fast
					</button>
					<button className="btn btn-default" onClick={this.props.seed}>
					  Seed
					</button>
          <DropdownMenu title="Grid Size" id="size-menu"
            onSelect={this.handleSelect}> Grid Size
              <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
              <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
              <Dropdown.Item eventKey="3">70x50</Dropdown.Item>
            </DropdownMenu>
        </ButtonToolbar>
      </div>
    )
  }
}
class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy
    })
  }

  seed = () => {
    console.log("SEED")
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++){
        if(Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy
    })
  }

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  }

  pauseButton = () => {
    clearInterval(this.intervalId);

  }

  slow = () => {
    this.speed = 1000;
    this.playButton();
  }

  fast = () => {
    this.speed = 100;
    this.playButton();
  }

  clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
		});
  }
  
  gridSize = (size) => {
		switch (size) {
			case "1":
				this.cols = 20;
				this.rows = 10;
			break;
			case "2":
				this.cols = 50;
				this.rows = 30;
			break;
			default:
				this.cols = 70;
				this.rows = 50;
		}
		this.clear();

	}

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);
    //rules
    for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
        //count is how many neighbors it has
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
    }
    this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});
  }

  componentDidMount() {
    this.seed();
    this.playButton();
  }
  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize} />
          <h2>Generations: {this.state.generation}</h2>
          
        <Grid 
        gridFull={this.state.gridFull}
        rows={this.rows}
        cols={this.cols}
        selectBox={this.selectBox}
        />
        {/* <Card style={{ width: '18rem' }} class="card">
          <Card.Body>
            <Card.Text>
            Conway's Game of Life is the most known Cellular Automaton invented by the British mathematician John Conway in 1970.
												It is actually a zero-player game, its evolution is determined by its initial state, and a certain set of rules requiring no futher input afterwards. 
												One interacts with the Game of Life by creating an initial configuration and observing how it evolves.
            </Card.Text>
            <Card.Subtitle className="mb-2 text-muted">Rules:</Card.Subtitle>
            <Card.Link href="#">Card Link</Card.Link>
            <Card.Link href="#">Another Link</Card.Link>
          </Card.Body>
        </Card> */}
        <div class="card">

          <p>Conway's Game of Life is the most known Cellular Automaton invented by the British mathematician John Conway in 1970.
												It is actually a zero-player game, its evolution is determined by its initial state, and a certain set of rules requiring no futher input afterwards. 
												One interacts with the Game of Life by creating an initial configuration and observing how it evolves.</p>
          <h3 style={{color: 'black'}}>Rules: </h3>
          <ul>
            <li>Birth: Each dead cell adjacent to exactly three live neighbors will become live in the next generation.</li>
            <li>Death by isolation: Each live cell with one or fewer live neighbors will die in the next generation.</li>
            <li>Death by overpopulation: Each live cell with four or more live neighbors will die in the next generation.</li>
            <li>Survival: Each live cell with either two or three live neighbors will remain alive for the next generation.</li>
          </ul>
        </div>
      </div>
    );
  }
}

//makes a deep clone of the array
function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr))
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
