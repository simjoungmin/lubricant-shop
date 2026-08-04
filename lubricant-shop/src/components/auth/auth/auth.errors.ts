const DEFAULT_API_ERROR_MESSAGE = "요청 처리 중 문제가 발생했습니다.";

export const getApiErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? DEFAULT_API_ERROR_MESSAGE;
  } catch {
    return DEFAULT_API_ERROR_MESSAGE;
  }
};
