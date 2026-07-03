//used to make test for our features
//Import models used by the slice
import { AuthTokenState, AuthTokenStore } from "../userAccounts/providers/authModels";

import authReducer, { authActions, selectAuth }
from "./authSlice";

describe('auth reducer', () => {
  const initialState: AuthTokenState = {
    token: "",
    isLoggedIn: false,
    remainingTime: 0,
    isAuthLoading: false,
    provider: "SkylynxNet",
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual({
      token: "",
      isLoggedIn: false,
      remainingTime: 0,
      isAuthLoading: false,
      hasError: false,
    });
  });

  it('should handle login', () => {
  const actual = authReducer(
    initialState,
    authActions.replaceLoginData({
      token:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhiMjFkNWE1Y2U2OGM1MjNlZTc0MzI5YjQ3ZDg0NGE3YmZjODRjZmYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY3J5cHRvcmlvbWFya2V0IiwiYXVkIjoiY3J5cHRvcmlvbWFya2V0IiwiYXV0aF90aW1lIjoxNjI1NTE4NTM3LCJ1c2VyX2lkIjoiSllNUnFIZm0zMGFxMTk0M0lVY1lybldVamRsMiIsInN1YiI6IkpZTVJxSGZtMzBhcTE5NDNJVWNZcm5XVWpkbDIiLCJpYXQiOjE2MjU1MTg1MzcsImV4cCI6MTYyNTUyMjEzNywiZW1haWwiOiJjaGFkLm1hcnRpbkBhbWV0cml0ZWNoLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJjaGFkLm1hcnRpbkBhbWV0cml0ZWNoLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.RzPSkI7-9NduEiBDxBGtGYaJ-aJCJUsT0PZ_esBJz04h5D8CQDTVLAFyRIDKeAoQcpsbo4eyWuIE4URePu6tVgyFZYka9xdfppFRgyil15YHV-PGypxfnkPT7jDZz0GEYGiooez8eTOZuXtNsqPJqOfFGHVw0NeOKEXYf0POaJn88Z3jT3Yuf0ZMPUXGpUz0sayrpYO9GWMEPP7g9yVcF6-MFpzyeou7cXuWjcjYJRE1A80SxDGiQoZVOiSviH1-qYfreSHYrRR8qMJeq-LoRLVVlgJwC-RGOLDfKRKHk5ExKwcuLhrei2-QFc2tFWjjEaQ6ENspSqDa7BRPUUprWQ",
      isLoggedIn: true,
      remainingTime: 5000,
      isAuthLoading: false,
      provider: "Firebase",
    })
  );
    expect(actual.isLoggedIn).toEqual(true);
  });


});
