import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import userDummy from "../../../assets/newImages/about.jpg";
import editIcon from "../../../assets/newImages/edit.svg";
import closeIcon from "../../../assets/newImages/close-circle.svg";
import { apiGet, apiPut } from "../../../CustomHooks/useAuth";
import dayjs from "dayjs";
import SkeletonTable from "../../../helpers/SkeltonLoader";
import { Outlet } from "react-router-dom"; // Import Outlet
import { queries } from "@testing-library/react";
import Pagination from "../../../Components/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const Company = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const token = localStorage.getItem("token");
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [status, setStatus] = useState("true"); // State for selected status
  const [buttonStates, setButtonStates] = useState({});
  const getCompanies = async (query = "", status) => {
    setIsLoading(true);
    let url = "";
    try {
      if (status == "") {
        url = `${REACT_APP_API_URL}companies?searchInput=${query}`;
      } else {
        url = `${REACT_APP_API_URL}companies?searchInput=${query}&isActive=${status}`;
      } // Include search query

      const params = {
        // status: "ACTIVE",
        limit: pShow,
        page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
      };
      const response = await apiGet(url, params, token);
      setTotalPage(response.data.totalPages);

      if (response.success) {
        setUsers(response.data.records);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const getCompanies = async (st = "") => {
  //   setIsLoading(true);
  //   try {
  //     // const url = `${REACT_APP_API_URL}companies?name=${searchQuery}&isActive=true`; // Include search query
  //     const url = `${REACT_APP_API_URL}companies?isActive=true&name=HEXDesigns`; // Include search query

  //     const params = {
  //       // status: status, // Pass selected status here
  //       // name:searchQuery,
  //       // isActive: st,
  //       limit: pShow,
  //       page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
  //     };
  //     const response = await apiGet(url, params, token);
  //     setTotalPage(response.data.totalPages);

  //     if (response.success) {
  //       setUsers(response.data.records);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSearch = (e) => {
    e.preventDefault();
    // const value = e.target.value;

    // setSearchQuery(value);

    // Debounced search
    setTimeout(() => {
      getCompanies(searchQuery, status); // Fetch data based on search query
    }, 500);
  };

  const deactivateCompany = async (id, currentStatus) => {
    if (!token) {
      console.error("Authorization token is missing.");
      return;
    }

    const newStatus = currentStatus === false ? "INACTIVE" : "ACTIVE"; // Toggle logic
    const btnText = newStatus == "INACTIVE" ? "Activate" : " Deactivate";

    swal({
      title: "Are you sure?",
      text: `${btnText} this user will ${btnText} them in all companies.`,
      icon: "warning",
      buttons: ["Cancel", `Yes, ${btnText} Company`],
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const url = `${REACT_APP_API_URL}companies/update/${id}`;
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
      }
    });
  };

  // pagginations
  const [searchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(0);
  const [pagePagination, setPagePagination] = useState(
    searchParams.get("page") ? parseInt(searchParams.get("page")) : 1
  );
  const [pShow, setPshow] = useState(20);

  const handleChange = (e) => {
    setPshow(e.target.value);
  };

  // useEffect(() => {
  //   getCompanies();
  // }, [pShow]);

  useEffect(() => {
    // getCompanies(searchParams, status); // Initial fetch
    getCompanies(searchQuery, status);
  }, []);

  useEffect(() => {
    getCompanies(searchQuery, status);
  }, [searchParams, status]);

  // useEffect(() => {
  //   getCompanies(searchQuery, status);
  // }, [status]);

  const navigate = useNavigate();

  const handleUsers = (id) => {
    navigate(`/user-management/company/${id}`);
  };

  return (
    <div className="page-content" id="companies">
      <div className="custom-header-ctm">
        <div className="row w-100 m-0">
          <div className="col-md-6 p-0">
            <h4 className="w-100">All Companies</h4>
          </div>
          <div className="col-md-6 p-0">
            <div className="add-btns justify-conten-end">
              <select
                className="form-select rounded"
                value={status}
                onChange={(e) => {
                  const value = e.target.value;
                  setStatus(value);
                  getCompanies(searchQuery, value);
                }}
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <form onSubmit={handleSearch}>
                <div className="search-ctm">
                  <input
                    placeholder="Search by name or email"
                    value={searchQuery}
                    // onChange={handleSearch} // Handle input change
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit">
                    <CiSearch />
                  </button>
                </div>
              </form>
              <Link to="/company/add" className="default__btn">
                <span>Add New Company</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-container">
        <div className="table-responsive mt-3">
          <div className="table-wrapper">
            {
              <Table className="align-middle table-nowrap mb-0">
                <thead>
                  <tr>
                    <th scope="col">Company Name</th>
                    <th scope="col">Admin Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Active Users</th>
                    <th scope="col">Date Joined</th>

                    <th scope="col">Last Login</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <SkeletonTable
                      rows={5}
                      columns={[200, 150, 100, 200, 150, 100]}
                    />
                  ) : users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id}>
                        <td className="fw-medium">
                          <div className="user-img">
                            <img
                              src={
                                user.logo
                                  ? `${REACT_APP_API_IMG_URL}${user.logo}`
                                  : "https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png"
                              }
                              alt="user"
                            />{" "}
                            {user.name}
                          </div>
                        </td>
                        <td>{user.adminEmail}</td>
                        <td>{user.isActive ? "Activate" : "Deactivate"}</td>
                        <td>
                          <span
                            className="ctm-badge warning"
                            onClick={() => handleUsers(user.id)}
                          >
                            {user.activeUsers}
                          </span>
                        </td>
                        <td>{dayjs(user.joinDate).format("YYYY-MM-DD")}</td>
                        {/* <td>
                        {dayjs(user.establishedDate).format("YYYY-MM-DD")}
                      </td> */}
                        {/* <td>{user.adminLastLogin}</td> */}
                        <td>
                          {user?.adminLastLogin?.timestamp
                            ? dayjs(user.adminLastLogin.timestamp).format(
                                " YYYY MMMM D, h:mm A"
                              )
                            : "No Data"}
                        </td>
                        <td>
                          <div
                            className="d-flex justify-content-center "
                            // style={{ width: "180px" }}
                          >
                            <Link
                              onClick={() =>
                                deactivateCompany(user.id, user.isActive)
                              }
                              className={`action-btn ps-0 ${
                                user.isActive ? "deactivate" : "activate"
                              } d-flex align-items-center`}
                            >
                              {user.isActive ? (
                                <ReactSVG src={closeIcon} />
                              ) : (
                                <IoCheckmarkCircleOutline className="text-success" />
                              )}

                              {user.isActive ? "Deactivate" : "Activate"}
                            </Link>
                            <Link
                              to={`/billing/detail/${user.id}`}
                              className="action-btn edit"
                            >
                              <ReactSVG src={editIcon} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center"
                        style={{ verticalAlign: "center" }}
                      >
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            }
          </div>
          <select
            className="form-select form-select-sm w-auto mt-5"
            onChange={(e) => handleChange(e)}
            aria-label="Select number of items per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
        {/* pagination */}
        <div className="d-flex justify-content-end propaginate">
          <Pagination
            total={totalPage}
            page={pagePagination}
            setPage={setPagePagination}
            perPage={pShow}
            title="Users"
            last_page={totalPage}
          />{" "}
        </div>
        {/* pagination */}
      </div>
      <Outlet />
    </div>
  );
};

export default Company;
