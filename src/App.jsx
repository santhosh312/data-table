import { useState } from "react";
import "./App.css";
import DataTable from "./components/Table/DataTable";
import { data } from "./data/sample-data";

function App() {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
  ];

  const [searchKey, setSearchKey] = useState("");
  return (
    <>
      <input type="search" onInput={(e) => setSearchKey(e.target.value)} />
      <div className="table-ctr">
        <DataTable data={data} columns={columns} searchKey={searchKey} />
      </div>
    </>
  );
}

export default App;
