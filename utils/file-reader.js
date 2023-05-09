const fs = require("fs");
const Decimal = require(`decimal.js`);
const INCLUDE_FILES_REGEX = /^!include\s+([\w./]+.ledger)/;
/**
 * This regex is designed to match a posting entry line in a ledger file, which starts
 * with the date of the transaction and is followed by the ransaction description. 
 * The regex captures the date, and description in separate groups.
 */
const POSTING_ENTRY_REGEX = /^(\d{4}\/\d{1,2}\/\d{1,2})\s+([\w\s]+)/;
/**
 * This regex is designed to match a transaction line in a ledger file, which typically 
 * includes an account name, an optional dollar amount, and an optional currency code. 
 * The regex captures the account name, amount, and currency code in separate groups.
 */
const TRANSACTION_MATCH_REGEX = /^\s+([\w\s\w:]+)\s+(-?[$]?[\d,.]+)\s*([A-Z]{2,3})?/;

function getTransactions(file, transactions = []) {
    const fileContent = parseFileContent(file)
    const lines = fileContent.split(`\n`);
    let transactionDate = ``;
    let transactionDescription = ``;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];


        const postingEntryMatch = line.match(POSTING_ENTRY_REGEX);
        if (postingEntryMatch) {
            transactionDate = postingEntryMatch[1];
            transactionDescription = postingEntryMatch[2];
        }


        let transactionAmount = 0;
        const transactionMatch = line.match(TRANSACTION_MATCH_REGEX);
        if (transactionMatch) {
            transactionAmount = new Decimal(transactionMatch[2].replace(`$`, ``));

            transactions.push({
                account: transactionMatch[1].trim(),
                amount: transactionAmount,
                currency: transactionMatch[3] ? transactionMatch[3] : `$`,
                date: new Date(transactionDate),
                description: transactionDescription
            });
        }

        let complementaryTransaction = {};
        if (i + 1 < lines.length) {
            complementaryTransaction = lines[i + 1].match(/^\s+([\w\s:]+)$/);
        }
        if (transactionMatch && complementaryTransaction) {
            transactions.push({
                account: complementaryTransaction[1].trim(),
                amount: -(transactionAmount),
                currency: transactionMatch[3] ? transactionMatch[3] : `$`,
                date: new Date(transactionDate),
                description: transactionDescription
            });
            i++;
        }

        // Check for include directive and process included file(s)
        const includeMatch = line.match(INCLUDE_FILES_REGEX);
        if (includeMatch) {
            const filename = `data/` + includeMatch[1];
            getTransactions(filename, transactions);
        }
    }

    return transactions;
}

function getPostings(file, postings = []) {
    const fileContent = parseFileContent(file)
    const lines = fileContent.split(`\n`);
    for (let i = 0; i < lines.length; i++) {
        const postingEntryMatch = lines[i].match(POSTING_ENTRY_REGEX);
        if (postingEntryMatch) {
            transactionDate = postingEntryMatch[1];
            transactionDescription = postingEntryMatch[2];

            const toAccountPostingMatch = lines[i + 1].match(TRANSACTION_MATCH_REGEX);
            const fromAccountPostingMatch = lines[i + 2].match(/^\s+([\w\s\w:]+)\s*(-?[$]?[\d,.]+)?\s*([A-Z]{2,3})?/);
            transactionAmount = new Decimal(toAccountPostingMatch[2].replace(`$`, ``));
            amountComplement = fromAccountPostingMatch[2] ? fromAccountPostingMatch[2].replace(`$`, ``) : -transactionAmount;

            postings.push({
                account: toAccountPostingMatch[1].trim(),
                fromAccount: fromAccountPostingMatch[1].trim(),
                amount: transactionAmount,
                fromAmount: amountComplement,
                currency: toAccountPostingMatch[3] ? toAccountPostingMatch[3] : `$`,
                fromCurrency: fromAccountPostingMatch[3] ? fromAccountPostingMatch[3] : `$`,
                date: new Date(transactionDate),
                description: transactionDescription
            });
            i = i + 2;
        }

        // Check for include directive and process included file(s)
        const includeMatch = lines[i].match(INCLUDE_FILES_REGEX);
        if (includeMatch) {
            const filename = `data/${includeMatch[1]}`;
            getPostings(filename, postings);
        }
    }
    return postings;
}

function getPrices() {
    const prices = {};
    const content = parseFileContent(`data/prices_db`);
    const lines = content.split(`\n`);

    lines.forEach((line) => {
        /**
         * This regex is used to match a line in a ledger file that represents a price quote, 
         * where the currency matched one or more uppercase letters and its price is denoted by 
         * the symbol ($). The regex captures the currency and the price amount as separate groups.
         */
        const priceMatch = line.match(/^P\s+\d{4}\/\d{1,2}\/\d{1,2}\s+\d{2}:\d{2}:\d{2}\s+([A-Z]+)\s+[$]([\d.,]+)/);
        if (priceMatch) {
            prices[priceMatch[1]] = new Decimal(priceMatch[2]);
        }

        const baseMatch = line.match(/^D\s+[$]([\d.,]+)/);
        if (baseMatch) {
            prices[`$`] = new Decimal(baseMatch[1].replace(`,`, ``));
        }
    });

    return prices;
}

function parseFileContent(file) {
    try {
        const content = fs.readFileSync(file, `utf-8`);
        return content;
    } catch (err) {
        console.error(`Error reading file: ${err.message}`);
        process.exit(1);
    }
}

module.exports = {
    getTransactions,
    getPostings,
    parseFileContent,
    getPrices,
};