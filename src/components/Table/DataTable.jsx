import React, { useState } from "react";

import "./DataTable.css";

/*
    Functional Things
    -----------------
    1. Search (OK)
    2. Sort By Column (OK)
    3. Pagination (OK)
    4. Actions (Row Level, Cell Level)
    5. Export as CSV or EXCEL
*/

/*
    Pagination
    -----------
    1. Show X[input] no of results at a time
    2. If multiple pages, then show handles for next, previous, last and first pages
    3. Render 6 buttons -> First 3, ..., Last 3

    Initially show 10 rows per page, then change accordingly
*/

function sortByKey(array, key, ascending = true) {
  return array.sort((a, b) => {
    // Handle cases where key is missing or null
    const valueA = a[key] !== undefined && a[key] !== null ? a[key] : "";
    const valueB = b[key] !== undefined && b[key] !== null ? b[key] : "";

    // Compare values based on type
    if (typeof valueA === "string" && typeof valueB === "string") {
      // For strings, use localeCompare
      return ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else if (typeof valueA === "number" && typeof valueB === "number") {
      // For numbers, simply subtract
      return ascending ? valueA - valueB : valueB - valueA;
    } else {
      // Default to string comparison for other types or if types differ
      return ascending
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    }
  });
}

function getPageData(array, pageNumber, rowsPerPage) {
  const start = (pageNumber - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return array.slice(start, end);
}

function DataTable(props) {
  const [tableData, setTableData] = useState(props.data || []);
  const [sortColumn, setSortColumn] = useState({ column: null, asc: true });
  const { data, columns, searchKey = "" } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [noOfRowsPerPage, setNoOfRowsPerPage] = useState(10);

  const fields = columns.map((column) => !column.valueGetter && column.field);
  let filteredData = tableData.filter((row) => {
    return (
      fields.some((field) =>
        row[field]?.toString().toLowerCase().includes(searchKey.toLowerCase())
      ) || searchKey === ""
    );
  });

  if (sortColumn.column) {
    filteredData = sortByKey(filteredData, sortColumn.column, sortColumn.asc);
  }

  /* For nth page with X no of rows per page the range is [X*(n-1), n*X-1] */
  const noOfButtons = Math.ceil(filteredData.length / noOfRowsPerPage);
  const paginatedRows = getPageData(filteredData, currentPage, noOfRowsPerPage);

  return (
    <>
      <div className="dt-wrapper">
        <table className="dt-root">
          <thead className="dt-head">
            <tr className="dt-head-row">
              {columns.map((column) => (
                <th
                  key={column.field}
                  onClick={() => {
                    console.log(column);
                    if (sortColumn.column === null) {
                      setSortColumn({ column: column.field, asc: true });
                    } else if (sortColumn.column === column.field) {
                      setSortColumn({ ...sortColumn, asc: !sortColumn.asc });
                    } else {
                      setSortColumn({ column: column.field, asc: true });
                    }
                  }}
                >
                  {column.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="dt-body">
            {paginatedRows.map((row, idx) => {
              return (
                <tr key={idx} className="dt-row">
                  {columns.map((column, colIdx) => (
                    <td
                      key={idx + "-" + colIdx}
                      className="dt-data"
                      onClick={() => console.log(row, column)}
                    >
                      {!column.valueGetter
                        ? row[column.field] || "-"
                        : column.valueGetter("value", row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            First
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <div>
            {Array.from(Array(noOfButtons).keys()).map((item, idx) => (
              <button key={idx} onClick={() => setCurrentPage(idx + 1)}>
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            disabled={currentPage === noOfButtons}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
          <button
            disabled={currentPage === noOfButtons}
            onClick={() => setCurrentPage(noOfButtons)}
          >
            Last
          </button>
        </div>
        <p>
          Showing {filteredData.length} results of {tableData.length}
        </p>
      </div>
    </>
  );
}

export default DataTable;
