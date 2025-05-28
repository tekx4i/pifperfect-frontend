import React, { useEffect, useRef, useState } from "react";
import { Table } from "reactstrap";
import "./styles.scss";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import SkeletonLoader from "../../../helpers/SkeltonLoader";
import userDummy from "../../../assets/newImages/about.jpg";
import editIcon from "../../../assets/newImages/edit.svg";
import eyeIcon from "../../../assets/newImages/eye.svg";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { FaCalendar } from "react-icons/fa";

import closeIcon from "../../../assets/newImages/close-circle.svg";
import { apiGet, apiPut } from "../../../CustomHooks/useAuth";
import dayjs from "dayjs";
import { CiSearch } from "react-icons/ci";

const Company = () => {
  const [isLoading, setIsLoading] = useState(true); // Default to true
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const isFirstRender = useRef(true); // Track initial render

  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState("");
  const [role, setRole] = useState();
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const handleDateChange = (e) => {
    console.log("change in date", e.selection);
    setState([e.selection]);
    getNumbers(e.selection.startDate, e.selection.endDate);
    // getNumbers()
  };

  // const [state, setState] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: null,
  //     key: "selection",
  //   },
  // ]);

  const [state, setState] = useState([
    {
      startDate: null, // Initially empty
      endDate: null, // Initially empty
      key: "selection",
    },
  ]);

  // console.log(state,"sese")

  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";
  };

  const handleFieldClick = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const getNumbers = async (startDate, endDate, searchQuery) => {
    console.log("lolo");
    console.log("startde", startDate);
    try {
      setIsLoading(true);
      // const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/companies`;

      let url = `${REACT_APP_API_URL}dailyMetrics?name=${searchQuery}`;

      // if(searchQuery){

      // }

      if (startDate) {
        url += `&startDate=${startDate}`;
      }

      if (endDate) {
        url += `&endDate=${endDate}`;
      }

      const response = await apiGet(url, {}, token);

      if (response.success) {
        setUsers(response.data.records);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      const url = `${REACT_APP_API_URL}auth/roles`;

      const response = await apiGet(url, {}, token);
      if (response.success) {
        setRoles(response.data);
      }

      console.log("response yes", response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNumbers();
    getRoles();
  }, []);

  const deactivateCompany = async (id, currentStatus) => {
    if (!token) {
      console.error("Authorization token is missing.");
      return;
    }
    try {
      const url = `${REACT_APP_API_URL}companies/update/${id}`;
      // const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/companies/update/${id}`;

      const params = { isActive: !currentStatus };
      const response = await apiPut(url, params, token);

      if (response.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, isActive: !currentStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Error toggling company status:", error);
    }
  };

  const handleSearch = (e) => {
    console.log("epp", e.target.value);
    e.preventDefault();
    setSearchQuery(e.target.value);

    // setTimeout(() => {
    getNumbers(state[0].startDate, state[0].endDate, searchQuery); // Fetch data based on search query
    // }, 500);
  };

  useEffect(() => {
    if (isFirstRender.current == true) {
      isFirstRender.current = false; // Skip first render
      return;
    }

    const timeout = setTimeout(() => {
      getNumbers(state[0].startDate, state[0].endDate, searchQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="page-content" id="companies">
      <div className="custom-header-ctm">
        <div className="row w-100 m-0">
          <div className="col-md-6 p-0">
            <h4 className="w-100">Data Entry</h4>
          </div>
          <div className="col-md-6 p-0">
            <div className="add-btns justify-conten-end">
              {/* <div className="form-floating">
                <select
                  className="form-select"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  defaultValue=""
                  onChange={(e) => {
                    const value = e.target.value;
                    setStatus(e.target.value);
                    getNumbers(value,role);
                  }}
                >
                  <option value="">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>

                <label style={{ fontSize: "12px" }} htmlFor="floatingSelect">
                  Select Status
                </label>
              </div>

              <div className="form-floating">
                <select
                  className="form-select"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  defaultValue=""
                  onChange={(e) => {
                    const value = e.target.value;
                    setRole(e.target.value);
                    getNumbers(status,value);
                  }}
                >
                    <option value="">All</option>

                  {roles.map((role) => (
                    <option value={role.id}>{role.slug}</option>
                  ))}
                </select>
                <label style={{ fontSize: "12px" }} htmlFor="floatingSelect">
                  Select Roles
                </label>
              </div> */}

              {/* Calender */}

              <div className="col-md-6 d-flex gap-3 justify-content-end">
                <div
                  className="d-flex"
                  style={{ width: "300px", fontWeight: "600" }}
                >
                  {/* The input field to trigger the calendar */}
                  <input
                    type="text"
                    // value={`${state[0].startDate.toLocaleDateString()} to ${state[0].endDate ? state[0].endDate.toLocaleDateString() : ''}`}
                    value={`${formatDate(state[0].startDate)} to ${
                      state[0].endDate ? formatDate(state[0].endDate) : ""
                    }`}
                    onClick={handleFieldClick}
                    className="form-control"
                    readOnly
                  />
                  <button
                    style={{ backgroundColor: "#405089" }}
                    className=""
                    onClick={handleFieldClick}
                  >
                    <FaCalendar className="text-light" />
                  </button>

                  {/* Show calendar only if isCalendarVisible is true */}
                  {isCalendarVisible && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%", // Position the calendar below the input field
                        left: 0,
                        zIndex: 999999, // Ensure it's above other elements
                      }}
                    >
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => {
                          setState([item.selection]);
                          handleDateChange(item);
                        }}
                        moveRangeOnFirstSelection={false}
                        ranges={state}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Calender */}

              {/* <form onSubmit={handleSearch}> */}
              <div className="search-ctm">
                <input
                  placeholder="Search data entry by name"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e)} // Handle input change
                  // onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <CiSearch />
                </button>
              </div>
              {/* </form> */}
              {/* <Link to="/company/data-entry/add" className="default__btn">
                <span>Add Data Entry</span>
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      <div className="custom-container">
        <div className="table-responsive mt-3">
          {
            // Show the table when data is loaded
            <Table className="align-middle table-nowrap mb-0">
              <thead style={{ position: "relative", zIndex: "0" }}>
                <tr>
                  <th scope="col">User Name</th>

                  <th scope="col">User Role</th>
                  <th scope="col">For Date</th>

                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Show SkeletonLoader when loading
                  <SkeletonLoader
                    rows={4}
                    columns={[200, 150, 100, 150, 100, 150]}
                    width="100%"
                    height={40}
                  />
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-medium">
                        <div className="user-img">
                          <img
                            src={
                              user.image
                                ? `${REACT_APP_API_IMG_URL}${user.image}`
                                : "https://www.londondentalsmiles.co.uk/wp-content/uploads/2017/06/person-dummy.jpg"
                            }
                            alt="user"
                          />
                          {user?.users.firstName} {user?.users.lastName}
                        </div>
                      </td>
                      <td>
                        <span className="ctm-badge warning">Company Admin</span>
                      </td>
                      <td> {dayjs(user.createdAt).format("DD-MM-YYYY")}</td>

                      <td>
                        <div className="d-flex">
                          <Link
                            to={`/company/data-entry/${user.id}`}
                            className="action-btn bg-transparent"
                          >
                            <ReactSVG src={eyeIcon} /> Edit Entry
                          </Link>
                        </div>
                      </td>
                      {/* Uncomment if needed */}
                      {/* <td>
            <div className="d-flex gap-2">
              <Link
                onClick={() => deactivateCompany(user.id, user.isActive)}
                className={`action-btn ${user.isActive ? "deactivate" : "activate"}`}
              >
                <ReactSVG src={closeIcon} />
                {user.isActive ? "Deactivate" : "Activate"}
              </Link>
              <Link to={`/company/add/${user.id}`} className="action-btn edit">
                <ReactSVG src={editIcon} />
              </Link>
            </div>
          </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          }
        </div>
      </div>
    </div>
  );
};

export default Company;
