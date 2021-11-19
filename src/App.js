import React, { Component } from 'react';
import './App.css';

class Board extends Component 
{
	renderSquare(i) 
	{
		return <Square key={'square' + i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
	}

	renderRow(r)
	{
		var row = [];
		for (var i = 0; i < 8; i++) 
      		row.push(this.renderSquare(r * 8 + i));
		return (<div key={'row' + r}>{row}</div>);
	}

	renderRows() 
	{
		var rows = [];
		for (var i = 0; i < 8; i++)
			rows.push(this.renderRow(i));
		return (<div>{rows}</div>);
	}
	
	render() 
	{
    	return (<div>{this.renderRows()}</div>);
	}
}

class Game extends Component 
{
	constructor() 
	{
		super();
		const squares = Array(64).fill(null);
		squares[27] = squares[36] = 'X';
		squares[28] = squares[35] = 'O';
		this.state = {
			squares: squares,
			xIsNext: true,
			stepNumber: 0,
		};
	}

	handleClick(i) 
	{
		const squares = this.state.squares.slice();
		if (this.state.stepNumber < 60 && !squares[i])
		{
			var toWololo = this.wololo(i);
			if (toWololo.length !== 0)
			{

				var current = this.state.xIsNext ? 'X' : 'O';
				toWololo.forEach(function(square){
					squares[square] = current;
				});
				squares[i] = current;

				this.setState({
					squares: squares,
					stepNumber: this.state.stepNumber+1,
					xIsNext: !this.state.xIsNext,
				});
			}
		}
	}
	// Flip the color line if it is between the new space and existing space based on the current color.
	wololo(i)
	{
		var toWololo = Array(0);
		for (var x = -1; x < 2; x++)
		{
			for (var y = -1; y < 2; y++)
			{
				if (x !== 0 || y !== 0)
					toWololo = toWololo.concat(this.wololoLine(i, x, y));
			}
		}
		return toWololo;
	}

	wololoLine(i, xStep, yStep)
	{
		const squares = this.state.squares.slice();
		var toWololo = [];
		var found = false;
		var curr = this.state.xIsNext ? 'X' : 'O';
		var x = getX(i) + xStep, y = getY(i) + yStep;
		while (!found && x >= 0 && x < 8 && y >= 0 && y < 8)
		{
			if (!squares[getId(x,y)])
			{
				x = -1;
				toWololo = [];
			}
			else if (squares[getId(x,y)] === curr)
			{
				found = true;
			}
			else
			{
				toWololo.push(getId(x,y));
				x += xStep;
				y += yStep;
			}
		}
		if(!found)
			toWololo = [];

		return toWololo;
	}

	passTurn()
	{
		if (this.state.stepNumber <= 59)
			this.setState({ xIsNext: !this.state.xIsNext });
	}

	giveUp()
	{
		if (this.state.stepNumber <= 59)
		{		
			const squares = this.state.squares.slice();
			const fillWith = this.state.xIsNext ? 'O' : 'X';
			for(let i = 0; i < 64; i++)
				if (squares[i] === null)
					squares[i] = fillWith;
			console.log(squares);
			this.setState({ squares: squares, stepNumber: 60 });
		}
	}

	render() 
	{
		const squares = this.state.squares;
		const score = calculateScore(this.state.squares);
		const winner = calculateWinner(score);
		const displayScore = 'X: ' + score.x + ' | O: ' + score.o;
		let status;
		if (winner)
			status = <h1>Winner : { winner }</h1>
		else
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

		return (
			<div className="game" key='game'>
			<div className="game-board" key='game-board'>
				<Board squares={squares} onClick={(i) => this.handleClick(i)} />
			</div>
			<div className="game-info">
				<div>{displayScore}</div>
				<div>{status}</div>
				<button onClick={() => this.passTurn()}>Pass</button>
				<button onClick={() => this.giveUp()}>Give up</button>
			</div>
			</div>
		);
	}
}

function Square(props) 
{
	return (<button className="square" onClick={() => props.onClick()}>{props.value}</button>);
}

function getX(i)
{
	return i % 8;
}

function getY(i)
{
	return parseInt(i / 8, 10);
}

function getId(x, y)
{
	return y * 8 + x;
}

function calculateWinner(score) 
{
	var winner = null;
	if (score.o + score.x === 64)
		winner = score.x > score.o ? 'X' : 'O';
	return winner;
}

function calculateScore(squares)
{
	var x = 0, o = 0;
	squares.forEach(function(square){
		if (square === 'X')
			x++
		else if (square === 'O')
			o++;
	});
	return { x: x, o: o};
}

export default Game;