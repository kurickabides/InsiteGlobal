//This will show the list of bank accounts the users has setup
import { useRef, useContext,useEffect} from 'react';
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';

//Use Redux hooks to get to see user is logged in and get actions for disptach
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
//Import AuthSlice
import {
  selectAuth
} from '../auth/authSlice';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
    control: {
      marginBottom: `0.5rem`,
    },
    label: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
  },
  input: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
},
action: {
  flex: 1,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
},
toggle: {
  flex: 1,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
},
    })
);
const BankAccountList: React.FC = (props) => {
  const authState = useAppSelector(selectAuth);
  const classes = useStyles();
  const history = useHistory();
  const firebaseApiKey="AIzaSyC9q_8eQGjKTHcvV-QCjy8UK61jnqb5Tkw";
  //Firebase Rest Method Names
  const apiUpdatePasswordMethodName = "update";
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!authState.isAuthLoading  && authState.isLoggedIn) {
     // let user know the process succeeded by
           //return user to Home
          history.replace('/');

    }else if (!authState.isAuthLoading )
    {
      //TODO add error module for now just use alert

    }
  }, [authState,history]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    let enteredPassword ="";
    if(passwordInputRef.current && passwordInputRef.current.value)
    {
      enteredPassword = passwordInputRef.current.value;
    }

  };
  return (
    <form onSubmit ={submitHandler} className={classes.root}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={passwordInputRef} type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default BankAccountList;
