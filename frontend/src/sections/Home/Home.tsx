import styles from "./Home.module.scss";
import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksByUserQuery,
} from "../../state/api";
import { useAppSelector } from "../../store/redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "../../components/Header/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const taskColumns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    headerClassName: "dataGridHeaderColor",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    headerClassName: "dataGridHeaderColor",
    width: 150,
  },
  {
    field: "priority",
    headerName: "Priority",
    headerClassName: "dataGridHeaderColor",
    width: 150,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    headerClassName: "dataGridHeaderColor",
    width: 150,
  },
];

const Home = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksByUserQuery(1);
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;
  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status =
        project.endDate && new Date(project.endDate) < new Date()
          ? "Completed"
          : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    Name: key,
    Priority: priorityCount[key],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#4A90E2",
        barGrid: "#303030",
        text: "#FFFFFF",
      }
    : {
        bar: "#4A90E2",
        barGrid: "#E0E0E0",
        text: "#000000",
      };

  return (
    <div className={styles.homeContainer}>
      <Header name="Dashboard" />
      <div className={styles.grid}>
        <div className={`${styles.card} ${isDarkMode ? styles.dark : ""}`}>
          <h3>Project Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#94b6a1" label>
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name == "Completed" ? "#129673" : "#458ac7"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1dc4ae" : "#1dc4ae",
                  width: "min-content",
                  height: "min-content",
                }}
                cursor={{
                  fill: "transparent",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={`${styles.card} ${isDarkMode ? styles.dark : ""}`}>
          <h3>Your Task Priorities</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="Name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#243953" : "#bbd5f5",
                  width: "min-content",
                  height: "min-content",
                }}
                cursor={{
                  fill: "transparent",
                }}
              />
              <Legend />
              <Bar dataKey="Priority" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div
        className={`${styles.card} ${isDarkMode ? styles.dark : ""} ${
          styles.tasksCard
        }`}
      >
        <h3>Your Tasks</h3>
        <div className={styles.dataGrid}>
          <DataGrid
            rows={tasks}
            columns={taskColumns}
            checkboxSelection
            loading={tasksLoading}
            getRowClassName={() => "data-grid-row"}
            getCellClassName={() => "data-grid-cell"}
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
                borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
              },
              "& .MuiDataGrid-withBorderColor": {
                borderColor: `${isDarkMode ? "#2d3135" : "e5e7eb"}`,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;
