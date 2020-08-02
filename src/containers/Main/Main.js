import React, {useState, useEffect} from 'react';
import data from '../../data/data.json';
import {getConfig} from '../../services/services';
import {countFee} from '../../hooks/countFee';
import TransactionTable from '../../components/TransactionTable/TransactionTable';

const cashInConfigURL = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in';
const cashOutConfigForLegalURL = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical';
const cashOutConfigForNatural = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural';

const Main = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    let transactionsJSON = [...data];
    if (transactionsJSON && transactionsJSON.length > 0) {
      const transactionsWithConfig = transactionsJSON.map(async obj => {
        let url = obj.type === 'cash_in' ?
          cashInConfigURL :
          (obj['user_type'] === 'juridical' ? cashOutConfigForLegalURL : cashOutConfigForNatural);
        return {
          ...obj,
          config: await getConfig(url)
        }
      });
      Promise
        .all(transactionsWithConfig)
        .then(async (res) => {
          const finalTransactions = countFee(res);
          setTransactions(finalTransactions);
        })
        .catch((err) => {
          console.log(err);
          setTransactions([]);
        })
    }
  }

  return (
    <>
      <TransactionTable transactions={transactions}/>
    </>
  )
}

export default Main;