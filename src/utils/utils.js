export const countPercentFromAmount = (percents, amount) => (percents / 100) * amount;

export const roundToTwo = num => (Math.ceil(num.toFixed(3) * 100) / 100).toFixed(2);