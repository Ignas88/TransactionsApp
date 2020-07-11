import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import {PersonTwoTone, BusinessCenterTwoTone} from '@material-ui/icons';

const useStyles = makeStyles({
  table: {
    width: '100%'
  },
  container: {
    maxWidth: 900,
    margin: '40px auto'
  },
  icon: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  svg: {
    marginRight: 5
  },
  footer: {}
});

const TransactionTable = ({transactions}) => {
  const classes = useStyles();

  return (
    <TableContainer className={classes.container} component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">UserName</TableCell>
            <TableCell align="left">Operation</TableCell>
            <TableCell align="left">Operator's fee</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions && transactions.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell align="left">{row['date']}</TableCell>
              <TableCell align="left">
                <span className={classes.icon}>
                  {row['user_type'] === 'natural' ?
                    <PersonTwoTone className={classes.svg}/> :
                    <BusinessCenterTwoTone className={classes.svg}/>
                  }
                  USER_{row['user_id']}
                </span>
              </TableCell>
              <TableCell align="left">
                {row['type'] === 'cash_in' ? '+' : '-'} {row['operation'].amount.toString()} {row['operation'].currency}
              </TableCell>
              <TableCell align="left">
                {row['fee']} {row['operation'].currency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {transactions.length === 0 ?
          <TableFooter><TableRow><TableCell>No Transactions</TableCell></TableRow></TableFooter> :
          null
        }
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;