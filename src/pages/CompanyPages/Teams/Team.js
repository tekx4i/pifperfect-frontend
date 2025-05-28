import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import SkeletonLoader from "../../../helpers/SkeltonLoader";
import userDummy from "../../../assets/newImages/about.jpg";
import editIcon from "../../../assets/newImages/edit.svg";
import closeIcon from "../../../assets/newImages/close-circle.svg";
import { apiGet, apiGetPublic, apiPut } from "../../../CustomHooks/useAuth";
import dayjs from "dayjs";
import { CiSearch } from "react-icons/ci";
import { TbReload } from "react-icons/tb";
import UserMinus from "../../../assets/newImages/user-minus.png";
import "./styles.scss";
import { FaUserCheck } from "react-icons/fa";

const Company = () => {
  const [isLoading, setIsLoading] = useState(false); // Default to true
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [companyId, setCompanyId] = useState();
  const [data, setData] = useState();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isActive, setIsActive] = useState();
  const [buttonStates, setButtonStates] = useState({});
  const [status, setStatus] = useState("");
  const [roles, setRoles] = useState([]);
  const [singleRole, setSingleRole] = useState();
  const [user, setUser] = useState({});

  const getCompanies = async (query = "", status, role) => {
    console.log("ropa", status);
    setIsLoading(true);
    try {
      // const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/companies`;

      // const url = `${REACT_APP_API_URL}companies/${companyId}/users?roleId=${data.role}&name=${query}`;

      // let url = "";
      // if (status ) {
      //   url = `${REACT_APP_API_URL}users?searchInput=${searchQuery}&status=${status}`;
      // } else {
      //   url = `${REACT_APP_API_URL}users?searchInput=${searchQuery}`;
      // }

      let url = `${REACT_APP_API_URL}users?searchInput=${query}&companyId=${companyId}`;

      if (role == 2 || role == 3 || role == 4 || role == 5) {
        url += `&role=${role}`;
      }

      if (status) {
        url += `&status=${status}`;
      }

      const response = await apiGet(url, {}, token);

      if (response.success) {
        setUsers(response.data.records);

        const dbValue = response.data.records;

        const initialStates = {};
        dbValue.forEach((user) => {
          initialStates[user.id] = {
            isActive: user.status === "ACTIVE",
          };
        });
        setButtonStates(initialStates);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      getCompanies();
    }
  }, [companyId]);

  const deactivateCompany = async (id, currentStatus) => {
    if (!token) {
      console.error("Authorization token is missing.");
      return;
    }
    try {
      const url = `${REACT_APP_API_URL}users/${id}`;
      const params = {
        status: currentStatus == "ACTIVE" ? "INACTIVE" : "ACTIVE",
      }; // Toggle the current status
      const response = await apiPut(url, params, token);

      if (response.success) {
        // Update the user's status in the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id
              ? { ...user, status: params.status, isActive: !currentStatus }
              : user
          )
        );
      } else {
        console.error("Failed to update the user's status.");
      }
    } catch (error) {
      console.error("Error toggling company status:", error);
    }
  };

  //   useEffect(() => {
  //     if (getSingle) {

  //         editSetValue("value", getSingle.Value);
  //         editSetValue("expiration", formattedExpiration)
  //         editSetValue("user_id", getSingle.User);
  //         editSetValue("limit", getSingle.Limit);

  //     }
  // }, [getSingle, editDistributor]);

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setCompanyId(JSON.parse(storedUser).companyId); // Parse the JSON string
      setData(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // const value = e.target.value;

    // setSearchQuery(value);

    // Debounced search
    setTimeout(() => {
      getCompanies(searchQuery, status, singleRole); // Fetch data based on search query
    }, 500);
  };

  const handleDeactivate = async (id) => {
    // Find the user object whose ID matches the passed ID
    const user = users.find((user) => user.id === id);

    if (user) {
      console.log(`User Name: ${user.status}`);
    } else {
      console.log("User not found!");
      return;
    }

    const currentState = buttonStates[id]?.isActive;
    const newStatus = currentState ? "INACTIVE" : "ACTIVE"; // Toggle status
    const newIcon = currentState ? "Activate" : "Deactivate";

    swal({
      title: `Are you sure you want to ${
        currentState ? "Deactivate" : "Activate"
      } this user?`,
      text: `This action will ${
        currentState ? "Deactivate" : "Activate"
      } the user.`,
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: null,
          visible: true,
          className: "cancel-btn",
          closeModal: true,
        },
        confirm: {
          text: `Yes, ${currentState ? "Deactivate" : "Activate"} it!`,
          value: true,
          visible: true,
          className: currentState ? "deactivate-btn" : "activate-btn",
          closeModal: false,
        },
      },
    }).then(async (willChange) => {
      if (willChange) {
        try {
          const url = `${REACT_APP_API_URL}/users/${id}`;
          const response = await apiPut(url, { status: newStatus }, token);

          if (response.success) {
            setButtonStates((prev) => ({
              ...prev,
              [id]: { isActive: !currentState },
            }));
            swal(
              `${currentState ? "Deactivate" : "Activate"}!`,
              `The user has been ${
                currentState ? "Deactivated" : "Activated"
              }.`,
              "success",
              {
                buttons: false,
                timer: 2000,
              }
            );
          } else {
            swal(
              "Error!",
              "Something went wrong while changing status.",
              "error"
            );
          }
        } catch (error) {
          console.error(error);
          swal("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const getRoles = async () => {
    // setUserLoading(true);
    try {
      const url = `${REACT_APP_API_URL}auth/roles`;

      const params = {
        // status: "ACTIVE",
        // limit: pShow,
        // page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
      };
      const response = await apiGetPublic(url, params);
      // setTotalPage(response.data.payload.totalPages)
      if (response.success) {
        const dbValues = response.data.payload;
        const formatedValue = dbValues.map((data) => ({
          label: data.slug,
          value: data.id,
        }));
        setRoles(formatedValue);
      }
    } catch (error) {
      //   setUserLoading(false);
      console.log(error);
    } finally {
      //   setUserLoading(false);
      console.log("false 2");
    }
  };

  useEffect(() => {
    getCompanies();
    getRoles();
  }, []);

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  return (
    <div className="page-content" id="companies">
      <div className="custom-header-ctm">
        <div className="row w-100 m-0">
          <div className="col-md-6 p-0">
            <h4 className="w-100">All Team Members</h4>
          </div>
          <div className="col-md-6 p-0 ">
            <div className="add-btns justify-conten-end">
              <div className="d-flex">
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="floatingSelect"
                    aria-label="Floating label select example"
                    defaultValue=""
                    value={status}
                    onChange={(e) => {
                      const value = e.target.value;
                      setStatus(value);
                      getCompanies(searchQuery, value, singleRole);
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

                <div className="form-floating me-2 ms-2">
                  <select
                    className="form-select"
                    id="floatingSelect"
                    aria-label="Floating label select example"
                    defaultValue=""
                    onChange={(e) => {
                      const value = e.target.value;
                      setSingleRole(e.target.value);
                      getCompanies(searchQuery, status, value);
                    }}
                  >
                    {roles.map((role) =>
                      role.value != 1 ? (
                        <option value={role.value}>{role.label}</option>
                      ) : (
                        ""
                      )
                    )}
                  </select>
                  <label style={{ fontSize: "12px" }} htmlFor="floatingSelect">
                    Select Roles
                  </label>
                </div>

                <form onSubmit={handleSearch}>
                  <div className="search-ctm">
                    <input
                      placeholder="Search team by name"
                      value={searchQuery}
                      // onChange={handleSearch} // Handle input change
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">
                      <CiSearch />
                    </button>
                  </div>
                </form>
              </div>
              <Link to="/company/team/add" className="default__btn">
                <span>Add Team Member</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-container ">
        <div className="table-responsive mt-5">
          {
            // Show the table when data is loaded
            <Table className="align-middle table-nowrap mb-0">
              <thead>
                <tr>
                  <th scope="col">Member Name</th>
                  <th scope="col">Role</th>
                  <th scope="col">Email</th>
                  <th scope="col">Last Login</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Show SkeletonLoader when loading
                  <SkeletonLoader
                    rows={4}
                    columns={[200, 150, 100, 150, 100]}
                    width="100%"
                    height={40}
                  />
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user?.id}>
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
                          {user?.firstName} {user?.lastName}
                        </div>
                      </td>
                      <td>
                        <span className="ctm-badge warning">
                          {user?.role == "company_admin"
                            ? "Company Admin"
                            : user?.role == "sales_manager"
                            ? "Sales Manager"
                            : user?.role == "setter"
                            ? "Setter"
                            : user?.role == "closer"
                            ? "Closer"
                            : ""}
                        </span>
                      </td>

                      {/* <td>{user.isTaxable ? "Yes" : "No"}</td> */}
                      <td>{user?.email}</td>
                      <td>
                        <span className="ctm-badge warning">
                          {user.lastLogin
                            ? dayjs(user.lastLogin).format("YYYY MM DD")
                            : ""}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`p-1 pe-2 ps-2 text-light text-sm rounded-pill ${
                            user.status === "ACTIVE"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          <small>{user.status}</small>
                        </span>
                      </td>
                      <td>
                        {/* <div className="d-flex gap-2">
                          <Link
                            onClick={() =>
                              deactivateCompany(user?.id, user.status)
                            } 
                            className={`action-btn ${user.status == "ACTIVE"
                              ? "deactivate"
                              : "activate"
                              }`}
                          >
                            {user.status == "ACTIVE"
                              ? "Deactivate"
                              : "Activate"}
                          </Link>

                          <Link
                            to={`/company/team/edit/${user.id}`}
                            className="action-btn edit"
                          >
                            <ReactSVG src={editIcon} />
                          </Link>
                        </div> */}

                        <div className="d-flex justify-content-center flex-wrap gap-2">
                          <button
                            onClick={() => {
                              handleDeactivate(user.id);
                              {
                                buttonStates[user.id]?.isActive
                                  ? setIsActive(false)
                                  : setIsActive(true);
                              }
                            }}
                            className={` border-0 action-btn ${
                              buttonStates[user.id]?.isActive
                                ? "delete"
                                : "success"
                            }`}
                          >
                            {buttonStates[user.id]?.isActive ? (
                              <img src={UserMinus} />
                            ) : (
                              <FaUserCheck />
                            )}
                          </button>

                          <Link
                            to={`/company/team/edit/${user.id}`}
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
      </div>
    </div>
  );
};

export default Company;
