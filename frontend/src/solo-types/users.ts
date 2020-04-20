import { WarehouseMember, User, PaginatedApiResponse } from "solo-types";
import * as faker from "faker";

export const defaultUser: User = {
  id: 1,
  username: "1234123123",
  first_name: "testFirst",
  last_name: "testLast",
  loading: false,
};

export const defaultWareHouseMember: WarehouseMember = {
  id: 1,
  user: defaultUser,
  warehouse: "testaac",
  d6t_permission: false,
  cor_permission: false,
  manager: false,
  loading: false
};

export const defaultUserApiResponse: PaginatedApiResponse<User[]> = {
  results: [defaultUser],
  count: 10,
  next: 2,
  previous: 1,
};

export const defaultWarehouseMemberApiResponse: PaginatedApiResponse<WarehouseMember[]> = {
  results: [defaultWareHouseMember],
  count: 10,
  next: 2,
  previous: 1,
};

export const createFakeUsers = (count: number = 25): User[] => {
  return Array.from({ length: count }).map((_, idx) => ({
    ...defaultUser,
    id: idx + 1,
    username: faker.finance.account(10),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
  }));
};

export const createFakeWarehouseMembers = (
  count: number = 25
): WarehouseMember[] => {
  return createFakeUsers(count).map((user, idx) => ({
    user,
    id: idx,
    warehouse: "",
    aac: faker.random.arrayElement(["M30300", "M30305"]),
    cor_permission: faker.random.boolean(),
    d6t_permission: faker.random.boolean(),
    manager: false,
    loading: false
  }));
};
