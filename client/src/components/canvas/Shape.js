import React, { useCallback } from "react";

import { SHAPE_TYPES } from "./constants";
import { useShapes } from "./state";
import Circle from "./Circle";
import Rectangle from "./Rectangle";

const Shape=({ shape })=> {
  const isSelectedSelector = useCallback(
    (state) => state.selected === shape.id,
    [shape.id] //wanna try to check whether still can drag and drop, jn shape.id
  );
  const isSelected = useShapes(isSelectedSelector);

  if (shape.type === SHAPE_TYPES.RECT) {
    return <Rectangle id={shape.id} {...shape} isSelected={isSelected} />;
  } else if (shape.type === SHAPE_TYPES.CIRCLE) {
    return <Circle id={shape.id} {...shape} isSelected={isSelected} />;
  }

  return null;
};
export default Shape;