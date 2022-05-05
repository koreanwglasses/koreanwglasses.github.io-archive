import { Box, BoxProps } from "@mui/system";
import React from "react";

export const Flex = (props: BoxProps) => <Box display="flex" {...props} />;
export const ColumnFlex = (props: BoxProps) => (
  <Box display="flex" flexDirection="column" {...props} />
);
