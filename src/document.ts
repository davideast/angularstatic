
export const createDocument = (title = '') => `
<!doctype html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <ng-static></ng-static>
  </body>
</html>`;
