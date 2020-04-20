import React from "react";
import { Column } from "react-table";
import { LoadingIcon } from "components";
import { WarehouseMember } from "solo-types";
import { Checkbox, Button } from "solo-uswds";

type CreateColumns = (
  modifyWarehouseUser: (userId: number, data: Partial<WarehouseMember>) => void,
  updateUserPermissons: (userId: number) => void
) => Column<WarehouseMember>[];

const createColumns: CreateColumns = (
  modifyWarehouseUser,
  updateUserPermissons
) => [
  {
    Header: "Loading",
    id: "loading",
    disableSortBy: true,
    Cell: ({
      row: {
        original: { loading, error },
      },
    }) => <LoadingIcon loading={loading} error={error} />,
  },
  {
    Header: "AAC",
    accessor: "warehouse",
  },
  {
    Header: "First Name",
    accessor: "user.first_name",
  },
  {
    Header: "Last Name",
    accessor: "user.last_name",
  },
  {
    Header: "DODID",
    accessor: "user.username",
  },
  {
    Header: "D6T",
    id: "d6t_permission",
    disableSortBy: true,
    Cell: ({
      row: {
        original: { d6t_permission, id },
      },
    }) => {
      return (
        <div className="padding-left-2">
          <Checkbox
            data-testid="has-d6t-checkbox"
            checked={d6t_permission}
            onChange={(e) => {
              modifyWarehouseUser(id, {
                d6t_permission: e.target.checked,
              });
            }}
          />
        </div>
      );
    },
  },
  {
    Header: "COR",
    id: "cor_permission",
    disableSortBy: true,
    Cell: ({
      row: {
        original: { id, cor_permission },
      },
    }) => {
      return (
        <div className="padding-left-2">
          <Checkbox
            data-testid="has-cor-checkbox"
            checked={cor_permission}
            onChange={(e) => {
              modifyWarehouseUser(id, {
                cor_permission: e.target.checked,
              });
            }}
          />
        </div>
      );
    },
  },
  {
    Header: "Submit Permissions",
    id: "submit",
    disableSortBy: true,
    Cell: ({
      row: {
        original: { id, hasModified },
      },
    }) => {
      return (
        <div className="padding-left-2">
          <Button
            disabled={!hasModified}
            onClick={() => {
              updateUserPermissons(id);
            }}
          >
            Submit
          </Button>
        </div>
      );
    },
  },
];

export default createColumns;
