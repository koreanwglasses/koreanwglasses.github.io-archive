import { Link } from "gatsby";
import * as React from "react";

const MaybeLink = ({
  to,
  children,
}: React.PropsWithChildren<{ to?: string }>) =>
  to ? (
    <Link to={to} style={{ color: "inherit", textDecoration: "inherit" }}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  );

export default MaybeLink;
