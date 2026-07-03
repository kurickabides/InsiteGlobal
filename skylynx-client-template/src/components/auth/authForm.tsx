// ================================================
// ✅ Component: AuthForm
// File: components/auth/AuthForm.tsx
// Description: Handles authentication UI for login/signup using Redux state.
// Includes form, dynamic mode switching, toast messaging, and redirect logic.
// ================================================

import React, { useRef, useEffect, FC, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { CardHeader, Button } from "@mui/material";
import Loading from "../ui/loading/LoadingProgessBar";
import { loginAndLoadProfile, signup } from "./authSlice";
import Toasted from "../ui/dialogs/toast";
import { saveAuthState } from "../../helpers/persistAuth";
// Styles
import { AuthCard, AuthCardContent, AuthLabel } from "./styled/authForm";
import {
  Input,
  Actions,
  ToggleButton,
  FullPageWrapper,
} from "../../theme/appStyles";


interface AuthFormProps {}

const AuthForm: FC<AuthFormProps> = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const userEmailRef = useRef<HTMLInputElement>(null);
  const userPasswordRef = useRef<HTMLInputElement>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    status: "info" as "success" | "error" | "info",
  });

//Remove Login when user removes
  useEffect(() => {
    if (!auth.isLoggedIn) {
      localStorage.removeItem("auth");
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    console.log("🔁 the auth state in appform is", auth);

     if (auth.isLoggedIn && !auth.isAuthLoading) {
       // ✅ Log full LoggedInUser state
       console.log("🔐 Logged in user:", auth.user);
       console.log("🧾 User profile object:", auth.user.profile);
       console.log("👤 Full AuthState:", JSON.stringify(auth, null, 2));
       saveAuthState(auth);
       navigate("/dashboard");
       setToast({
         open: true,
         message: "Authentication successful",
         status: "success",
       });
     } else if (!auth.isLoggedIn && auth.error) {
       setToast({ open: true, message: auth.error, status: "error" });
     }
     
  }, [auth, navigate]);

  const logInSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    const email = userEmailRef.current?.value;
    const password = userPasswordRef.current?.value;

    if (email && password) {
      const payload = { email, secret: password };
      if (isLogin) {
        dispatch(loginAndLoadProfile(payload));
      } else {
        dispatch(signup(payload));
      }
    }
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prev) => !prev);
    setToast({ open: false, message: "", status: "info" });
  };

  return (
    <FullPageWrapper>
      {toast.open && <Toasted toastMessage={toast} />}
      <AuthCard>
        <CardHeader title={isLogin ? "Login" : "Signup"} />
        <form onSubmit={logInSubmitHandler}>
          <AuthCardContent>
            <AuthLabel htmlFor="email">Your Email</AuthLabel>
            <Input ref={userEmailRef} type="email" id="email" required />
          </AuthCardContent>
          <AuthCardContent>
            <AuthLabel htmlFor="password">Your Password</AuthLabel>
            <Input
              ref={userPasswordRef}
              type="password"
              id="password"
              required
            />
          </AuthCardContent>
          <Actions>
            {!auth.isAuthLoading && (
              <Button type="submit" variant="contained">
                {isLogin ? "Login" : "Signup"}
              </Button>
            )}
            {auth.isAuthLoading && <Loading />}
            <ToggleButton onClick={switchAuthModeHandler}>
              {isLogin ? "Switch to Signup" : "Switch to Login"}
            </ToggleButton>
          </Actions>
        </form>
      </AuthCard>
    </FullPageWrapper>
  );
};

export default AuthForm;
