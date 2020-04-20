import React from "react";
import { Column } from "react-table";
import { LoadingIcon } from "components";
import { WarehouseMember } from "solo-types";
import { Checkbox, Button } from "solo-uswds";

type CreateColumns = (
  modifyUser: (userId: number, data: Partial<WarehouseMember>) => void,
  addUserToWarehouse: (userId: number) => void,
  selectedAAC?: string | null
) => Column<WarehouseMember>[];

const createColumns: CreateColumns = (
  modifyUser,
  addUserToWarehouse,
  selectedAAC = ""
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
    id: "warehouse",
    accessor: () => selectedAAC,
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
        original: {
          d6t_permission,
          user: { id },
        },
      },
    }) => {
      return (
        <div className="padding-left-2">
          <Checkbox
            data-testid="has-d6t-checkbox"
            checked={d6t_permission}
            onChange={(e) => {
              modifyUser(id, {
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
        original: {
          user: { id },
          cor_permission,
        },
      },
    }) => {
      return (
        <div className="padding-left-2">
          <Checkbox
            data-testid="has-cor-checkbox"
            checked={cor_permission}
            onChange={(e) => {
              modifyUser(id, {
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
        original: {
          user: { id },
          hasModified,
        },
      },
    }) => {
      return (
        <div className="padding-left-2">
          <Button
            disabled={!hasModified}
            onClick={() => {
              addUserToWarehouse(id);
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
