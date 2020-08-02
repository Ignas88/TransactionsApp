import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import {PersonTwoTone, BusinessCenterTwoTone} from '@material-ui/icons';
import './TransactionTable.css';

const TransactionTable = ({transactions}) => {

  return (
    <TableContainer className="container" component={Paper}>
      <Table className="table" size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>UserName</TableCell>
            <TableCell>Operation</TableCell>
            <TableCell>Operator's fee</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions && transactions.map(({date, user_type: userType, user_id: userId, type, operation, fee}, idx) => (
            <TableRow key={idx}>
              <TableCell>{date}</TableCell>
              <TableCell>
                <span className="icon">
                  {userType === 'natural' ?
                    <PersonTwoTone className="svg"/> :
                    <BusinessCenterTwoTone className="svg"/>
                  }
                  USER_{userId}
                </span>
              </TableCell>
              <TableCell>
                {type === 'cash_in' ? '+' : '-'} {operation.amount.toString()} {operation.currency}
              </TableCell>
              <TableCell>
                {fee} {operation.currency}
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