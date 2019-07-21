import * as React from 'react';
import * as Remarkable from 'remarkable';

export const ReactMarkdown = ({ source }: { source: string }) => (
  <div dangerouslySetInnerHTML={{ __html: new Remarkable().render(source) }} />
);
