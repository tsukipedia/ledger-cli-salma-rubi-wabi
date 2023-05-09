const meow = require('meow');
const meowHelp = require('cli-meow-help');
const fs = require("fs");
const Decimal = require("decimal.js");

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI versions`
	},
	file: {
		type: "string",
		default: `data/index.ledger`,
		alias: "f",
		desc: "Specify the input file"
	},
	sort: {
		type: "string",
		alias: "s",
		desc: "Specify the sorting method (date, name, amount)"
	},
	pricedb: {
		type: "string",
		default: "default",
		alias: "p",
		desc: "Specify the preferred currency"
	}
};

const commands = {
	help: { desc: `Print help info` },
	balance: { desc: "Show account balances" }
};

const helpText = meowHelp({
	name: `ledger`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
