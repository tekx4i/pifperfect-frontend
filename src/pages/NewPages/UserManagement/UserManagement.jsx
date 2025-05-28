import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  Table,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { FaSortUp, FaSortDown } from "react-icons/fa"; // For sorting icons
import Creatable from "react-select/creatable";
import userMinus from "../../../assets/newImages/user-minus.png";
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io"; // For sorting icons
import WarningSign from "../../../assets/activetabs/warning-signs-svgrepo-com.svg";

import plusIcon from "../../../assets/newImages/plusIcon.svg";
import sortIcon from "../../../assets/newImages/sort.svg";
import { TbReload } from "react-icons/tb";
import { FaUserCheck } from "react-icons/fa";
import { BiBlock } from "react-icons/bi";

import {
  Link,
  UNSAFE_useScrollRestoration,
  useNavigate,
  useParams,
} from "react-router-dom";
import userDummy from "../../../assets/newImages/about.jpg";
import UserMinus from "../../../assets/newImages/user-minus.png";
import editIcon from "../../../assets/newImages/edit.svg";
import activateIcon from "../../../assets/newImages/refresh.png";
import checkIcon from "../../../assets/newImages/check.svg";
import authenticateUser from "../../../assets/newImages/security-user.png";
import auth, { apiGet } from "../../../CustomHooks/useAuth";
import { CiSearch } from "react-icons/ci";
import SkeletonTable from "../../../helpers/SkeltonLoader";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { ReactSVG } from "react-svg";
import "./styles.scss";
import { useSearchParams, Navigate } from "react-router-dom";
import Pagination from "../../../Components/Pagination/Pagination";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [blockedLoad, setBlockedLoad] = useState();
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [data, setData] = useState();
  const token = localStorage.getItem("token");
  const [icon, setIcon] = useState();
  const [buttonStates, setButtonStates] = useState({});
  const [isActive, setIsActive] = useState();
  const [hoveredUser, setHoveredUser] = useState(null);
  const [sortName, setSortName] = useState("email");
  const [status, setStatus] = useState("true"); // State for selected status
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [role, setRole] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const { id } = useParams(); // Retrieve the id from the URL

  const { register } = useForm();

  // const getCompaniesUsers = async () => {
  //   setIsLoading(true);
  //   // let url = "";
  //   const url = `${REACT_APP_API_URL}users?companyId=${id}&status=ACTIVE`;
  //   const params = {};
  //   // const response=await

  //   try {
  //     const params = {
  //       // status: "ACTIVE",
  //       // limit: pShow,
  //       // page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
  //     };
  //     const response = await apiGet(url, params, token);
  //     // setTotalPage(response.data.totalPages);
  //     // console.log("total page",response.data.totalPages)

  //     if (response.success) {
  //       setCompanyUsers(response.data.records);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getCompaniesUsers();
  // }, []);

  // console.log("0000",role)

  const getUser = async (query = "", status, role) => {
    setIsLoading(true);
    const params = {
      // status: "ACTIVE",
      limit: pShow,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
    };
    try {
      let url = `${REACT_APP_API_URL}users?searchInput=${query}&sort=${sortName}:${sortDirection}`;

      if (role == 2 || role == 3 || role == 4) {
        url += `&role=${role}`;
      }

      if (status == "ACTIVE" || status == "INACTIVE") {
        url += `&status=${status}`;
      }

      // const  url = `${REACT_APP_API_URL}users?role=3`;

      const response = await auth.apiGet(url, params, token);
      if (response.success) {
        setTotalPage(response.data.totalPages);

        const dbValues = response.data.records;
        setUsers(dbValues);

        // Initialize button states for all users
        const initialStates = {};
        dbValues.forEach((user) => {
          initialStates[user.id] = {
            isActive: user.status === "ACTIVE",
          };
        });
        setButtonStates(initialStates);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Block Users

  const blockedUser = async (id) => {
    try {
      // setBlockedLoad(selectedId);
      const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/users/${id}`;
      const params = {
        status: "BLOCKED",
      };
      const response = await auth.apiPut(url, params, token);
      if (response.success) {
        getUser();
      }
    } catch {
      setBlockedLoad(false);
    } finally {
      setBlockedLoad(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // const value = e.target.value;

    // setSearchQuery(value);

    // Debounced search
    setTimeout(() => {
      getUser(searchQuery, status, role); // Fetch data based on search query
    }, 500);
  };

  const handleDeactivate = async (id) => {
    // Find the user object whose ID matches the passed ID
    const user = users.find((user) => user.id === id);

    if (user) {
      console.log(`User Name: ${user.status}`);
    } else {
      console.log("User not found!");
      return; // Exit if user not found
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
          const response = await auth.apiPut(url, { status: newStatus }, token);

          if (response.success) {
            getUser();
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

  // pagginations
  const [searchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(0);
  const [pagePagination, setPagePagination] = useState(
    searchParams.get("page") ? parseInt(searchParams.get("page")) : 1
  );
  const [pShow, setPshow] = useState(20);

  useEffect(() => {
    getUser(searchQuery, status, role);
  }, [searchParams]);

  const handleChange = (e) => {
    setPshow(e.target.value);
  };

  useEffect(() => {
    getUser(searchQuery, status, role);
  }, [searchQuery, status, role]);

  document.title = "Users | PIFPerfect";
  return (
    <div className="page-content" id="user-management">
      <div>
        {/* <BreadCrumb title="Orders" pageTitle="Ecommerce" /> */}
        <div className="custom-header-ctm">
          <h4>All Users</h4>

          <div className="add-btns">
            {/* <select
              className="form-select rounded"
              // value={status}
              // onChange={(e) => {
              //   const value = e.target.value === "true";
              //   setStatus(value);
              //   getCompanies(searchQuery, value);
              // }}
            >
              <option selected value="">
                Select Status
              </option>
              <option value={true}>All</option>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select> */}

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
                  getUser(searchQuery, value);
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
                {...register("roles_change", {
                  onChange: (e) => setRole(e.target.value),
                })}
              >
                <option value="2">Company Admin</option>
                <option value="3">Sales Manager</option>
                <option value="4">Sales Representative</option>
              </select>
              <label style={{ fontSize: "12px" }} htmlFor="floatingSelect">
                Select Roles
              </label>
            </div>

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
            <Link
              to="/user-management/add"
              className="default__btn d-flex align-items-center"
            >
              <ReactSVG src={plusIcon} /> <span>Add New User</span>
            </Link>
            {/* <Link
              to="/user-management/role"
              className="default__btn-outline d-flex align-items-center"
            >
              <span>Latest Users Added </span>
              <ReactSVG src={sortIcon} />
            </Link> */}
          </div>
        </div>

        <div className="custom-container">
          <div className="table mt-3">
            <div className="table-wrapper">
              <Table className="align-middle table-nowrap mb-0">
                <thead>
                  <tr>
                    <th scope="col">
                      User Name{" "}
                      <span className="ms-2">
                        <IoIosArrowRoundUp
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortName("firstName");
                            setSortDirection("asc");
                          }}
                        />
                        <IoIosArrowRoundDown
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortName("firstName");
                            setSortDirection("desc");
                          }}
                        />
                      </span>
                    </th>
                    <th scope="col">
                      User Email{" "}
                      <span className="ms-2">
                        <IoIosArrowRoundUp
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortName("email");
                            setSortDirection("asc");
                          }}
                        />
                        <IoIosArrowRoundDown
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortName("email");
                            setSortDirection("desc");
                          }}
                        />
                      </span>
                    </th>
                    <th scope="col">Companies</th>
                    <th scope="col">User Since</th>
                    <th scope="col">
                      Last Login{" "}
                      <span className="ms-2">
                        <IoIosArrowRoundUp
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortName("email");
                            setSortDirection("asc");
                          }}
                        />
                        <IoIosArrowRoundDown
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSortName("email");
                            setSortDirection("desc");
                          }}
                        />
                      </span>
                    </th>
                    {/* <th scope="col">Recent Login Date</th> */}
                    <th scope="col">Action</th>
                  </tr>
                </thead>

                {!id && (
                  <tbody>
                    {isLoading ? (
                      <SkeletonTable
                        rows={5}
                        columns={[200, 150, 100, 200, 150, 100]}
                      />
                    ) : users?.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="">
                            <div className="user-img">
                              <img src={userDummy} alt="User" />{" "}
                              {user.firstName} {user.lastName}
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td
                            onMouseEnter={() => setHoveredUser(user)}
                            onMouseLeave={() => setHoveredUser(null)}
                            style={{ position: "relative" }}
                          >
                            <span
                              className="ctm-badge"
                              style={{ background: "rgba(0, 255, 0, 0.149)" }}
                            >
                              {user.companiesCount
                                ? user.companiesCount
                                : "No Companies Found"}
                            </span>
                            {hoveredUser?.id === user.id && (
                              <div
                                className="hover-popup"
                                style={{
                                  position: "absolute",
                                  top: "-70%",
                                  left: "-100%",
                                  background: "#fff",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                  padding: "10px",
                                  zIndex: 10,
                                  maxHeight: "70px",
                                  overflowY: "auto",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "auto",
                                }}
                              >
                                <ul className="">
                                  {user?.companies?.length > 0 ? (
                                    user.companies.map((c, i) => (
                                      <li key={i}>
                                        {`${c.companyName} - ${c.roleName}`}
                                      </li>
                                    ))
                                  ) : (
                                    <b className="text-danger">
                                      No Company Found
                                    </b>
                                  )}
                                </ul>
                              </div>
                            )}
                          </td>
                          <td>
                            <span className="ctm-badge warning">
                              {dayjs(user.createdAt).format("YYYY-MM-DD")}
                            </span>
                          </td>
                          <td>
                            {user.lastLogin
                              ? dayjs(user.lastLogin).format("YYYY-MM-DD")
                              : ""}
                          </td>
                          <td>
                            <div className="d-flex justify-content-center flex-wrap gap-2">
                              <button
                                style={{ backgroundColor: "#FDF3F3" }}
                                className="btn text-dark delete ms-2 action-btn"
                                // onClick={() => setDeleteId(projection.id)}
                                onClick={() => {
                                  handleDeactivate(user.id);
                                }}
                              >
                                {user.status == "ACTIVE" ? (
                                  // <BiBlock className="text-danger" />
                                  <img src={userMinus} />
                                ) : (
                                  <FaUserCheck className="text-success" />
                                )}
                              </button>

                              <Link
                                to={`/user-management/edit/${user.id}`}
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
                          No Users Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </Table>
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
          <div className="user_notifications mt-5">
            <h4>User Notifications</h4>
            <div className="notification_details">
              <ul>
                {[1, 2, 3].map(() => (
                  <li className="text-detail">
                    <p className="d-flex">
                      <span>
                        <ReactSVG src={checkIcon} />
                      </span>
                      New <strong>Company Admin</strong> role assigned to Mr
                      Hebrew at Whistlemerge LTD
                    </p>
                    <div>
                      <p className="time">10th Nov, 2024, 02:32 PM</p>
                    </div>
                  </li>
                ))}

                <li className="text-detail">
                  <p className="d-flex">
                    <span>
                      {/* <ReactSVG src={WarningSign} /> */}
                      <img src={WarningSign} />
                    </span>
                    New <strong>Company Admin</strong> role assigned to Mr
                    Hebrew at Whistlemerge LTD
                  </p>
                  <div>
                    <p className="time">10th Nov, 2024, 02:32 PM</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
