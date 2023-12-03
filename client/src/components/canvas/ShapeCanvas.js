import React, { useCallback } from "react";
import { Layer, Stage } from "react-konva";
import { useShapes, createCircle, createRectangle, clearSelection } from "./state";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "./constants";
import Shape from "./Shape";

const handleDragOver = (event)=>event.preventDefault();

const ShapeCanvas=({ stageRef })=>{
    const shapes = useShapes((state) => Object.entries(state.shapes));

    const handleDrop = useCallback((event)=>{
        const draggedData = event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);
        if(draggedData){
          const{ offsetX, offsetY, type, clientHeight, clientWidth }=JSON.parse(draggedData);
          stageRef.current.setPointersPositions(event);
          const coords = stageRef().current.getPointerPosition();
          if(type===SHAPE_TYPES.RECT){
            createRectangle({
              X: coords.X - offsetX,
              y: coords.y - offsetY,
              width: clientWidth,  // Add width and height properties if needed
              height: clientHeight,
            });
          }else if(type===SHAPE_TYPES.CIRCLE){
            createCircle({
              x: coords.x - (offsetX - clientWidth / 2),
              y: coords.y - (offsetY - clientHeight / 2),
              radius: clientWidth/2,
            });
          }
        }
      }, []);

    return(
        <div className="canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
            <Stage
                // width={window.innerWidth-400}
                // height={window.innerheight}
                onClick={clearSelection}
                >
                <Layer>
                    {shapes.map(([key, shape]) => (
                        <Shape key={key} shape={{ ...shape, id: key }} />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default ShapeCanvas;