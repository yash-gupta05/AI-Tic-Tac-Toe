import React, { useEffect, useState } from 'react';
import { Button, CardDeck, Container, Row, Card, Modal, DropdownButton, Dropdown, Jumbotron, ListGroup, ListGroupItem } from "react-bootstrap";
import Grid from "./Grid";
import { emptyIndexies, minimax, winning } from "./ticTacToe/minMax";

export const HUMAN_PLAYER = "human";
export const AI_PLAYER = "ai";
export const HUMAN_PLAYER_SYMBOL = "O";
export const AI_PLAYER_SYMBOL = "X";

const mapPlayer = {
  ai: "Computer",
  human: "Human"
};

function App() {
  const [grid, setGrid] = useState([0,1,2,3,4,5,6,7,8]);
  const [player, setPlayer] = useState(HUMAN_PLAYER);
  const [depth, setDepth] = useState(1);
  const [submit, setSubmit] = useState(false);
  const [win, setWin] = useState("");
  const [flashIndices, setFlashIndices] = useState([]);
  const [move, setMove] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false); // ✅ new state

  const setDepthFn = (evtKey) => { setDepth(Number(evtKey)); setSubmit(false); };
  const setPlayerFn = (evtKey) => {
    setPlayer(evtKey);
    setSubmit(false);
    setGrid([0,1,2,3,4,5,6,7,8]);
    setFlashIndices([]);
  };

  const onClick = (index) => {
  if (grid[index] === "X" || grid[index] === "O") return;

  updateGrid(index, HUMAN_PLAYER_SYMBOL);
  setPlayer(AI_PLAYER);

  // ✅ Turn off suggestion once move is made
  setShowSuggestion(false);
  setMove(""); 
};


  const updateGrid = (index, value) => {
    const newGrid = [...grid];
    newGrid[index] = value;
    setGrid(newGrid);

    if (winning(newGrid, HUMAN_PLAYER_SYMBOL)) {
      getFlashIndices(newGrid);
      setWin(HUMAN_PLAYER);
      handleShow();
      setMove("");
    }
    if (winning(newGrid, AI_PLAYER_SYMBOL)) {
      getFlashIndices(newGrid);
      setWin(AI_PLAYER);
      handleShow();
      setMove("");
    }
  };

  useEffect(() => {
    if(player === HUMAN_PLAYER && showSuggestion) {  // ✅ only if toggled ON
      const tempGrid = [...grid];
      const suggestedMove = minimax(tempGrid, HUMAN_PLAYER_SYMBOL, 100);
      setSuggestMove(suggestedMove.index);
    } else {
      setMove(""); // clear suggestion if OFF
    }

    if(player === AI_PLAYER) {
      const tempGrid = [...grid];
      const aiMove = minimax(tempGrid, AI_PLAYER_SYMBOL, depth);
      updateGrid(aiMove.index, AI_PLAYER_SYMBOL);

      if(aiMove.score === 0 && emptyIndexies(grid).length < 2) {
        handleDShow();
      }
      setPlayer(HUMAN_PLAYER);
    }
  }, [submit, player, grid, depth, showSuggestion]); // ✅ include showSuggestion

  const setSuggestMove = (value) => {
    const mapping = [
      "1st row 1st col", "1st row 2nd col", "1st row 3rd col",
      "2nd row 1st col", "2nd row 2nd col", "2nd row 3rd col",
      "3rd row 1st col", "3rd row 2nd col", "3rd row 3rd col"
    ];
    setMove(value >=0 && value < 9 ? mapping[value] : "");
  };

  function getFlashIndices(currentGrid) {
    const combos = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for(const combo of combos){
      if(currentGrid[combo[0]] === currentGrid[combo[1]] &&
         currentGrid[combo[1]] === currentGrid[combo[2]]) {
        setFlashIndices(combo);
        return;
      }
    }
    setFlashIndices([]);
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const winModal = () => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Game Ends</Modal.Title>
      </Modal.Header>
      <Modal.Body>{win === HUMAN_PLAYER ? "Congratulations, you won!" : "Oops, you lost!"}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );

  const [showD, setShowD] = useState(false);
  const handleDClose = () => setShowD(false);
  const handleDShow = () => setShowD(true);

  const drawModal = () => (
    <Modal show={showD} onHide={handleDClose}>
      <Modal.Header closeButton>
        <Modal.Title>Game Ends</Modal.Title>
      </Modal.Header>
      <Modal.Body>Match Drawn!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );

  const newGame = () => {
    setSubmit(true);
    setDepth(1);
    setGrid([0,1,2,3,4,5,6,7,8]);
    setPlayer(HUMAN_PLAYER);
    setFlashIndices([]);
    setShowSuggestion(false);   // ✅ reset suggestion toggle
};


  const borderLessCard = { border: 0, alignItems: 'center' };

  return (
    <Container className="p-4">
      <Jumbotron>
        <h1>Hello, hooman!</h1>
        <p>AI powered Tic-Tac-Toe Game.</p>
      </Jumbotron>
      <CardDeck>
        <Card border="secondary" style={{width: '18rem'}}>
          <Card.Body>
            <Row>
              <DropdownButton id="dropdown-player" title="Player" variant="success" size="lg" style={{marginRight: 10}}>
                <Dropdown.Item as="button" eventKey={HUMAN_PLAYER} onSelect={setPlayerFn}>Human (O)</Dropdown.Item>
                <Dropdown.Item as="button" eventKey={AI_PLAYER} onSelect={setPlayerFn}>Computer (X)</Dropdown.Item>
              </DropdownButton>
              <DropdownButton id="dropdown-depth" title="Depth/Level" variant="info" size="lg" style={{marginRight: 10}}>
                <Dropdown.Item as="button" eventKey="1" onSelect={setDepthFn}>Easy</Dropdown.Item>
                <Dropdown.Item as="button" eventKey="5" onSelect={setDepthFn}>Medium</Dropdown.Item>
                <Dropdown.Item as="button" eventKey="100" onSelect={setDepthFn}>Hard</Dropdown.Item>
              </DropdownButton>
            </Row>
          </Card.Body>
          <Card.Body>
            <Card.Title>Selections Made</Card.Title>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Player: {mapPlayer[player]}</ListGroupItem>
              <ListGroupItem>Depth: {depth !== 100 ? depth : "MAX"}</ListGroupItem>
              <ListGroupItem>
                Suggested Move: {showSuggestion ? move : ""}
              </ListGroupItem>
            </ListGroup>
          </Card.Body>
          <Card.Body className="d-flex flex-column">
          <Button 
            size="lg" 
            variant={showSuggestion ? "danger" : "success"} 
            onClick={() => setShowSuggestion(!showSuggestion)}
            className="mb-2 w-100"   // ✅ full width + margin bottom
          >
            {showSuggestion ? "Hide Suggestion" : "Show Suggestion"}
          </Button>

          <Button 
            size="lg" 
            variant="warning" 
            onClick={newGame}
            className="w-100"        // ✅ full width
          >
            New Game
          </Button>
        </Card.Body>
        </Card>
        <Card style={borderLessCard}>
          <Grid grid={grid} clickHandler={onClick} flashIndices={flashIndices}/>
        </Card>
        {show && winModal()}
        {showD && drawModal()}
      </CardDeck>
    </Container>
  );
}

export default App;
