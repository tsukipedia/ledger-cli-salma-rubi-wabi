const Decimal = require("decimal.js");

const { getPrices } = require("./file-reader");

function parseAmountCurrency(amount, fromCurrency, toCurrency) {
    const numericAmount = new Decimal(amount);
    if (toCurrency == `default` || fromCurrency == toCurrency) return numericAmount;
    const prices = getPrices();
    const parsedAmount = getStandarizedAmount(amount, fromCurrency) * prices[toCurrency] / prices[`$`];
    return new Decimal(parsedAmount.toFixed(2));
}

function getStandarizedAmount(amount, currency) {
    const numericAmount = new Decimal(amount);
    if (currency == `$`) return numericAmount;
    const prices = getPrices();
    const standarizedAmount = numericAmount * prices[`$`] / (prices[currency]);
    return new Decimal(standarizedAmount.toFixed(2));
}

function objectFromArray(arr) {
    const obj = {};
    arr.forEach(([key, value]) => {
        obj[key] = value;
    });
    return obj;
}

module.exports = {
    parseAmountCurrency,
    getStandarizedAmount,
    objectFromArray,
};