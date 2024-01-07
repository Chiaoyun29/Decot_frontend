import React from "react";

import { SHAPE_TYPES } from "./constants";

export function Palette({ onSelectShape }) {
  const handleShapeClick = (shapeType) =>{
    onSelectShape(shapeType);
    console.log(shapeType);
  }

  return (
    <aside className="palette">
      <h2><b>Shapes</b></h2>
      <div
        className="shape rectangle"
        data-shape={SHAPE_TYPES.RECT}
        // draggable
        // onDragStart={handleDragStart}
        onClick={() => handleShapeClick(SHAPE_TYPES.RECT)}
      />
      <div
        className="shape circle"
        data-shape={SHAPE_TYPES.CIRCLE}
        // draggable
        // onDragStart={handleDragStart}
        onClick={() => handleShapeClick(SHAPE_TYPES.CIRCLE)}
      />
    </aside>
  );
}