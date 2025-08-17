import { Table } from "@components/Table/Table";
import styles from "./Admins.module.scss";
import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import type { Column, FilterField, MetaData, AdminInfo } from "@utils/types";
import { useTranslation } from "react-i18next";
import AddUserModal from "@components/AddUserModal/AddUserModal";

import {
  GET_ALL_ADMINS,
  GET_ALL_ADMINS_NOT_PAGINATED,
} from "@quiries/admins/getAllAdmins";
import { GET_ALL_ADMIN_GROUPS } from "@quiries/groups/getAllGroups";
import UploadAdminsModal from "@components/UploadModal/UploadAdminsModal";

const columns: Column<AdminInfo>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  {
    key: "group",
    header: "Group",
    render: (row) => <td>{row.group?.name}</td>,
  },
];

export default function Admins() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [admins, setAdmins] = useState<AdminInfo[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isRefetching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { data: groups } = useQuery(GET_ALL_ADMIN_GROUPS, {
    fetchPolicy: "network-only",
  });
  const groupsOptions = groups?.getAllAdminGroups?.data.map(
    (group: { name: string; id: string }) => ({
      label: group.name,
      value: group.id,
    })
  );
  const [meta, setMeta] = useState<MetaData>({
    total: 0,
    last_page: 0,
    per_page: 0,
    current_page: 0,
    from: 0,
    to: 0,
    path: "",
  });
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    id: "",
    name: "",
    email: "",
  });

  const [finalFilterValues, setFinalFilterValues] = useState<
    Record<string, string>
  >({
    id: "",
    name: "",
    email: "",
  });

  const filters: FilterField[] = [
    { name: "id", label: "ID", type: "text" },
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    {
      name: "group",
      label: "Group",
      type: "select",
      options: groupsOptions,
      translate: false,
    },
  ];

  const { data, loading, refetch } = useQuery(GET_ALL_ADMINS, {
    variables: {
      page: currentPage,
      perPage: 10,
      sortBy,
      filters: finalFilterValues,
    },
    fetchPolicy: "cache-and-network",
  });

  const [fetchExportData] = useLazyQuery(GET_ALL_ADMINS_NOT_PAGINATED, {
    fetchPolicy: "network-only",
  });
  //   const nameKey = i18n.language === "ar" ? "arabicName" : "englishName";
  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
  ];

  useEffect(() => {
    if (!data?.getAllAdminsPaginated?.data) return;

    const adminsData: AdminInfo[] = data.getAllAdminsPaginated.data;

    const metaData = data.getAllAdminsPaginated;
    setAdmins(adminsData);
    setMeta((prev) => ({
      ...prev,
      total: metaData.total,
      last_page: metaData.last_page,
      per_page: metaData.per_page,
      current_page: metaData.current_page,
      from: (metaData.current_page - 1) * metaData.per_page + 1,
      to: (metaData.current_page - 1) * metaData.per_page + adminsData.length,
    }));
  }, [data, i18n.language, t]);
  // useEffect(() => {
  //   refetch({
  //     page: currentPage,
  //     perPage: meta.per_page || 10,
  //     sortBy,
  //     filters: filterValues,
  //   });
  // }, [sortBy]);

  const handleApply = async () => {
    setCurrentPage(1);
    setFinalFilterValues(filterValues);
    // setIsRefetching(true);
    // await refetch({
    //   page: currentPage,
    //   perPage: meta.per_page || 10,
    //   sortBy,
    //   filters: filterValues,
    // });
    // setIsRefetching(false);
  };

  const handleReset = async () => {
    // setIsRefetching(true);
    // setFilterValues({});
    const resetFilters = {
      id: "",
      name: "",
      email: "",
    };
    setCurrentPage(1);
    setFilterValues(resetFilters);
    setFinalFilterValues(resetFilters);
    // await refetch({
    //   page: currentPage,
    //   perPage: meta.per_page || 10,
    //   sortBy,
    //   filters: resetFilters,
    // });
    // setIsRefetching(false);
  };

  return (
    <div className={styles.dataWrapper}>
      <Table<AdminInfo>
        data={admins}
        columns={columns}
        currentPage={currentPage}
        totalPages={meta.last_page}
        onPageChange={setCurrentPage}
        loading={loading || isRefetching}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={setFilterValues}
        onApply={handleApply}
        onReset={handleReset}
        onSortChange={setSortBy}
        sort={true}
        sortOptions={sortOptions}
        sortBy={sortBy}
        title="Admins"
        addButton={true}
        onAdd={() => setShowModal(true)}
        uploadEnabled={true}
        onUpload={() => setShowUploadModal(true)}
        exportEnabled={true}
        onExport={async () => {
          try {
            const { data } = await fetchExportData({
              variables: {
                filters: filterValues,
                sortBy,
              },
            });

            if (data?.getAllAdminsNotPaginated) {
              const adminsToExport = data.getAllAdminsNotPaginated.data;
              const transformed = adminsToExport.map((admin: AdminInfo) => ({
                id: admin.id,
                name: admin.name,
                email: admin.email,
                group: admin.group?.name || "",
              }));
              // console.log("Exported groups:", groupsToExport);

              return transformed;
            }
          } catch (error) {
            console.error("Export failed:", error);
          }
        }}
        exportFileName="admins"
      />
      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          userTypeProp="employee"
          refetch={refetch}
          groupsOptions={groupsOptions}
        />
      )}
      {showUploadModal && (
        <UploadAdminsModal
          onClose={() => setShowUploadModal(false)}
          refetch={refetch}
        />
      )}
    </div>
  );
}
