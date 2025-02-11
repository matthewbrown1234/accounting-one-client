import {ApiUserValidationFieldError, ApiValidationError} from "../types";

export const handleResponse = async <T>(response: Response) => {
  if (response.ok && response.status !== 204) {
    return await response.json() as T
  }
  if(response.ok && response.status === 204) {
    return {} as T
  }
  if (response.status >= 400 && response.status < 500) {
    const errors = await response.json() as ApiUserValidationFieldError
    throw new ApiValidationError(errors)
  }
  throw new Error("Request failed")
}

