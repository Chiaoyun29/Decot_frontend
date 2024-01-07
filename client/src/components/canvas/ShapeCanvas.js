// import React, { useCallback, useEffect } from "react";
// import { Layer, Stage } from "react-konva";
// import { useShapes, createCircle, createRectangle, clearSelection } from "./state";
// import { DRAG_DATA_KEY, SHAPE_TYPES } from "./constants";
// import Shape from "./Shape";

// const ShapeCanvas=({ drawingCanvasRef, width, height, selectedShapeType })=>{
//     const shapes = useShapes((state) => Object.entries(state.shapes));

//     useEffect(() => {
//       console.log("Adding shape type: ", selectedShapeType);
//       if (selectedShapeType) {
//         const defaultPosition = { x: 100, y: 100 }; // Default position for new shapes
//         if (selectedShapeType === SHAPE_TYPES.RECT) {
//           createRectangle({ ...defaultPosition, width: 100, height: 50 });
//         } else if (selectedShapeType === SHAPE_TYPES.CIRCLE) {
//           createCircle({ ...defaultPosition, radius: 25 });
//         }
//       }
//     }, [selectedShapeType]);

//     const handleDrop = useCallback((event)=>{
//       const draggedData = event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);
//       if(draggedData){
//         const{ offsetX, offsetY, type, clientHeight, clientWidth }=JSON.parse(draggedData);
//         stageRef.current.setPointersPositions(event);
//         const coords = stageRef.current.getPointerPosition();
//         if(type===SHAPE_TYPES.RECT){
//           createRectangle({
//             X: coords.X - offsetX,
//             y: coords.y - offsetY,
//             width: clientWidth,  // Add width and height properties if needed
//             height: clientHeight,
//           });
//         }else if(type===SHAPE_TYPES.CIRCLE){
//           createCircle({
//             x: coords.x - (offsetX - clientWidth / 2),
//             y: coords.y - (offsetY - clientHeight / 2),
//             radius: clientWidth/2,
//           });
//         }
//       }
//     }, [stageRef]);

//     const handleDragOver = (event)=>event.preventDefault();

//     return(
//       <div className="canvas-container" >
//           <Stage
//             drawingCanvasRef={drawingCanvasRef}
//             width={width}
//             height={height}
//           >
//             <Layer>
//               {shapes.map(([key, shape]) => (
//                 <Shape key={key} shape={{ ...shape, id: key }} />
//               ))}
//             </Layer>
//           </Stage>
//       </div>
//     );
// };

// export default ShapeCanvas;