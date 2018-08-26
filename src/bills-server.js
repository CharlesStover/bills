const fs = require('fs');
const http = require('http');

const payers = fs.readFileSync('payments/_.txt', { encoding: 'utf8' })
  .trim()
  .split(/\r?\n/);
const paid = Object.create(null);

for (const payer of payers) {
  paid[payer] = fs.readFileSync('payments/' + payer + '.txt', { encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .reduce((total, amount) => total + parseFloat(amount), 0);
}

http.createServer((request, response) => {

  // index.html
  if (request.url === '/') {
    response.writeHead(200, {
      'Cache-Control': 'max-age=0, no-cache, public',
      'Content-Type': 'text/html; charset=utf-8',
      'Expires': new Date().toUTCString()
    });
    response.write(
      fs.readFileSync('bills.html', { encoding: 'utf8' })
        .replace(
          /<script/,
          '<script type="text/javascript">' +
          'var payers = ' + JSON.stringify(payers) + '; ' +
          'var paid = ' + JSON.stringify(paid) + '; ' +
          '</script>\n<script'
        )
    )
    response.end();
  }

  // bills.css
  else if (request.url === '/bills.css') {
    response.writeHead(200, {
      'Cache-Control': 'max-age=31536000, public',
      'Content-Type': 'text/css; charset=utf-8',
      'Expires': new Date(Date.now() + 31536000000).toUTCString()
    });
    response.write(
      fs.readFileSync('bills.css', { encoding: 'utf8' })
    );
    response.end();
  }

  // bills.js
  else if (request.url === '/bills.js') {
    response.writeHead(200, {
      'Cache-Control': 'max-age=31536000, public',
      'Content-Type': 'text/css; charset=utf-8',
      'Expires': new Date(Date.now() + 31536000000).toUTCString()
    });
    response.write(
      fs.readFileSync('bills.js', { encoding: 'utf8' })
    );
    response.end();
  }

  else {
    response.writeHead(404, {
      'Cache-Control': 'max-age=0, no-cache, public',
      'Content-Type': 'text/text; charset=utf-8',
      'Expires': new Date().toUTCString()
    })
    response.write('404');
    response.end();
  }
})
  .listen(3000);
