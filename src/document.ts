
export interface DocumentConfig {
  tag: string;
  title?: string;
  headTags?: string[];
}

export const createDocument = ({ title = '', tag = 'ng-static', headTags = [] }: DocumentConfig) => `
<!doctype html>
<html>
  <head>
    <title>${title}</title>
    ${headTags.join('')}
  </head>
  <body>
    <${tag}></${tag}>
  </body>
</html>`;
