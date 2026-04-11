import { API_CONFIG } from "@/core/constants";
import { UI_MESSAGES } from "@/core/messages";
import {
  ApiError,
  ConflictError,
  NetworkError,
  UnauthorizedError,
} from "@/core/error";
import { ApiBaseErrorSchema } from "@schemas/common";
import axios, { AxiosError, isAxiosError } from "axios";
import axiosRetry from "axios-retry";
import { v4 as uuidv4 } from "uuid";

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": API_CONFIG.HEADERS.CONTENT_TYPE,
  },
});

apiClient.interceptors.request.use((config) => {
  const correlationId = uuidv4();
  config.headers = config.headers ?? {};
  config.headers[API_CONFIG.HEADERS.CORRELATION_ID] = correlationId;
  config.headers[API_CONFIG.HEADERS.REQUEST_ID] = correlationId;
  return config;
});

axiosRetry(apiClient, {
  retries: 2,
  shouldResetTimeout: true,
  retryDelay: (retryCount) => Math.min(1000 * 2 ** (retryCount - 1), 4000),
  retryCondition: (error) => {
    if (!isAxiosError(error)) {
      return false;
    }

    const method = error.config?.method?.toLowerCase();
    const isIdempotent = method
      ? ["get", "head", "options"].includes(method)
      : true;

    if (!isIdempotent) {
      return false;
    }

    const status = error.response?.status;

    if (!status) {
      return true;
    }

    return [429, 500, 502, 503, 504].includes(status);
  },
});

apiClient.interceptors.response.use(
  (response) => {
    const resBody = response.data;
    const apiCopy = UI_MESSAGES.API;

    if (resBody && resBody.success === false) {
      const parsedError = ApiBaseErrorSchema.safeParse(resBody);
      const message = apiCopy.contractErrorMessage;
      const code = parsedError.success
        ? parsedError.data.error.code
        : "API_CONTRACT_ERROR";

      return Promise.reject(
        new ApiError(message, response.status || 400, code),
      );
    }

    return resBody;
  },
  (error: AxiosError<ApiError>) => {
    const apiCopy = UI_MESSAGES.API;

    if (!error.response) {
      return Promise.reject(new NetworkError(apiCopy.networkMessage, error));
    }

    const status = error.response.status;
    const responseData = error.response.data;
    let userFacingMessage: string = apiCopy.serverErrorMessage;
    let errorCode = "INTERNAL_ERROR";

    const parsedError = ApiBaseErrorSchema.safeParse(responseData);

    if (parsedError.success && status < 500) {
      errorCode = parsedError.data.error.code;
    } else if (parsedError.success) {
      errorCode = parsedError.data.error.code;
    }

    if (status === 401) {
      userFacingMessage = apiCopy.unauthorizedMessage;
      return Promise.reject(new UnauthorizedError(userFacingMessage, error));
    }

    if (status === 409) {
      userFacingMessage = apiCopy.conflictMessage;
      return Promise.reject(
        new ConflictError(userFacingMessage, error, errorCode),
      );
    }

    return Promise.reject(
      new ApiError(userFacingMessage, status, errorCode, error),
    );
  },
);
