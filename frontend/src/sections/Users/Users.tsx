import Header from "../../components/Header/Header";
import { useGetUsersQuery } from "../../state/api";
import { useAppSelector } from "../../store/redux";
import styles from "./Users.module.scss";
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
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    headerClassName: "dataGridHeaderColor",
    width: 200,
    renderCell: (params) => (
      <div className={styles.profileCell}>
        <div className={styles.profilePicture}>
          <img
            src={params.row.image}
            alt={params.row.username}
            width={100}
            height={50}
            className={styles.profileImage}
          />
        </div>
      </div>
    ),
  },
  {
    field: "userId",
    headerName: "ID",
    headerClassName: "dataGridHeaderColor",
    width: 150,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "dataGridHeaderColor",
    width: 200,
  },
  {
    field: "email",
    headerName: "Email",
    headerClassName: "dataGridHeaderColor",
    width: 150,
  },
  {
    field: "teamId",
    headerName: "Team Id",
    headerClassName: "dataGridHeaderColor",
    width: 200,
  },
];

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  if (isLoading) return <div>Loading...</div>;
  if (isError || !users)
    return <div>An error occurred while fetching users</div>;

  return (
    <div className={styles.usersContainer}>
      <Header name="Users" />
      <div className={`${styles.userList} usersListColor`}>
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row.userId}
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
export default Users;
