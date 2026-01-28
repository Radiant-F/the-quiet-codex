import { useEffect } from "react";
import { useAppDispatch } from "@/hooks";
import { setCredentials, setLoading } from "../services/authReducer";
import { authApi } from "../services/authApi";

export function AuthBootstrap(): null {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Try to refresh the token on app load
        const refreshResult = await dispatch(
          authApi.endpoints.refresh.initiate(),
        ).unwrap();

        if (refreshResult?.accessToken) {
          // Get user info
          const meResult = await dispatch(
            authApi.endpoints.getMe.initiate(),
          ).unwrap();

          if (meResult?.user) {
            dispatch(
              setCredentials({
                accessToken: refreshResult.accessToken,
                user: {
                  id: meResult.user.id,
                  email: meResult.user.email,
                },
              }),
            );
          }
        }
      } catch {
        // User not authenticated, that's fine
        dispatch(setLoading(false));
      }
    };

    bootstrap();
  }, [dispatch]);

  return null;
}
