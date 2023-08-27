import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { userActions } from "_store";

export { Audit };

function Audit() {
  const users = useSelector((x) => x.users.list);
  const dispatch = useDispatch();

  const [currentFormat, setFormat] = useState("12");
  const [currentPage, setPage] = useState(1);
  const itemsEachPage = 10;
  const [data, setData] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  //change format
  function dateFormatChange(dateStr) {
    const date = new Date(dateStr);
    const getDay = String(date.getDate()).padStart(2, "0");
    const getMonth = String(date.getMonth() + 1).padStart(2, "0");
    const getYear = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    if (currentFormat === "12") {
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = String(hours % 12 || 12);
      return `${getDay}/${getMonth}/${getYear} ${hours}:${minutes}:${seconds} ${ampm}`;
    }

    return `${getDay}/${getMonth}/${getYear} ${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    if (users?.value != null) {
      const updatedData = users?.value.map((item) => {
        const formattedDate = dateFormatChange(item.createdDate);
        return { ...item, createdDate: formattedDate };
      });

      const startIndex = (currentPage - 1) * itemsEachPage;
      const endIndex = startIndex + itemsEachPage;
      const paginatedData = updatedData.slice(startIndex, endIndex);
      setData(paginatedData);
    }

    if (searchInput.length > 0) {
      const newa = users?.value?.filter((item) => {
        return item.firstName.toLowerCase().includes(searchInput.toLowerCase());
      });
      setData(newa);
    }
  }, [users, searchInput, currentPage, currentFormat]);

  return (
    <div>
      <div className="mb-3">
        <div>
          <label className="fs-5" htmlFor="format">
            Select Time Format:{" "}
          </label>
          <select
            className="btn btn-primary ms-2 p-1.4"
            id="format"
            value={currentFormat}
            onChange={(e) => {
              setFormat(e.target.value);
            }}
          >
            <option className="btn btn-light" value="12">
              12 Hour
            </option>
            <option className="btn btn-light" value="24">
              24 Hour
            </option>
          </select>
        </div>
        <label className="form-label mt-3 fs-2" htmlFor="search">
          Search
        </label>
        <input
          name="search"
          type="text"
          id="search"
          placeholder="Search by FirstName...."
          className="form-control"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        {/* <div className="invalid-feedback">{errors.username?.message}</div> */}
      </div>
      <h1 style={{ color: "green" }}>Auditor Page</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>First Name</th>
            <th style={{ width: "30%" }}>Last Name</th>
            <th style={{ width: "30%" }}>Username</th>
            <th style={{ width: "30%" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* users?.value? */}
          {data &&
            data.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.username}</td>
                  <td>{user.createdDate}</td>
                </tr>
              );
            })}
          {users?.loading && (
            <tr>
              <td colSpan="4" className="text-center">
                <span className="spinner-border spinner-border-lg align-center"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-danger ms-2"
          disabled={data.length < itemsEachPage}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
