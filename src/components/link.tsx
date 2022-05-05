import React, { forwardRef } from "react";
import { Link as MUILink, LinkProps } from "@mui/material";
import { Link as GatsbyLink } from "gatsby";

export const Link = (props: LinkProps) => {
  const isLocalHref = null === props.href?.match(/^(?:[a-z]+:)?\/\//i);
  return isLocalHref ? (
    <MUILink
      component={forwardRef<any, any>((props, ref) => (
        <GatsbyLink {...props} ref={ref} to={props.href!} />
      ))}
      {...props}
    />
  ) : (
    <MUILink {...props} />
  );
};
