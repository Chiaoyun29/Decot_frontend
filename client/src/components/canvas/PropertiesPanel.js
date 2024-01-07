import React, { useCallback } from "react";
import { useShapes, updateAttribute } from "./state";

const shapeSelector = (state) => state.shapes[state.selected];

export function PropertiesPanel() {
  const selectedShape = useShapes(shapeSelector);

  const updateAttr = useCallback((event) => {
    const attr = event.target.name;

    updateAttribute(attr, event.target.value);
  }, []);

  return (
    <aside className="fixed top-16 right-0 bottom-0 w-64 overflow-y-auto bg-white shadow-lg p-4 md:w-48 sm:w-32">
      <h2><b>Properties</b></h2>
      <div className="properties">
        {selectedShape ? (
          <>
            <div className="key">
              Type <span className="value">{selectedShape.type}</span>
            </div>

            <div className="key">
              Stroke{" "}
              <input
                className="value"
                name="stroke"
                type="color"
                value={selectedShape.stroke}
                onChange={updateAttr}
              />
            </div>

            <div className="key">
              Fill{" "}
              <input
                className="value"
                name="fill"
                type="color"
                value={selectedShape.fill}
                onChange={updateAttr}
              />
            </div>
          </>
        ) : (
          <div className="no-data">Nothing is selected</div>
        )}
      </div>
    </aside>
  );
};