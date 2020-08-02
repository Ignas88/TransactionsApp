import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';
import * as moment from 'moment';
import {countPercents, formatFee} from '../utils/utils';

export const countFee = (transactions) => {
  const finalTransactions = [];
  let groupedByUser = groupBy(transactions, 'user_id');
  Object.keys(groupedByUser).forEach(user => {
    let groupedByWeek = groupBy(groupedByUser[user], (obj) => moment(obj.date).isoWeek());
    Object.keys(groupedByWeek).forEach(week => {
      let weekLimit;
      groupedByWeek[week].forEach(transaction => {
        const {operation, type, config, user_type: userType} = transaction;
        let amount = operation.amount;
        let fee = 0;
        if (type === 'cash_in') {
          fee = countPercents(config['percents'], amount);
          fee = fee > config['max'].amount ? config['max'].amount : fee;
        } else {
          if (userType === 'juridical') {
            fee = countPercents(config['percents'], amount);
            fee = fee < config['min'].amount ? config['min'].amount : fee;
          } else {
            if (!weekLimit) {
              weekLimit = config['week_limit'].amount - amount;
              amount = weekLimit >= 0 ? 0 : operation.amount - config['week_limit'].amount;
            } else {
              if (weekLimit >= 0) {
                weekLimit = weekLimit - amount;
                amount = 0;
              }
            }
            fee = countPercents(config['percents'], amount);
          }
        }

        finalTransactions.push({
          ...transaction,
          fee: formatFee(fee)
        });
      });
    });
  });
  return sortBy(finalTransactions, 'date');
}