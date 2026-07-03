import React from 'react';
import { useState, useRef, useEffect } from "react"; 
import { useHistory } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { PAGE_WIDTH } from "../../helpers/constants";

import Plaid from "plaid";

import {
  BankAccountState,
  BankAccountProviders,
} from "./wallets/accountModels";

import {
  GetBankAccountInfo,
  GetPlaidLinkToken,
  bankActions,
  selectBankAccount,
} from "./bankAccountSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(4),
      width: PAGE_WIDTH,
      maxQidth: `25rem`,
      borderRadius: `6px`,
      // backgroundColor: theme.palette.secondary.main,
      boxShadow: `0 0 3px ${theme.palette.primary.main}, 0 0 9px ${theme.palette.primary.main}, 0 0 11px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main}`,
      padding: theme.spacing(1), 
      textAlign: `left`,
    },
  })
);

const BankAccountCard = () => {
  const classes = useStyles();
  const history = useHistory();
   const bankAccountState = useAppSelector(selectBankAccount);
  const dispatch = useAppDispatch();
  const Title = "Mangage Bank Accounts";
   useEffect(() => {
    //Ok
    if (!bankAccountState.isLoaded && bankAccountState.providerToken)
    {
     //Happy days are here again
    alert(bankAccountState.providerToken);
    }
    if (bankAccountState.isLoaded && bankAccountState.bankInfo) {
      //Convert expiredIn to number before passing to Context Handler
      //Get User Info State for Auth Slice
      // console.log(`Welcome back ${data.email} your id is ${data.localId}`);
      //return user to Home
      history.replace("/");
      //}// else if (!isAuthLoading && !error && reqIdentifer === apiSignUPMethodName) {
      // console.log(`Glad you joined with ${data.email}  `);
      //return user to Home
      // history.replace('/');
    } else if (!bankAccountState.isLoaded) {
      //tell user what to do with something cool
    }

    //Login with MetaMask if already connected

  }, [history, bankAccountState]);
  
  const addbankAccountHandler = () =>{
    if (bankAccountState.provider === BankAccountProviders[0]) {
      dispatch(GetPlaidLinkToken("1"));
    }
    //history.replace('/');
    };
  return (
    <Card className={classes.root}>
      <CardHeader title={Title}/>
      <CardActions>
        <Button type='button'
            onClick={addbankAccountHandler}>Add Bank Account</Button>

      </CardActions>
    </Card>
  );
};

export default BankAccountCard;
