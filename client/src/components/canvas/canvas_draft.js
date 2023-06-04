import React, { Component } from 'react';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');

    // Customize canvas properties, such as size and background color
    canvas.width = 800;
    canvas.height = 600;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    //include gridlines
    this.drawGrid(context);

    // Add event listeners for mouse interactions
    canvas.addEventListener('mousedown', this.handleMouseDown);
    canvas.addEventListener('mousemove', this.handleMouseMove);
    canvas.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    const canvas = this.canvasRef.current;

    // Clean up event listeners when the component unmounts
    canvas.removeEventListener('mousedown', this.handleMouseDown);
    canvas.removeEventListener('mousemove', this.handleMouseMove);
    canvas.removeEventListener('mouseup', this.handleMouseUp);
  }

  drawGrid = (context) => {
    const canvas = this.canvasRef.current;
    const gridSize = 20;

    // Set grid properties
    context.lineWidth = 0.5;
    context.strokeStyle = '#e1e1e1';

    // Draw vertical grid lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }
  }
  handleMouseDown = (event) => {
    // Handle mouse down event
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');

    // Get mouse coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Perform drawing operations
    context.beginPath();
    context.moveTo(x, y);
  }

  handleMouseMove = (event) => {
    // Handle mouse move event
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');

    // Get mouse coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Perform drawing operations
    if (event.buttons === 1) {
      context.lineTo(x, y);
      context.stroke();
    }
  }

  handleMouseUp = () => {
    // Handle mouse up event
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');

    // Perform any final drawing operations or clean up
    context.closePath();
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default Canvas;