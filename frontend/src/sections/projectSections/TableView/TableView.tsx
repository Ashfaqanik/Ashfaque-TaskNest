import React from "react";
import Header from "../../../components/Header/Header";
import {
  useGetTasksByPriorityQuery,
  useGetTasksQuery,
  useSearchTasksResultsQuery,
} from "../../../state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "./TableView.module.scss";
import { useAppSelector } from "../../../store/redux";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  priority?: string;
  query?: string;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    headerClassName: "dataGridHeaderColor",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    headerClassName: "dataGridHeaderColor",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    headerClassName: "dataGridHeaderColor",
    width: 130,
    renderCell: (params) => (
      <span className={`${styles.status} tableStatusColor`}>
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    headerClassName: "dataGridHeaderColor",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    headerClassName: "dataGridHeaderColor",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    headerClassName: "dataGridHeaderColor",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    headerClassName: "dataGridHeaderColor",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    headerClassName: "dataGridHeaderColor",
    width: 150,
    renderCell: (params) => params.value?.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    headerClassName: "dataGridHeaderColor",
    width: 150,
    renderCell: (params) => params.value?.username || "Unassigned",
  },
];

const TableView: React.FC<Props> = ({
  id,
  setIsModalNewTaskOpen,
  priority = "",
  query = "",
}) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({
    projectId: Number(id),
  });

  const {
    data: priorityTasks,
    error: priorityTasksError,
    isLoading: isPriorityTasksLoading,
  } = useGetTasksByPriorityQuery(
    {
      projectId: Number(id),
      priority,
    },
    {
      skip: priority === "",
    }
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const {
    data: searchTasks,
    error: searchTasksError,
    isLoading: isSearchTasksLoading,
  } = useSearchTasksResultsQuery(
    {
      projectId: Number(id),
      query,
    },
    {
      skip: query === "",
    }
  );
  const displayTasks =
    priority !== "" ? priorityTasks : query !== "" ? searchTasks : tasks;

  if (priority === "" && isLoading) return <div>Loading...</div>;
  if (priority !== "" && isPriorityTasksLoading) return <div>Loading...</div>;
  if (query !== "" && isSearchTasksLoading) return <div>Loading...</div>;

  if (priority === "" && query === "" && error) {
    return <div>An error occurred while fetching tasks</div>;
  }
  if (priority !== "" && priorityTasksError) {
    return <div>An error occurred while fetching tasks</div>;
  }
  if (query !== "" && searchTasksError) {
    return <div>An error occurred while fetching tasks</div>;
  }
  if (!displayTasks?.length) {
    return <div className={styles.noTasksMessage}>No task found.</div>;
  }
  return (
    <div className={styles.tableViewContainer}>
      <div className={styles.headerContainer}>
        <Header
          name="Table"
          buttonComponent={
            <button
              className={`${styles.addButton} roundButton`}
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              +
            </button>
          }
          isSmallText
        />
      </div>
      <DataGrid
        rows={displayTasks || []}
        columns={columns}
        className={`${styles.dataGrid} dataGridColor`}
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            '& [role="row"] > *': {
              borderColor: `${isDarkMode ? "#2d3135" : ""}`,
            },
          },
          "& .MuiIconbutton-root": {
            color: `${isDarkMode ? "#d0cbcb" : ""}`,
          },
          "& .MuiTablePagination-root": {
            color: `${isDarkMode ? "#d0cbcb" : ""}`,
          },
          "& .MuiTablePagination-selectIcon": {
            color: `${isDarkMode ? "#d0cbcb" : ""}`,
          },
          //   "& .MuiDataGrid-cell": {
          //     border: "none",
          //   },
          "& .MuiDataGrid-row": {
            borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
          },
          "& .MuiDataGrid-withBorderColor": {
            borderColor: `${isDarkMode ? "#2d3135" : "e5e7eb"}`,
          },
        }}
      />
    </div>
  );
};

export default TableView;
