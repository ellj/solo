import React, { useMemo } from "react";
import { Title, Table, SelectFilterControls } from "components";
import createColumns from "./tableColumns";
import useWarehouseUsers from "./useWarehouseUsers";
import { WarehouseUser } from "solo-types";
import QueryUser from "components/QueryUser/QueryUser";

const aacFilterable = ["M30300", "M30305"];

const filterable = [
  { name: "Last Name", value: "sdn" },
  { name: "DODID", value: "nsn" }
];

const setGlobalFilter = () => {}

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
      <Table<WarehouseUser>
        columns={tableColumns}
        data={users}
      />

      {/* show search results based on edipi (backend username) or last name (backend last_name) */}
      {/* <SelectFilterControls options={aacFilterable} onSubmit={setGlobalFilter} /> */}
      <QueryUser options={aacFilterable} />
      <Table<WarehouseUser>
        columns={tableColumns}
        data={users}
      />
    </div>
  );
};

export default AdminPage;
