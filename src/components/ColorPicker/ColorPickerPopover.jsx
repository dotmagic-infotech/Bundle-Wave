// React Imports
import React, { useState } from "react";

// Shopify Imports
import { Popover, Text } from "@shopify/polaris";

// Third party Imports
import { ColorPicker } from "react-pick-color";

const ColorPickerPopover = ({ color, onChange, lable }) => {
  // state
  const [active, setActive] = useState(false);

  const togglePopover = () => setActive((prev) => !prev);

  return (
    <Popover
      active={active}
      activator={
        <div>
          <p style={{ marginBottom: "3px" }}>{lable}</p>
          <div
            onClick={togglePopover}
            style={{
              border: "1px solid #b7b7b7",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              borderRadius: "6px",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: color,
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <Text as="h3" variant="headingMd">
              {color}
            </Text>
          </div>
        </div>
      }
      onClose={() => setActive(false)}
    >
      <Popover.Pane fixed>
        <div style={{ padding: "10px" }}>
          <ColorPicker
            color={color}
            onChange={(newColor) => onChange(newColor.hex)}
          />
        </div>
      </Popover.Pane>
    </Popover>
  );
};

export default ColorPickerPopover;
