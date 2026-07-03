import React, {useEffect,useCallback} from 'react';
import { useHistory } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../hooks/reduxHooks";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { PAGE_WIDTH,  PLAID_CLIENT_ID,
  PLAID_SECRET} 
  from "../../../helpers/constants";
import { PlaidLinkPropTypes,PlaidLinkOptions } from "./types";
import { usePlaidLink } from "./usePlaidLink";
import {
  bankActions,
  selectBankAccount,
} from "../../userAccounts/bankAccountSlice";
import plaid from "plaid";
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

let testResponse:any;



const PlaidLinkButton: React.FC<PlaidLinkPropTypes> = (props) => {
  const { children, style, className, ...config } = props;

  //CallBack for API
  const paildSuccuesssHandler = useCallback((token, metadata) => {
    console.log("onSuccess", token, metadata);
     //dispatch(bankActions);
  }, []);

  const bankAccountState = useAppSelector(selectBankAccount);
  const configTest: PlaidLinkOptions = {
    clientName: "Chad F Martin",
    publicKey: PLAID_CLIENT_ID,
    env: plaid.environments.sandbox,
    onSuccess: paildSuccuesssHandler,
    product: ["auth"],
    countryCodes: ["US"],
    language: "en",
  };
  const { error, open, ready, exit } = usePlaidLink(configTest);

  const [plaidAccount, setPlaidAccount] = React.useState<any>();
  const history = useHistory();
  //const bankAccountState = useAppSelector(selectBankAccount);
  const dispatch = useAppDispatch();
  //add useEffet to handel state and dispatch replace bankAccount

  const classes = useStyles();

  useEffect(() => {
if(open &&ready )
{
  console.log("Plaid setup");
}
  }, [error, open, ready, exit]);

   const onClick_Handler = () => {
     open();
   };
  return (
    <button
      disabled={Boolean(error)}
      type="button"
      className={classes.root}
      style={{
        padding: "6px 4px",
        outline: "none",
        background: "#FFFFFF",
        border: "2px solid #F1F1F1",
        borderRadius: "4px",
        ...style,
      }}
      onClick={onClick_Handler}
    >
      {children}
    </button>
  );
};

PlaidLinkButton.displayName = "PlaidLink";
export default PlaidLinkButton;
