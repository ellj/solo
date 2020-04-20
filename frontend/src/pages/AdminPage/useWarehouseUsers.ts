import { useState, useCallback } from "react";
import {
  PaginatedApiResponse,
  LoadingStatus,
  createFakeWarehouseMembers,
  WarehouseMember,
  Query,
} from "solo-types";
import { useAuthContext } from "context";

// interface ApiWarehouseUser {
//   id: number;
//   warehouse: string;
//   cor_permission: boolean;
//   d6t_permission: boolean;
//   manager: boolean;
//   user: {
//     id: number;
//     username: string;
//     first_name: string;
//     last_name: string;
//   };
// }

const useWarehouseUsers = () => {
  const { apiCall } = useAuthContext();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({
    loading: false,
  });
  const [pageCount, setPageCount] = useState<number>(0);
  const [members, setMembers] = useState<WarehouseMember[]>([]);

  const fetchWarehouseMembers = useCallback(
    async ({ filters }: Query<WarehouseMember>) => {
      setLoadingStatus({
        loading: true,
        error: false,
      });
      try {
        const params = new URLSearchParams();
        filters.forEach(({ id, value }) => {
          params.set(id, value);
        });
        const queryString = params.toString();
        const { results, count } = await apiCall<
          PaginatedApiResponse<WarehouseMember[]>
        >(`/warehouseusers/${queryString ? "?" + queryString : ""}`, {
          method: "GET",
        });
        setMembers(results);
        setPageCount(Math.ceil(count / 25));
        setLoadingStatus({
          loading: false,
        });
      } catch (e) {
        setMembers(createFakeWarehouseMembers(25));
        setPageCount(9);
        setLoadingStatus({
          loading: false,
        });
      }
    },
    [setLoadingStatus, setMembers, apiCall]
  );

  const insertWarehouseMember = useCallback((member: WarehouseMember) => {
    setMembers((previous) => [member, ...previous]);
  }, []);

  const modifyWarehouseMember = useCallback(
    (id: number, data: Partial<WarehouseMember>) => {
      setMembers((members) =>
        members.map((member) =>
          member.id === id ? { ...member, ...data, hasModified: true } : member
        )
      );
    },
    []
  );

  const getMembershipById = useCallback(
    (id: number) =>
      members.find((member) => member.id === id) as WarehouseMember,
    [members]
  );

  const updateMemberPermissions = useCallback(
    async (membershipId: number) => {
      modifyWarehouseMember(membershipId, {
        loading: true,
        error: false,
      });
      try {
        const { d6t_permission, cor_permission } = getMembershipById(
          membershipId
        );
        await apiCall(`/warehouseusers/${membershipId}/`, {
          method: "PATCH",
          body: JSON.stringify({
            d6t_permission,
            cor_permission,
          }),
        });
        modifyWarehouseMember(membershipId, {
          loading: false,
        });
      } catch (e) {
        modifyWarehouseMember(membershipId, {
          loading: false,
          error: true,
          message: e.message || "Something went wrong",
        });
      }
    },
    [apiCall, getMembershipById, modifyWarehouseMember]
  );

  return {
    loadingStatus,
    insertWarehouseMember,
    modifyWarehouseMember,
    updateMemberPermissions,
    pageCount,
    members,
    fetchWarehouseMembers,
  };
};

export default useWarehouseUsers;
