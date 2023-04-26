import type { AxiosError } from 'axios';
import axios from 'axios';

export type CustomErrorCode = 'BadRequestException' | 'EntityNotFound' | 'ServiceException';
export type CustomError = {
  code: CustomErrorCode;
  data: {
    message: string;
    key: string;
  };
};

export const isCustomAxiosError = (error: any): error is AxiosError<CustomError> => {
  if (!error) return false;
  if (!axios.isAxiosError(error)) return false;

  const customErrorData = (error as AxiosError).response?.data as CustomError;

  const hasValidDto =
    customErrorData !== undefined &&
    customErrorData.code !== undefined &&
    customErrorData.data !== undefined;

  return hasValidDto;
};

export const createCustomErrorMatcher = (code: CustomErrorCode) => (error: AxiosError) => {
  if (error.code === 'ERR_NETWORK') return false; // skip case with network errors
  const customError = error.response?.data as CustomError;
  const isEq = customError.code === code;
  return isCustomAxiosError(error) && isEq;
};


export const getCustomErrorRecord = (axiosError: AxiosError<CustomError>) => {
  const customError = axiosError.response?.data;
  const errors = {} as Record<string, string | null | undefined>;
  // Currently we support only one backend error
  if (customError?.data.key) {
    errors[customError?.data.key] = customError?.data.message;
  }
  return errors;
};
