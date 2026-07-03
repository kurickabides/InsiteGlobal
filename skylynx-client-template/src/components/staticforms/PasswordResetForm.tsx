import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { selectAuth } from "../auth/authSlice";

import {
  FormRoot,
  Control,
  Label,
  Input,
  Actions,
} from "../../theme/appStyles";

const PasswordResetForm: React.FC = () => {
  const authState = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authState.isAuthLoading && !authState.isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [authState, navigate]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredPassword = passwordInputRef.current?.value || "";
    console.log(`Your Password has been changed`);
  };

  return (
    <FormRoot onSubmit={submitHandler}>
      <Control>
        <Label htmlFor="new-password">New Password</Label>
        <Input ref={passwordInputRef} type="password" id="new-password" />
      </Control>
      <Actions>
        <Button type="submit" variant="contained" color="inherit">
          Change Password
        </Button>
      </Actions>
    </FormRoot>
  );
};

export default PasswordResetForm;
