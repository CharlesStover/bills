var suffix = function(cents) {
  return (
    cents % 100 ?
      cents % 10 ?
        '' :
        '0' :
      '.00'
  );
};
var minPayer1 = payers.reduce(
  function(minPayer, payer) {
    if (paid[payer] < paid[minPayer]) {
      return payer;
    }
    return minPayer;
  },
  payers[0]
);
var minPayer2 = payers.reduce(
  function(minPayer, payer) {
    if (
      payer !== minPayer1 &&
      paid[payer] < paid[minPayer]
    ) {
      return payer;
    }
    return minPayer;
  },
  payers[0] === minPayer1 ?
    payers[1] :
    payers[0]
);
var payersLength = payers.length;
var tbody = document.getElementsByTagName('tbody').item(0);
var total = 0;
for (var x = 0; x < payersLength; x++) {
  var payerPaid = paid[payers[x]];
  total += payerPaid;
  var tr = document.createElement('tr');

  var th = document.createElement('th');
  th.appendChild(document.createTextNode(payers[x]));
  tr.appendChild(th);

  var amount = document.createElement('td');
  amount.className = 'amount';
  amount.appendChild(document.createTextNode('$' + (payerPaid / 100) + suffix(payerPaid)));
  tr.appendChild(amount);

  var td = document.createElement('td');
  var form = document.createElement('form');
  form.setAttribute('action', '/');
  form.setAttribute('method', 'POST');
  var payer = document.createElement('input');
  payer.setAttribute('name', 'payer');
  payer.setAttribute('type', 'hidden');
  payer.setAttribute('value', payers[x]);
  form.appendChild(payer);
  var amount = document.createElement('input');
  amount.setAttribute('name', 'amount');
  amount.setAttribute('step', '0.01');
  amount.setAttribute('type', 'number');
  amount.setAttribute('value', '0.00');
  form.appendChild(amount);
  var submit = document.createElement('input');
  submit.setAttribute('type', 'submit');
  submit.setAttribute('value', 'Pay');
  form.appendChild(submit);
  td.appendChild(form);
  tr.appendChild(td);

  tbody.appendChild(tr);
}

var tfootTds = document.getElementsByTagName('tfoot').item(0).getElementsByTagName('td');
tfootTds.item(0).appendChild(document.createTextNode('$' + (total / 100).toString()));
var todo = tfootTds.item(1);
todo.appendChild(document.createTextNode(minPayer1 + ' pays: '));
var span = document.createElement('span');
span.className = 'amount';
var toPay = paid[minPayer2] - paid[minPayer1];
span.appendChild(document.createTextNode('$' + (toPay / 100) + suffix(toPay)));
todo.appendChild(span);
