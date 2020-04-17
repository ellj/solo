import { WarehouseUser, User, PaginatedApiResponse } from "solo-types";
import * as faker from "faker";

export const defaultUser: User = {
  id: 1,
  username: "1234123123",
  first_name: "testFirst",
  last_name: "testLast",
  loading: false
};

export const defaultWareHouseUser: WarehouseUser = {
  ...defaultUser,
  aac: "testaac",
  canD6T: false,
  canCOR: false
};

export const defaultUserApiResponse: PaginatedApiResponse<User[]> = {
  results: [defaultUser],
  count: 10,
  next: 2,
  previous: 1
};

export const defaultWarehouseUserApiResponse: PaginatedApiResponse<WarehouseUser[]> = {
  results: [defaultWareHouseUser],
  count: 10,
  next: 2,
  previous: 1
};

export const createFakeUsers = (count: number = 25): User[] => {
  return Array.from({ length: count }).map((_, idx) => ({
    ...defaultWareHouseUser,
    id: idx + 1,
    username: faker.finance.account(10),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName()
  }));
};

export const createFakeWarehouseUsers = (
  count: number = 25
): WarehouseUser[] => {
  return createFakeUsers(count).map(user => ({
    ...user,
    aac: faker.random.arrayElement(["M30300", "M30305"]),
    canCOR: faker.random.boolean(),
    canD6T: faker.random.boolean()
  }));
};
