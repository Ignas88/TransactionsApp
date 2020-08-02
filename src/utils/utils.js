export const countPercents = (percents, amount) => (percents / 100) * amount;

export const formatFee = num => (Math.ceil(num.toFixed(3) * 100) / 100).toFixed(2);