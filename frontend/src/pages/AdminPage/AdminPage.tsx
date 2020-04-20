import React, { useMemo, useCallback } from "react";
import { Title, Table, SelectFilterControls } from "components";
import createColumnsUserList from "./tableColumnsUserList";
import createColumnsUserAdd from "./tableColumnsUserAdd";
import useWarehouseUsers from "./useWarehouseUsers";
import useGlobalUsers from "./useGlobalUsers";
import { WarehouseMember } from "solo-types";
import { TableInstance } from "react-table";
import AddUserControls from "./AddUserControls";

const filterable = [
  { name: "Last Name", value: "lastName" },
  { name: "DODID", value: "dodid" },
];

const AdminPage: React.FC = () => {
  const {
    modifyWarehouseMember,
    insertWarehouseMember,
    updateMemberPermissions,
    fetchWarehouseMembers,
    members,
  } = useWarehouseUsers();
  const {
    usersFound,
    onFilterChange,
    filter,
    modifyMembershipByUserId,
    addUserToWarehouse,
    warehouses,
    selectedWarehouse,
    onSelectWarehouse,
  } = useGlobalUsers();

  const onAddUserToWarehouse = useCallback(
    async (userId: number) => {
      if (!selectedWarehouse?.id) {
        // set some error state here
        console.error("must select a warehouse...");
      } else {
        const result = await addUserToWarehouse(userId, selectedWarehouse.id);
        if (result) {
          insertWarehouseMember(result);
        }
      }
    },
    [selectedWarehouse, addUserToWarehouse, usersFound]
  );

  const tableColumns = useMemo(
    () => createColumnsUserList(modifyWarehouseMember, updateMemberPermissions),
    [modifyWarehouseMember, updateMemberPermissions]
  );

  const foundUsersTableColumns = useMemo(
    () =>
      createColumnsUserAdd(
        modifyMembershipByUserId,
        onAddUserToWarehouse,
        selectedWarehouse?.aac
      ),
    [modifyMembershipByUserId, onAddUserToWarehouse]
  );

  const renderFilterControls = (table: TableInstance<WarehouseMember>) => {
    const { setGlobalFilter } = table;
    return (
      <SelectFilterControls options={filterable} onSubmit={setGlobalFilter} />
    );
  };

  return (
    <div className="tablet:margin-x-8 overflow-x-auto overflow-y-hidden">
      <Title>User Administration</Title>
      <Table<WarehouseMember>
        columns={tableColumns}
        data={members}
        renderFilterControls={renderFilterControls}
        fetchData={fetchWarehouseMembers}
      />

      <h2>Add users</h2>
      <AddUserControls
        filter={filter}
        onFilterChange={onFilterChange}
        warehouses={warehouses}
        onWarehouseChange={onSelectWarehouse}
      />
      {usersFound.length ? (
        <Table<WarehouseMember>
          columns={foundUsersTableColumns}
          data={usersFound}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminPage;
