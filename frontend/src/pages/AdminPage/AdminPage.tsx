import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Title, Table, SelectFilterControls } from "components";
import { Input, Select } from "solo-uswds";
import createColumns from "./tableColumns";
import useWarehouseUsers from "./useWarehouseUsers";
import useGlobalUsers from "./useGlobalUsers";
import { WarehouseUser } from "solo-types";

const filterable = [
  { name: "Last Name", value: "sdn" },
  { name: "DODID", value: "nsn" }
];

const setGlobalFilter = () => {};

const AdminPage: React.FC = () => {
  const [userFilter, setUserFilter] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null
  );
  const {
    //loadingStatus,
    modifyWarehouseUser,
    updateUserPermissons,
    // pageCount,
    users
  } = useWarehouseUsers();
  const {
    usersFound,
    searchUsers,
    modifyUser,
    addUserToWarehouse,
    warehouses
  } = useGlobalUsers();

  const tableColumns = useMemo(
    () => createColumns(modifyWarehouseUser, updateUserPermissons),
    [modifyWarehouseUser, updateUserPermissons]
  );

  const onAddUserToWarehouse = useCallback(
    (userId: number) => {
      if (!selectedWarehouseId) {
        // set some error state here
        console.error("must select a warehouse...");
      } else {
        return addUserToWarehouse(userId, selectedWarehouseId);
      }
    },
    [selectedWarehouseId]
  );

  const foundUsersTableColumns = useMemo(
    () => createColumns(modifyUser, onAddUserToWarehouse),
    [modifyUser, addUserToWarehouse]
  );

  const onUserFilterChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setUserFilter(e.currentTarget.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchUsers(userFilter);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [userFilter]);

  return (
    <div className="tablet:margin-x-8 overflow-x-auto">
      <Title>User Administration</Title>
      <h2>All Users with the same AAC</h2>
      <SelectFilterControls options={filterable} onSubmit={setGlobalFilter} />
      <Table<WarehouseUser> columns={tableColumns} data={users} />
      <h2>Add users</h2>
      <Input
        defaultMargin
        value={userFilter}
        onChange={onUserFilterChange}
        type="text"
        placeholder="Search Users"
      />
      <Select
        onChange={e => setSelectedWarehouseId(parseInt(e.currentTarget.value))}
      >
        {warehouses.map(warehouse => (
          <option key={warehouse.id} value={warehouse.id}>
            {warehouse.aac}
          </option>
        ))}
      </Select>
      {usersFound.length && (
        <Table<WarehouseUser>
          columns={foundUsersTableColumns}
          data={usersFound}
        />
      )}
    </div>
  );
};

export default AdminPage;
