import { useState, useCallback, useEffect } from "react";
import {
  LoadingStatus,
  createFakeUsers,
  User,
  WarehouseUser,
  Warehouse
} from "solo-types";
import { useAuthContext } from "context";

const usersToWarehouseUsers = (users: User[]): WarehouseUser[] =>
  users.map(user => ({
    ...user,
    canCOR: false,
    canD6T: false,
    manager: false,
    aac: ""
  }));

const useGlobalUsers = () => {
  const { apiCall } = useAuthContext();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({
    loading: false
  });
  const [usersFound, setUsersFound] = useState<WarehouseUser[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const searchUsers = useCallback(
    async (query: string) => {
      setLoadingStatus({
        loading: true,
        error: false
      });
      try {
        const users = await apiCall<User[]>(`/users/?q=${query}`, {
          method: "GET"
        });
        setUsersFound(usersToWarehouseUsers(users));
        setLoadingStatus({
          loading: false
        });
      } catch (e) {
        setUsersFound(usersToWarehouseUsers(createFakeUsers(25)));
        setLoadingStatus({
          loading: false
        });
      }
    },
    [setLoadingStatus, setUsersFound, apiCall]
  );

  const listManagedWarehouses = useCallback(async () => {
    try {
      const warehouses = await apiCall<Warehouse[]>("/warehouse/", {
        method: "GET"
      });
      setWarehouses(warehouses);
    } catch (e) {
      setWarehouses([
        { id: 1, aac: "test1" },
        { id: 2, aac: "test2" }
      ]);
    }
  }, [setWarehouses]);

  useEffect(() => {
    listManagedWarehouses();
  }, []);

  const getUserById = useCallback(
    (userId: number) =>
      usersFound.find(user => user.id === userId) as WarehouseUser,
    [usersFound]
  );

  const modifyUser = useCallback(
    (userId: number, data: Partial<WarehouseUser>) => {
      setUsersFound(
        usersFound.map(user =>
          user.id === userId ? { ...user, ...data, hasModified: true } : user
        )
      );
    },
    [setUsersFound, usersFound]
  );

  const deleteUser = useCallback(
    (userId: number) => {
      setUsersFound(users => users.filter(user => user.id !== userId));
    },
    [setUsersFound]
  );

  const addUserToWarehouse = useCallback(
    async (userId: number, warehouseId: number) => {
      modifyUser(userId, {
        loading: true,
        error: false
      });
      try {
        const { canD6T, canCOR } = getUserById(userId);
        await apiCall(`/warehouse/users/`, {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            warehouse_id: warehouseId, // id of the warehouse
            canD6T,
            canCOR
          })
        });
        deleteUser(userId);
      } catch (e) {
        modifyUser(userId, {
          loading: false,
          error: true,
          message: e.message || "Something went wrong"
        });
      }
    },
    [apiCall, getUserById, modifyUser]
  );

  return {
    loadingStatus,
    searchUsers,
    usersFound,
    addUserToWarehouse,
    warehouses,
    modifyUser,
    listManagedWarehouses
  };
};

export default useGlobalUsers;
