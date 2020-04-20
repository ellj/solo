import { useState, useCallback, useEffect, useRef } from "react";
import { LoadingStatus, User, WarehouseMember, Warehouse } from "solo-types";
import { useAuthContext } from "context";

type Timer = undefined | number | ReturnType<typeof setTimeout>;

const usersToWarehouseUsers = (users: User[]): WarehouseMember[] =>
  users.map((user) => ({
    user,
    id: 0,
    loading: false,
    cor_permission: false,
    d6t_permission: false,
    manager: false,
    warehouse: "",
    hasModified: true,
  }));

const useGlobalUsers = () => {
  const { apiCall } = useAuthContext();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({
    loading: false,
  });
  const [usersFound, setUsersFound] = useState<WarehouseMember[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [filter, setFilter] = useState<string>("");
  const skipFirstRender = useRef(true);

  const searchUsers = useCallback(
    async (query: string) => {
      if (!selectedWarehouse?.id) {
        return;
      }
      setLoadingStatus({
        loading: true,
        error: false,
      });
      try {
        const url = `/warehouse/${selectedWarehouse.id}/eligibleusers/?q=${query}`;
        const users = await apiCall<User[]>(url, {
          method: "GET",
        });
        setUsersFound(usersToWarehouseUsers(users));
        setLoadingStatus({
          loading: false,
        });
      } catch (e) {
        setLoadingStatus({
          loading: false,
          error: e.message ?? "Error",
        });
      }
    },
    [setLoadingStatus, setUsersFound, apiCall, selectedWarehouse]
  );

  const onFilterChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFilter(e.currentTarget.value);
  };

  const getMembershipByUserId = useCallback(
    (userId: number) => {
      return usersFound.find(
        (membership) => membership.user.id === userId
      ) as WarehouseMember;
    },
    [usersFound]
  );

  const modifyMembershipByUserId = useCallback(
    (userId: number, data: Partial<WarehouseMember>) => {
      setUsersFound((usersFound) =>
        usersFound.map((membership) =>
          membership.user.id === userId
            ? { ...membership, ...data }
            : membership
        )
      );
    },
    []
  );

  const removeMembershipByUserId = useCallback((userId: number) => {
    setUsersFound((usersFound) =>
      usersFound.filter((membership) => membership.user.id !== userId)
    );
  }, []);

  const addUserToWarehouse = useCallback(
    async (userId: number, warehouseId: number) => {
      modifyMembershipByUserId(userId, {
        loading: true,
        error: false,
      });
      try {
        const { d6t_permission, cor_permission } = getMembershipByUserId(
          userId
        );
        const result = await apiCall<WarehouseMember>(`/warehouseusers/`, {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            warehouse_id: warehouseId,
            cor_permission,
            d6t_permission,
          }),
        });
        removeMembershipByUserId(userId);
        return result;
      } catch (e) {
        modifyMembershipByUserId(userId, {
          loading: false,
          error: true,
          message: e.message || "Something went wrong",
        });
      }
    },
    [apiCall, modifyMembershipByUserId, getMembershipByUserId]
  );

  const listManagedWarehouses = useCallback(async () => {
    try {
      const warehouses = await apiCall<Warehouse[]>("/warehouse/", {
        method: "GET",
      });
      setWarehouses(warehouses);
    } catch (e) {
      setWarehouses([
        { id: 1, aac: "test1" },
        { id: 2, aac: "test2" },
      ]);
    }
  }, [setWarehouses]);

  const onSelectWarehouse: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      setSelectedWarehouse(
        warehouses.find(
          (warehouse) => warehouse.id === parseInt(e.currentTarget.value)
        ) ?? null
      );
    },
    [warehouses]
  );

  useEffect(() => {
    let timeout: Timer = undefined;
    if (skipFirstRender.current) {
      skipFirstRender.current = false;
    } else if (filter) {
      timeout = setTimeout(() => searchUsers(filter), 500);
    }
    return () => clearTimeout(timeout as number);
  }, [filter]);

  useEffect(() => {
    listManagedWarehouses();
  }, []);

  useEffect(() => {
    setSelectedWarehouse(warehouses[0] ?? null);
  }, [warehouses]);

  useEffect(() => {
    setFilter("");
    setUsersFound([]);
  }, [selectedWarehouse]);

  return {
    loadingStatus,
    searchUsers,
    usersFound,
    filter,
    onFilterChange,
    addUserToWarehouse,
    warehouses,
    selectedWarehouse,
    onSelectWarehouse,
    modifyMembershipByUserId,
    listManagedWarehouses,
  };
};

export default useGlobalUsers;
