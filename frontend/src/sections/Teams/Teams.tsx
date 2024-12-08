import { useGetTeamsQuery } from "../../state/api";
import { useAppSelector } from "../../store/redux";
import Header from "../../components/Header/Header";
import styles from "./Teams.module.scss";

import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const CustomToolbar = () => (
  <GridToolbarContainer className={`${styles.toolbar} usersToolbarColor`}>
    <GridToolbarExport />
    <GridToolbarFilterButton />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Team ID",
    headerClassName: "dataGridHeaderColor",
    width: 100,
  },
  {
    field: "teamName",
    headerName: "Team Name",
    headerClassName: "dataGridHeaderColor",
    width: 200,
  },
  {
    field: "productOwnerUsername",
    headerName: "Product Owner",
    headerClassName: "dataGridHeaderColor",
    width: 200,
  },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    headerClassName: "dataGridHeaderColor",
    width: 200,
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  return (
    <div className={styles.teamsContainer}>
      <Header name="Teams" />
      <div className={styles.gridContainer}>
        <DataGrid
          rows={teams || []}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={`${styles.dataGrid} dataGridColor`}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              '& [role="row"] > *': {
                borderColor: `${isDarkMode ? "#2d3135" : ""}`,
                backgroundColor: `${isDarkMode ? "#4666b1" : "#bfd0e7"}`,
                color: `${isDarkMode ? "#f2ebeb" : "#0b0c0d"}`,
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
    </div>
  );
};

export default Teams;
