
export const createDocument = (title = '', tag = 'ng-static') => `
<!doctype html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <${tag}></${tag}>
  </body>
</html>`;
