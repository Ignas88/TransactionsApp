import React, {Component} from 'react';
import * as moment from 'moment';
import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';
import data from '../../data/data.json';
import {getConfig} from '../../services/services';
import {countPercentFromAmount, roundToTwo} from '../../utils/utils';
import TransactionTable from '../../components/TransactionTable/TransactionTable';

const cashInConfigURL = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in';
const cashOutConfigForLegalURL = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical';
const cashOutConfigForNatural = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural';

class Main extends Component {
  state = {
    transactions: []
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    let transactions = [...data];
    if (transactions && transactions.length > 0) {
      transactions = transactions.map(async obj => ({
        ...obj,
        fee: await this.countFee(obj)
      }));
      Promise
        .all(transactions)
        .then(async (res) => {
          const config = await getConfig(cashOutConfigForNatural);
          const finalTransactions = this.countFeeForNaturalCashOut(config, res);
          this.setState({transactions: finalTransactions});
        })
        .catch((err) => {
          console.log(err);
          this.setState({transactions: []});
        })
    }
  }

  countFee = async (obj) => {
    let config;
    let fee = 0;
    if (obj['type'] === 'cash_in') {
      config = await getConfig(cashInConfigURL);

      fee = countPercentFromAmount(config['percents'], obj['operation'].amount);
      fee = fee > config['max'].amount ? config['max'].amount : fee;
    } else {
      if (obj['user_type'] === 'juridical') {
        config = await getConfig(cashOutConfigForLegalURL);
        fee = countPercentFromAmount(config['percents'], obj['operation'].amount);
        fee = fee < config['min'].amount ? config['min'].amount : fee;
      }
    }
    return roundToTwo(fee);
  }

  countFeeForNaturalCashOut = (config, transactions) => {
    const finalTransactions = [];
    let groupedByUser = groupBy(transactions, 'user_id');
    Object.keys(groupedByUser).forEach(user => {
      let groupedByWeek = groupBy(groupedByUser[user], (obj) => moment(obj['date']).isoWeek());
      Object.keys(groupedByWeek).forEach(week => {
        let limit = config['week_limit'].amount;
        groupedByWeek[week].forEach(obj => {
          let fee = 0;
          let amount;
          if (obj['type'] === 'cash_out' && obj['user_type'] === 'natural') {
            if (limit > 0 && obj['operation'].amount > limit) {
              amount = obj['operation'].amount - limit;
              limit = limit - obj['operation'].amount;
              fee = countPercentFromAmount(config['percents'], amount);
            } else if (limit <= 0) {
              amount = obj['operation'].amount;
              limit = 0;
              fee = countPercentFromAmount(config['percents'], amount);
            } else if (limit > 0 && obj['operation'].amount <= limit) {
              limit = limit - obj['operation'].amount;
              fee = 0;
            }
            finalTransactions.push({
              ...obj,
              fee: roundToTwo(fee)
            });
          } else {
            finalTransactions.push(obj);
          }
        });
      });
    });

    return sortBy(finalTransactions, 'date');
  }

  render() {
    const {transactions} = this.state;

    return (
      <>
        <TransactionTable transactions={transactions}/>
      </>
    )
  }
}

export default Main;