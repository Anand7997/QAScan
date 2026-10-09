import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { authStorage } from "shared/auth/authStorage";

type RefreshResponse = {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  user: NonNullable<ReturnType<typeof authStorage.getUser>>;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _qmriAuthRetry?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

function isAuthRequest(requestUrl: string) {
  return [
    "/auth/public-session",
    "/auth/refresh",
  ].some((path) => requestUrl.includes(path));
}

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<RefreshResponse>("/api/v1/auth/refresh", undefined, { withCredentials: true })
      .then(({ data }) => {
        authStorage.save({
          accessToken: data.accessToken,
          accessTokenExpiresAtUtc: data.accessTokenExpiresAtUtc,
          user: data.user,
        });
        return data.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export function applyResponseInterceptor(client: AxiosInstance) {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        const requestUrl = error.config?.url ?? "";
        const requestConfig = error.config as RetryableRequestConfig | undefined;
        const authRequest = isAuthRequest(requestUrl);

        if (requestConfig && !authRequest && !requestConfig._qmriAuthRetry) {
          const accessToken = await refreshAccessToken();

          if (accessToken) {
            requestConfig._qmriAuthRetry = true;
            requestConfig.headers.Authorization = `Bearer ${accessToken}`;
            return client.request(requestConfig);
          }
        }

        if (!authRequest) {
          authStorage.clear();
        }

        if (!authRequest) {
          window.location.assign("/");
        }
      }

      return Promise.reject(error);
    },
  );
}
