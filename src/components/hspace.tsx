import * as React from "react";

const HSpace = ({ width = "2px" }: Pick<React.CSSProperties, "width">) => (
  <span style={{ display: "inline-block", width }} />
);

export default HSpace;
