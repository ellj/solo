import React from "react";
import { Select, Input } from "solo-uswds";
import { Warehouse } from "solo-types";

interface Props {
  filter: string;
  onFilterChange: React.ChangeEventHandler<HTMLInputElement>;
  warehouses: Warehouse[];
  onWarehouseChange: React.ChangeEventHandler<HTMLSelectElement>;
}

const AddUserControls: React.FC<Props> = ({
  filter,
  onFilterChange,
  warehouses,
  onWarehouseChange,
}) => {
  return (
    <div className="grid-row flex-row flex-align-center padding-bottom-5">
      <div className="margin-right-3">
        <Input
          value={filter}
          onChange={onFilterChange}
          type="text"
          placeholder="Search Users"
        />
      </div>
      <div>
        <Select onChange={onWarehouseChange}>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.aac}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default AddUserControls;
