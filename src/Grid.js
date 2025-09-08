import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Row, Col } from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    flexGrow: 1,
  },
  paper: {
    height: 96.5,
    width: 98,
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 0,
  },
  paperFlash: {
    height: 96.5,
    width: 98,
    backgroundColor: "pink",
    borderColor: "black",
    borderRadius: 0,
  },
  textO: {
    textAlign: "center",
    fontSize: 50,
    color: "purple",
    fontStyle: "roman",
  },
  textX: {
    textAlign: "center",
    fontSize: 50,
    color: "red",
    fontStyle: "roman",
  },
}));

const Grid9 = ({ grid, clickHandler, flashIndices = [] }) => {
  const classes = useStyles();

  const renderCell = (index) => {
    const value = grid[index] === "O" || grid[index] === "X" ? grid[index] : "";
    const textClass = value === "O" ? classes.textO : classes.textX;
    const paperClass = flashIndices.includes(index) ? classes.paperFlash : classes.paper;

    return (
      <Col xs={3} key={index}>
        <Paper
          className={paperClass}
          variant="outlined"
          onClick={() => clickHandler(index)}
        >
          <p className={textClass}>{value}</p>
        </Paper>
      </Col>
    );
  };

  return (
    <Grid className={classes.root}>
      <Grid style={{ width: "20rem" }}>
        {[0, 3, 6].map((start) => (
          <Row key={start}>
            {Array.from({ length: 3 }, (_, i) => renderCell(start + i))}
          </Row>
        ))}
      </Grid>
    </Grid>
  );
};

export default Grid9;
