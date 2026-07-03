// config/Loadroutes.ts
// config/loadroutes.ts
import { useSelector } from "react-redux";
import { RootState } from "../appStore/store"; // Import RootState
import { routeConfig } from "./routeUserConfig"; // Import route config

// Define Loadroutes function
export const Loadroutes = () => {
  // Use `useSelector` inside Loadroutes to get the entire RootState
  const authState = useSelector((state: RootState) => state.auth);
  const moduleRegistryState = useSelector((state: RootState) => state.moduleRegistry);

  // Filter routes based on the condition in the route configuration
  return routeConfig.filter((route) => {
    if (route.condition) {
      // Apply condition based on the complete state (authState, stellarState, etc.)
      return route.condition({
        auth: authState,
        moduleRegistry: moduleRegistryState,
      });
    }
    return true; // If no condition, include the route
  });
};

