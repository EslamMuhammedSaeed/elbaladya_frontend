import { Table } from "@components/Table/Table";
import styles from "./Groups.module.scss";
import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import type { Column, FilterField, MetaData, GroupInfo } from "@utils/types";
import { useTranslation } from "react-i18next";
import AddGroupModal from "@components/AddGroupModal/AddGroupModal";

import {
  GET_ALL_GROUPS,
  GET_ALL_GROUPS_NOT_PAGINATED,
} from "@quiries/groups/getAllGroups";

export default function Groups() {
  const { t, i18n } = useTranslation();
  const columns: Column<GroupInfo>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    {
      key: "category",
      header: "Category",
      render: (row) => <td>{t(`addGroupModal.${row.category}`)}</td>,
    },
    { key: "usersCount", header: "Users Count" },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isRefetching] = useState(false);
  const [finalFilterValues, setFinalFilterValues] = useState<
    Record<string, string>
  >({
    id: "",
    name: "",
  });
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);

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
  });

  const filters: FilterField[] = [
    { name: "id", label: "ID", type: "text" },
    { name: "name", label: "Name", type: "text" },
  ];

  const { data, loading, refetch } = useQuery(GET_ALL_GROUPS, {
    variables: {
      page: currentPage,
      perPage: 10,
      sortBy,
      filters: finalFilterValues,
    },
    fetchPolicy: "cache-and-network",
  });

  const [fetchExportData] = useLazyQuery(GET_ALL_GROUPS_NOT_PAGINATED, {
    fetchPolicy: "network-only",
  });
  //   const nameKey = i18n.language === "ar" ? "arabicName" : "englishName";
  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Users Count", value: "usersCount" },
  ];

  useEffect(() => {
    if (!data?.getAllGroupsPaginated?.data) return;

    const groupsData: GroupInfo[] = data.getAllGroupsPaginated.data;

    const metaData = data.getAllGroupsPaginated;
    setGroups(groupsData);
    setMeta((prev) => ({
      ...prev,
      total: metaData.total,
      last_page: metaData.last_page,
      per_page: metaData.per_page,
      current_page: metaData.current_page,
      from: (metaData.current_page - 1) * metaData.per_page + 1,
      to: (metaData.current_page - 1) * metaData.per_page + groupsData.length,
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

  // const handleCreateGroup = () => {
  //   setShowAddGroupModal(false);

  // };

  const handleApply = async () => {
    setCurrentPage(1);
    setFinalFilterValues(filterValues);
  };

  const handleReset = async () => {
    const resetFilters = {
      id: "",
      name: "",
    };
    setCurrentPage(1);
    setFilterValues(resetFilters);
    setFinalFilterValues(resetFilters);
  };

  return (
    <div className={styles.dataWrapper}>
      <Table<GroupInfo>
        data={groups}
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
        title="Groups"
        addButton={true}
        onAdd={() => setShowAddGroupModal(true)}
        exportEnabled={true}
        onExport={async () => {
          try {
            const { data } = await fetchExportData({
              variables: {
                filters: filterValues,
                sortBy,
              },
            });

            if (data?.getAllGroups) {
              const groupsToExport = data.getAllGroups.data;
              // console.log("Exported groups:", groupsToExport);

              return groupsToExport;
            }
          } catch (error) {
            console.error("Export failed:", error);
          }
        }}
        exportFileName="groups"
      />
      {showAddGroupModal && (
        <AddGroupModal
          onClose={() => setShowAddGroupModal(false)}
          // onCreate={handleCreateGroup}
          refetch={refetch}
        />
      )}
    </div>
  );
}
