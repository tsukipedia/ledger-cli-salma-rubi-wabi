const Decimal = require("decimal.js");
const { parseAmountCurrency, getStandarizedAmount, objectFromArray, } = require("./currency-handler");
const { getTransactions, getPostings } = require("./file-reader");

// command functions

function calculateBalances(file, sortMethod, currency, accounts = []) {
    const balances = {};
    const postings = getTransactions(file);
    const transactionSortMethod = sortMethod == (`D` || `date_desc`) ? `d` : sortMethod;
    let filteredPostings = sortMethod != `` ? sortPostings(postings, transactionSortMethod) : postings;

    if (accounts.length > 1) {
        filteredPostings = postings.filter((posting) =>
            accounts.some((inputAccount) =>
                posting.account.toLowerCase().startsWith(inputAccount.toLowerCase())
            )
        );
    }

    filteredPostings.forEach((posting) => {
        if (!balances[posting.account]) {
            balances[posting.account] = {
                amount: new Decimal(0),
                currency: currency == `default` ? posting.currency : currency,
                date: new Date(posting.date)
            }
        }
        postingAmount = parseAmountCurrency(posting.amount, posting.currency, currency);
        balances[posting.account].amount = balances[posting.account].amount.plus(postingAmount);
        balances[posting.account].date = new Date(posting.date);
    });

    return sortMethod != `` ? sortBalances(Object.entries(balances), sortMethod) : balances;
}

function print(file, sortMethod, wantedCurrency) {
    let postings = getPostings(file);
    postings = sortMethod != `` ? sortPostings(postings, sortMethod) : postings;

    postings.forEach((posting) => {
        console.log(posting.date.toISOString().split(`T`)[0], `\s`, posting.description);
        const postingToAmount = parseAmountCurrency(posting.amount, posting.currency, wantedCurrency);
        const currencyToString = wantedCurrency == `default` ? posting.currency.replace(`$`, ``) : wantedCurrency;
        const amountToString = postingToAmount.isNegative() ?
            `-$${-postingToAmount} ${currencyToString}` :
            `$${postingToAmount} ${currencyToString}`;

        const postingFromAmount = parseAmountCurrency(posting.fromAmount, posting.fromCurrency, wantedCurrency);
        const currencyFromString = wantedCurrency == `default` ? posting.fromCurrency.replace(`$`, ``) : wantedCurrency;
        const amountFromString = postingFromAmount.isNegative() ?
            `-$${-postingFromAmount} ${currencyFromString}` :
            `$${postingFromAmount} ${currencyFromString}`;
        const amountLength = Math.max(amountToString.length, amountFromString.length);
        console.log(`\t${amountToString.padEnd(amountLength, ` `)}\t${posting.account}`);
        console.log(`\t${amountFromString.padEnd(amountLength, ` `)}\t${posting.fromAccount}`);
    });

}

function register(file, wantedCurrency, accountNames) {
    let transactions = getPostings(file);
    transactions = sortPostings(transactions, 'd');
    const lowerCaseAccountNames = accountNames.map(name => name.toLowerCase());

    const filteredTransactions = transactions.filter(transaction =>
        lowerCaseAccountNames.some(accountName =>
            transaction.account.toLowerCase().includes(accountName) ||
            transaction.fromAccount.toLowerCase().includes(accountName)
        )
    );

    filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date).toISOString().split('T')[0];
        const description = transaction.description.length > 30 ? transaction.description.slice(0, 30) + '...' : transaction.description.padEnd(30, ' ');

        const transactionToAmount = parseAmountCurrency(transaction.amount, transaction.currency, wantedCurrency);
        const currencyToString = wantedCurrency == 'default' ? transaction.currency.replace('$', '') : wantedCurrency;
        const amountToString = currencyToString == '' ? `$${transactionToAmount.toFixed(2)}` : `${transactionToAmount} ${currencyToString}`;
        const lowerCaseToAccountName = transaction.account.toLowerCase();
        const toBalance = lowerCaseAccountNames.some(name => lowerCaseToAccountName.includes(name)) ? amountToString : '0';

        const transactionFromAmount = parseAmountCurrency(transaction.fromAmount, transaction.fromCurrency, wantedCurrency);
        const currencyFromString = wantedCurrency == 'default' ? transaction.fromCurrency.replace('$', '') : wantedCurrency;
        const amountFromString = currencyFromString == '' ? `$${transactionFromAmount.toFixed(2)}` : `${transactionFromAmount} ${currencyFromString}`;
        const lowerCaseFromAccountName = transaction.fromAccount.toLowerCase();
        const fromBalance = lowerCaseAccountNames.some(name => lowerCaseFromAccountName.includes(name)) ? amountFromString : '0';

        const toAccountName = transaction.account.length > 22 ? transaction.account.slice(0, 22) + '...' : transaction.account.padEnd(25, ' ');
        const fromAccountName = transaction.fromAccount.length > 22 ? transaction.fromAccount.slice(0, 22) + '...' : transaction.fromAccount.padEnd(25, ' ');

        console.log(`${date} ${description}\t${toAccountName} ${amountToString.padEnd(12, ' ')}\t${toBalance}`);
        console.log(`\t\t\t\t\t\t${fromAccountName} ${amountFromString.padEnd(12, ' ')}\t${fromBalance}`);
    });

}

// Sorting functions

function sortBalances(balances, sortMethod) {
    switch (sortMethod) {
        case `d`:
        case `date`:
            balances.sort((a, b) => a[1].date - b[1].date);
            break;
        case `D`:
        case `date_desc`:
            balances.sort((a, b) => b[1].date - a[1].date);
            break;
        case `a`:
        case `amount`:
            balances.sort((a, b) => getStandarizedAmount(a[1].amount, a[1].currency) - getStandarizedAmount(b[1].amount, b[1].currency));
            break;
        case `A`:
        case `amount_desc`:
            balances.sort((a, b) => getStandarizedAmount(b[1].amount, b[1].currency) - getStandarizedAmount(a[1].amount, a[1].currency));
            break;
        default:
            break;
    }
    return objectFromArray(balances);
}

function sortPostings(postings, sortMethod) {
    switch (sortMethod) {
        case `d`:
        case `date`:
            postings.sort((a, b) => a.date - b.date);
            break;
        case `D`:
        case `date_desc`:
            postings.sort((a, b) => b.date - a.date);
            break;
        case `n`:
        case `name`:
            postings.sort((a, b) => a.account.localeCompare(b.account));
            break;
        case `N`:
        case `namet_desc`:
            postings.sort((a, b) => b.account.localeCompare(a.account));
            break;
        case `a`:
        case `amount`:
            postings.sort((a, b) => getStandarizedAmount(a.amount, a.currency) - getStandarizedAmount(b.amount, b.currency));
            break;
        case `A`:
        case `amount_desc`:
            postings.sort((a, b) => getStandarizedAmount(b.amount, b.currency) - getStandarizedAmount(a.amount, a.currency));
            break;
        default:
            break;
    }
    return postings;
}

module.exports = {
    calculateBalances,
    print,
    register
};
