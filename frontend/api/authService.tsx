import { Token } from "../types/token";
import { User, LoginUser } from "../types/user";
import fetchData from "../utils/fetchData";

interface CreateOrLogin {
  strategy?: string;
  email: string;
  id: string;
  accessToken: Token;
  refreshToken: Token;
  name: string;
}

export const postUser = (newUser: User): Promise<User> => {
  return fetchData(`/auth/register`, { method: "POST", data: newUser });
};

export const login = (credentials: LoginUser): Promise<User> => {
  return fetchData("/auth/login", { method: "POST", data: credentials, serverSide: true });
};

export const createOrLoginUserAzure = (azureAccessToken: string): Promise<CreateOrLogin> => {
  return fetchData(`/auth/registerAzure`, {
    method: "POST",
    data: { token: azureAccessToken },
    serverSide: true,
  });
};

export const refreshToken = (token: string): Promise<Token> => {
  return fetchData("/auth/refresh", { token, serverSide: true });
};
