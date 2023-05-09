#!/usr/bin/env node

/**
 * ledger-cli
 * A simple ledger implementation, instructions in README.md file.
 *
 * @author Salma Rubi Wabi <salma.rubiwabi@gmail.com>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const { calculateBalances, print, register } = require('./utils/ledger');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;
const validSortMethods = ['d', 'date', 'D', 'date_desc', 'a', 'amount', 'A', 'amount_desc', 'n', 'name', 'N', 'name_desc'];

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);

	const sorMethod = validSortMethods.includes(flags.sort) ? flags.sort : '';

	if (input.includes('balance')) {
		const balances = calculateBalances(flags.file, sorMethod, flags.pricedb, input);

		// Display the account balances
		for (const account in balances) {
			output = balances[account].currency === '$' ? 
				`${account}: $${balances[account].amount.toFixed(2)}` : 
				`${account}: ${balances[account].amount.toFixed(2)} ${balances[account].currency}`;
			console.log(output);
		}
	}

	if(input.includes('print')) print(flags.file, sorMethod, flags.pricedb);

	if(input.includes('register')) register(flags.file, flags.pricedb, input);
})();

