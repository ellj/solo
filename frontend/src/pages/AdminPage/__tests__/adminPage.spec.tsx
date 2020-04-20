import React from "react";
import AdminPage from "../AdminPage";
import { render, fireEvent, wait } from "test-utils";
import {
  defaultUserApiResponse,
  defaultWarehouseMemberApiResponse,
  defaultWareHouseMember,
} from "solo-types";

describe("AdminPage Component", () => {
  const fetchMock = jest.fn();
  const warehouseFetchMock = jest.fn();
  const membersFetchMock = jest.fn();
  const defaultUser = defaultUserApiResponse.results[0];

  beforeEach(() => {
    warehouseFetchMock.mockResolvedValue([
      { id: 1, aac: "testwarehouse1" },
      { id: 2, aac: "testwarehouse2" },
    ]);
    membersFetchMock.mockResolvedValue(defaultWarehouseMemberApiResponse);
    fetchMock.mockImplementation((url: string, ...rest) => {
      if (url === "/warehouse/") {
        return warehouseFetchMock(url, ...rest);
      }
      return membersFetchMock(url, ...rest);
    });
  });

  afterEach(() => {
    warehouseFetchMock.mockReset();
    membersFetchMock.mockReset();
    fetchMock.mockReset();
  });

  const renderAndWaitForData = async () => {
    const { getByText, ...rest } = render(<AdminPage />, {
      authContext: {
        apiCall: fetchMock,
      },
    });
    await wait(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(getByText(defaultUser.username)).toBeInTheDocument();
      expect(getByText(defaultUser.last_name)).toBeInTheDocument();
      expect(getByText(defaultUser.first_name)).toBeInTheDocument();
    });
    return {
      getByText,
      ...rest,
    };
  };

  it("matches snapshot", async () => {
    const { asFragment } = await renderAndWaitForData();
    expect(asFragment()).toMatchSnapshot();
  });

  it("fails to fetch users due to network error", async () => {
    membersFetchMock.mockRejectedValue(new Error("network error"));
    const { queryAllByTestId } = render(<AdminPage />, {
      authContext: {
        apiCall: fetchMock,
      },
    });
    await wait(() => {
      expect(membersFetchMock).toHaveBeenCalled();
      // update checks here once api is integrated
      expect(queryAllByTestId("has-cor-checkbox").length).toBeGreaterThan(0);
    });
  });

  it("click on checkboxes and change permissions", async () => {
    membersFetchMock.mockResolvedValue({
      ...defaultWarehouseMemberApiResponse,
      results: [
        {
          ...defaultWareHouseMember,
          d6t_permission: false,
          cor_permission: false,
        },
      ],
    });
    const { getByTestId, getByText, container } = await renderAndWaitForData();
    await wait(() => {
      expect(getByTestId("has-cor-checkbox")).not.toBeChecked();
      expect(getByTestId("has-d6t-checkbox")).not.toBeChecked();
      expect(getByText("Submit")).toBeDisabled();
    });
    fireEvent.click(getByTestId("has-cor-checkbox"));
    fireEvent.click(getByTestId("has-d6t-checkbox"));
    await wait(() => {
      expect(getByTestId("has-cor-checkbox")).toBeChecked();
      expect(getByTestId("has-d6t-checkbox")).toBeChecked();
      expect(getByText("Submit")).not.toBeDisabled();
    });
    membersFetchMock.mockResolvedValue({});
    fireEvent.click(getByText("Submit"));
    await wait(() => {
      expect(membersFetchMock).toHaveBeenCalledTimes(2);
      expect(membersFetchMock.mock.calls[1][0]).toEqual(
        `/warehouseusers/${defaultWareHouseMember.id}/`
      );
      expect(membersFetchMock.mock.calls[1][1]).toMatchObject({
        method: "PATCH",
        body: JSON.stringify({
          d6t_permission: true,
          cor_permission: true,
        }),
      });
      expect(container.querySelector("svg.fa-check")).toBeInTheDocument();
    });
  });

  it("submit user permissions network error shows error indicator icon", async () => {
    membersFetchMock.mockResolvedValue({
      ...defaultWarehouseMemberApiResponse,
      results: [
        {
          ...defaultWareHouseMember,
          d6t_permission: false,
          cor_permission: false,
        },
      ],
    });
    const { getByTestId, getByText, container } = await renderAndWaitForData();
    await wait(() => {
      expect(getByTestId("has-cor-checkbox")).not.toBeChecked();
      expect(getByTestId("has-d6t-checkbox")).not.toBeChecked();
      expect(getByText("Submit")).toBeDisabled();
    });
    fireEvent.click(getByTestId("has-cor-checkbox"));
    fireEvent.click(getByTestId("has-d6t-checkbox"));
    await wait(() => {
      expect(getByTestId("has-cor-checkbox")).toBeChecked();
      expect(getByTestId("has-d6t-checkbox")).toBeChecked();
      expect(getByText("Submit")).not.toBeDisabled();
    });
    membersFetchMock.mockRejectedValue(new Error());
    fireEvent.click(getByText("Submit"));
    await wait(() => {
      expect(membersFetchMock).toHaveBeenCalledTimes(2);
      expect(
        container.querySelector("svg.fa-exclamation-circle")
      ).toBeInTheDocument();
    });
  });

  it("submit user permissions network error with message shows error indicator icon", async () => {
    membersFetchMock.mockResolvedValue({
      ...defaultUserApiResponse,
      results: [
        {
          ...defaultWareHouseMember,
          d6t_permission: false,
          cor_permission: false,
        },
      ],
    });
    const { getByTestId, getByText, container } = await renderAndWaitForData();
    await wait(() => {
      expect(getByTestId("has-cor-checkbox")).not.toBeChecked();
      expect(getByTestId("has-d6t-checkbox")).not.toBeChecked();
      expect(getByText("Submit")).toBeDisabled();
    });
    fireEvent.click(getByTestId("has-cor-checkbox"));
    fireEvent.click(getByTestId("has-d6t-checkbox"));
    await wait(() => {
      expect(getByTestId("has-cor-checkbox")).toBeChecked();
      expect(getByTestId("has-d6t-checkbox")).toBeChecked();
      expect(getByText("Submit")).not.toBeDisabled();
    });
    const err = new Error();
    err.message = "some error message";
    membersFetchMock.mockRejectedValue(err);
    fireEvent.click(getByText("Submit"));
    await wait(() => {
      expect(membersFetchMock).toHaveBeenCalledTimes(2);
      expect(
        container.querySelector("svg.fa-exclamation-circle")
      ).toBeInTheDocument();
    });
  });

  it("checking permission options only updates user for that row", async () => {
    membersFetchMock.mockResolvedValue({
      ...defaultWarehouseMemberApiResponse,
      results: [
        {
          ...defaultWareHouseMember,
          id: 5,
        },
        {
          ...defaultWareHouseMember,
          id: 42,
          user: {
            ...defaultUser,
            first_name: "Jeff",
            last_name: "Hackshaw",
            username: "5678567567",
          },
        },
      ],
    });
    const { getAllByTestId, getAllByText } = await renderAndWaitForData();
    await wait(() => {
      expect(getAllByTestId("has-cor-checkbox")).toHaveLength(2);
      expect(getAllByTestId("has-cor-checkbox")[0]).not.toBeChecked();
      expect(getAllByTestId("has-cor-checkbox")[1]).not.toBeChecked();
      expect(getAllByText("Submit")).toHaveLength(2);
      expect(getAllByText("Submit")[0]).toBeDisabled();
      expect(getAllByText("Submit")[1]).toBeDisabled();
    });
    fireEvent.click(getAllByTestId("has-cor-checkbox")[0]);
    await wait(() => {
      expect(getAllByTestId("has-cor-checkbox")[0]).toBeChecked();
      expect(getAllByText("Submit")[0]).not.toBeDisabled();
    });
  });
});
