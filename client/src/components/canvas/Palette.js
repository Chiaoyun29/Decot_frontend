import React from "react";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "./constants";

const Palette=({ onShapeSelect })=>{
  const handleDragStart = (event, type) => {
    //const type = event.target.dataset.shape;
    // x,y coordinates of the mouse pointer relative to the position of the padding edge of the target node
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;

    // dimensions of the node on the browser
    const clientWidth = event.target.clientWidth;
    const clientHeight = event.target.clientHeight;

    const dragPayload = JSON.stringify({
      type,
      offsetX,
      offsetY,
      clientWidth,
      clientHeight,
    });

    event.nativeEvent.dataTransfer.setData(DRAG_DATA_KEY, dragPayload);
    onShapeSelect(type);
  };

  return (
    <div className="palette">
      <h1>Shapes</h1>
      <div
        className="shape rectangle"
        data-shape={SHAPE_TYPES.RECT}
        draggable
        onDragStart={(event)=>handleDragStart(event, SHAPE_TYPES.RECT)}
      >
      </div>
      <div
        className="shape circle"
        data-shape={SHAPE_TYPES.CIRCLE}
        draggable
        onDragStart={(event)=>handleDragStart(event, SHAPE_TYPES.CIRCLE)}
      >
      </div>
    </div>
  );
};

export default Palette;