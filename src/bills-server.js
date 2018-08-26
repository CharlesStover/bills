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
    .reduce((total, amount) => total + parseInt(amount, 10), 0);
}

http.createServer((request, response) => {

  // index.html
  if (/\/$/.test(request.url)) {
    if (request.method === 'POST') {
      let body = '';
      request.on('data', data => {
        body += data;
      });
      request.on('end', () => {
        const post = Object.assign(
          Object.create(null),
          ...body.split(/&/).map(
            parameter => {
              const param = parameter.split(/=/);
              return {
                [param[0]]: param[1]
              };
            }
          )
        );
        post.amount = Math.round(parseFloat(post.amount) * 100);
        paid[post.payer] += post.amount;
        fs.writeFileSync('payments/' + post.payer + '.txt', post.amount + '\n', { flag: 'a' });
        response.writeHead(302, {
          Location: '/'
        });
        response.end();
      });
    }
    else {
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
  }

  // bills.css
  else if (/\/bills\.css$/.test(request.url)) {
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
  else if (/\/bills\.js$/.test(request.url)) {
    response.writeHead(200, {
      'Cache-Control': 'max-age=31536000, public',
      'Content-Type': 'text/javascript; charset=utf-8',
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
      'Content-Type': 'text/plain; charset=utf-8',
      'Expires': new Date().toUTCString()
    })
    response.write('404');
    response.end();
  }
})
  .listen(3000);
