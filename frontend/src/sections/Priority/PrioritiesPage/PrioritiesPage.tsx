import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppSelector } from "../../../store/redux";
import Header from "../../../components/Header/Header";
import ModalNewTask from "../../../components/ModalNewTask/ModalNewTask";
import TaskCard from "../../../components/TaskCard/TaskCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Priority,
  Task,
  useGetProfileQuery,
  useGetTasksByUserQuery,
  useDeleteTaskMutation,
} from "../../../state/api";
import styles from "./PrioritiesPage.module.scss";

type Props = {
  priority: Priority;
  headerName: string;
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
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
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
    renderCell: (params) => params.value.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    headerClassName: "dataGridHeaderColor",
    width: 150,
    renderCell: (params) => params.value.username || "Unassigned",
  },
];

const PrioritiesPage = ({ priority, headerName }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const { data: currentUser } = useGetProfileQuery();
  const userId = currentUser?.userId ?? null;
  const {
    data: tasks,
    isLoading,
    isError: isTasksError,
  } = useGetTasksByUserQuery(userId || 0, {
    skip: userId === null,
  });
  const [deleteTask] = useDeleteTaskMutation();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority === priority
  );

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask({ taskId }).unwrap();
      toast.success(`Task deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(`Failed to delete task. Please try again.`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (isTasksError || !tasks) return <div>Error fetching tasks</div>;

  return (
    <div className={styles.container}>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name={headerName}
        buttonComponent={
          <button
            className={`${styles.headerButton} roundButton`}
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            +
          </button>
        }
      />
      <div className={styles.viewButtons}>
        <button
          className={view === "list" ? styles.active : styles.inactive}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={view === "table" ? styles.active : styles.inactive}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>
      {isLoading ? (
        <div>Loading tasks...</div>
      ) : view === "list" ? (
        <div className={styles.grid}>
          {filteredTasks?.map((task: Task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => handleDelete(task.id)}
            />
          ))}
        </div>
      ) : (
        view === "table" &&
        filteredTasks && (
          <div className={styles.tableContainer}>
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={`${styles.dataGridStyle} dataGridColor`}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  '& [role="row"] > *': {
                    borderColor: `${isDarkMode ? "#2d3135" : ""}`,
                    backgroundColor: `${isDarkMode ? "#4666b1" : "#bfd0e7"}`,
                    color: `${isDarkMode ? "#f2ebeb" : "#0b0c0d"}`,
                  },
                },
                "& .MuiDataGrid-checkboxInput .MuiSvgIcon-root": {
                  color: `${isDarkMode ? "#e9ebee" : "#424345"}`, // Adjust checkbox color
                },
                "& .MuiDataGrid-checkboxInput.Mui-checked .MuiSvgIcon-root": {
                  color: `${isDarkMode ? "#f2f1ef" : "#326196"}`, // Adjust checked checkbox color
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
                  borderBottom: `1px solid ${
                    isDarkMode ? "#2d3135" : "#e5e7eb"
                  }`,
                },
                "& .MuiDataGrid-withBorderColor": {
                  borderColor: `${isDarkMode ? "#2d3135" : "e5e7eb"}`,
                },
              }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default PrioritiesPage;
