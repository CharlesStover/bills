<?php

define('FILENAME', 'bills.txt');
define('PERSON_1', 'Alice');
define('PERSON_2', 'Bob');

if (
	array_key_exists('payer', $_POST) &&
	array_key_exists('amount', $_POST) &&
	!empty($_POST['amount']) &&
	preg_match('/^\-?(\d+)?(?:\.\d+)?$/', $_POST['amount'])
) {
	$bills = file(FILENAME);
	foreach ($bills as $key => $bill) {
		if ($bill == $_POST['payer'] . ":\r\n") {
			$bills[$key] .= $_POST['amount'] . "\r\n";
			file_put_contents(FILENAME, implode('', $bills));
			break;
		}
	}
	header('Location: ' . $_SERVER['PHP_SELF']);
	exit();
}

$bills = file(FILENAME);
$contribution = array();
$payer = 'Unknown';
foreach ($bills as $bill) {
	if (preg_match('/^(\w+)\:\s*$/', $bill, $match)) {
		$payer = $match[1];
		$contribution[$payer] = 0;
	}
	else
		$contribution[$payer] += floatval($bill);
}

?><!DOCTYPE html>
<html>
	<head>	
		<title>Bills</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1" />
		<style type="text/css">

.amount {
	font-family: monospace;
	font-size: 1.25em;
}

body {
	font-size: 14px;
	margin: 0;
	padding: 0;
}

input[type="number"] {
	margin-right: 1em;
	width: 6em;
}

table {
	border-spacing: 0;
	border-width: 0 1px 1px 0;
	margin: 1em;
}

table,
td,
th {
	border-color: #c0c0c0;
	border-style: solid;
}

td.empty {
	border-width: 0;
}

td,
th {
	border-width: 1px 0 0 1px;
	padding: 0.5em 1em;
}

th {
	background-color: #f0f0f0;
	font-family: sans-serif;
	text-align: left;
}

	th:after {
		content: ":";
	}

thead td,
thead th {
	width: 33.333%;
}

		</style>
	</head>
	<body>
		<table id="amounts">
			<thead>
				<td class="empty"></td>
				<th>Amount</th>
				<th>Pay</th>
			</thead>
			<tbody>
<?php

foreach ($contribution as $payer => $amount) {

?>
				<tr>
					<th><?php echo $payer; ?></th>
					<td class="amount">$<?php echo number_format($amount, 2); ?></td>
					<td>
						<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
							<input name="payer" type="hidden" value="<?php echo htmlentities($payer); ?>" />
							<input name="amount" step="0.01" type="number" value="1.00" />
							<input type="submit" value="Pay" />
						</form>
					</td>
				</tr>

<?php

}

?>
			</tbody>
			<tfoot>
				<tr>
					<th>Total</th>
					<td class="amount">$<?php echo number_format(array_sum($contribution), 2); ?></td>
					<td><?php echo $contribution[PERSON_1] - $contribution[PERSON_2] < 0 ? PERSON_1 : PERSON_2, ' pays: <span class="amount">$', number_format(abs($contribution[PERSON_1] - $contribution[PERSON_2]), 2), '</span>'; ?></td>
				</tr>
		</table>
	</body>
</html>
