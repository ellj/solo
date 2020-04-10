import React, { useState, useCallback } from "react";
import { Input, Select, Button } from "solo-uswds";
import {
  WarehouseUser,
  PaginatedApiResponse,
  createFakeUsers
} from "solo-types";
import { useAuthContext } from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface QueryUser {
  options: Array<string>;
  defaultOption?: string;
}

const QueryUser: React.FC<QueryUser> = ({ options }) => {
  const { apiCall } = useAuthContext();

  const [currentOption, setCurrentOption] = useState(options[0]);

  const [currentValue, setCurrentValue] = useState("");

  const onOptionChange: React.ChangeEventHandler<HTMLSelectElement> = event => {
    setCurrentOption(event.currentTarget.value);
  };

  const onValueChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setCurrentValue(event.currentTarget.value);
    fetchWarehouseUser();
  };

  const [user, setUser] = useState<WarehouseUser[]>([]);

  const fetchWarehouseUser = useCallback(async () => {
    try {
      const { results } = await apiCall<PaginatedApiResponse<WarehouseUser[]>>(
        `/warehouseuser?q=${currentValue}`,
        {
          method: "GET"
        }
      );
      setUser(results);
      // suggestions(results)
    } catch (e) {
      setUser(createFakeUsers(1));
    }
  }, [setUser, apiCall]);

  //   const suggestions = (results) => {
  //     const options = results.map(r => (
  //       <li key={r.id}>
  //         {r.name}
  //       </li>
  //     ))
  //     return <ul>{options}</ul>
  //   }

  return (
    <form className="grid-row flex-row flex-justify-center flex-align-center">
      <div className="grid-col-full tablet:grid-col-2 margin-x-2">
        <Select
          onChange={onOptionChange}
          value={currentOption}
          placeholder="Field"
          defaultMargin
          defaultOutline
        >
          {options.map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid-col-10 tablet:grid-col-3">
        <Input
          defaultMargin
          value={currentValue}
          onChange={onValueChange}
          type="text"
          placeholder="Add New User"
        />
      </div>
      <div className="grid-col-auto">
        <Button square className="margin-top-1" type="submit">
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
      <div className="grid-col-full margin-x-2">
        <p>{user}</p>
      </div>
    </form>
  );
};

export default QueryUser;
