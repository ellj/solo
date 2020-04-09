import React, { useMemo } from "react";
import { Title, Table } from "components";
import createColumns from "./tableColumns";
import useWarehouseUsers from "./useWarehouseUsers";
import { WarehouseUser } from "solo-types";
import QueryUser from "components/QueryUser/QueryUser";

const AdminPage: React.FC = () => {
  const {
    //loadingStatus,
    modifyWarehouseUser,
    updateUserPermissons,
    // pageCount,
    users
  } = useWarehouseUsers();

  const tableColumns = useMemo(
    () => createColumns(modifyWarehouseUser, updateUserPermissons),
    [modifyWarehouseUser, updateUserPermissons]
  );

  return (
    <div className="tablet:margin-x-8 overflow-x-auto">
      <Title>User Administration</Title>
      {/* show all users with the same aac as the current manager/user */}
      <SelectFilterControls options={filterable} onSubmit={setGlobalFilter} />
      <Table<WarehouseUser> columns={tableColumns} data={users} />
      {/* <QueryUser /> */}
      {/* show search results based on edipi (backend username) or last name (backend last_name) */}
      <SelectFilterControls options={filterable} onSubmit={setGlobalFilter} />
      <Table<WarehouseUser> columns={tableColumns} data={users} />
    </div>
  );
};

export default AdminPage;
