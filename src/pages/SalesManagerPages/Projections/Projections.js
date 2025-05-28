import React, { useState, useEffect } from "react";
// import FormWithLabel from "./Component/FieldWithLabel";
import { ReactSVG } from "react-svg";
// import { salesManagerForm } from "./metricData";
import SM from "../../../assets/newImages/user-octagon.svg";
import SR from "../../../assets/newImages/setterrep.svg";
import { RiDeleteBinLine } from "react-icons/ri";
import CR from "../../../assets/newImages/closerrep.svg";
import SMA from "../../../assets/newImages/user-octagon-active.svg";
import SRA from "../../../assets/newImages/setterrep-active.svg";
import CRA from "../../../assets/newImages/closerrep-active.svg";
import userDummy from "../../../assets/newImages/about.jpg";
import editIcon from "../../../assets/newImages/edit.svg";
import closeIcon from "../../../assets/newImages/close-circle.svg";
import checkIcon from "../../../assets/newImages/tick-circle.svg";
import { useForm, Controller } from "react-hook-form";
import { TbReload } from "react-icons/tb";

import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from "../../../CustomHooks/useAuth";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import "./style.scss";
import { MdOutlineArrowDropUp } from "react-icons/md";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Table } from "reactstrap";
import SkeletonTable from "../../../helpers/SkeltonLoader";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const MetricGoal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm();

  const { REACT_APP_API_URL } = process.env;

  const [tab, setTab] = useState(1);
  const [role, setRole] = useState(3);
  const [user, setUser] = useState();

  const [typeSelect, setTypeSelect] = useState(0);
  const [getSingleMetrics, setGetSingleMetrics] = useState();
  const [users, setUsers] = useState([]);

  // const [loading, setIsLoading] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const token = localStorage.getItem("token");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editId, setEditId] = useState();
  const [projections, setProjections] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState();
  // console.log("selec",selectedMetrics)
  const [searchQuery, setSearchQuery] = useState("");
  // console.log("search it",searchQuery)
  const [selected, setSelected] = useState([]);
  const [period, setPeriod] = useState("");
  const getMetricsGoals = async () => {
    const url = `${REACT_APP_API_URL}metrics`;
    const response = await apiGet(url, {}, token);
  };

  // useEffect(()=>{
  //   const localStorage=localStorage.
  // },[])

  // useEffect(() => {
  //   getMetricsGoals();
  //   const token = localStorage.getItem("user");
  // }, []);

  // useEffect(() => {
  //   // Get user info from local storage
  //   const storedUser = localStorage.getItem("userInfo");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser)); // Parse the JSON string
  //   }
  // }, []);

  const getMetrics = async () => {
    try {
      const url = `${REACT_APP_API_URL}metrics`;

      const response = await apiGet(url, {}, token);

      if (response.success) {
        setMetrics(response.data.records);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      let url = "";
      {
        isEditModal
          ? (url = `${REACT_APP_API_URL}projections/${editId}`)
          : (url = `${REACT_APP_API_URL}projections`);
      }

      // Prepare the URL with query parameters
      const params = {
        userId: data.username,
        metricId: data.metricId,
        targetValue: data.targetValue,
        period: data.period,
        // companyId: user.companyId,
      };

      // Send the request
      let response;
      if (isEditModal) {
        response = await apiPut(url, params, token);
      } else {
        response = await apiPost(url, params, token);
        reset();
      }

      if (response.success) {
        setIsOpenModal(false);

        getProjections();
        setIsEditModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  const handleTypeSelect = (value) => {
    setTypeSelect(value);
  };

  const deleteProjections = async (id, currentStatus) => {
    const newStatus = currentStatus == "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const textStatus = currentStatus == "ACTIVE" ? "Deactivate" : "Activate";

    swal({
      title: `Are you sure you want to ${textStatus} this product?`,
      text: `This action will ${textStatus} the product.`,
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
          text: `Yes, ${textStatus} it!`,
          value: true,
          visible: true,
          className:
            currentStatus === "ACTIVE" ? "deactivate-btn" : "activate-btn",
          closeModal: false,
        },
      },
    }).then(async (willChange) => {
      if (willChange) {
        try {
          const url = `${REACT_APP_API_URL}projections/${id}`;
          setIsLoading(true);

          const params = {
            status: newStatus,
          };
          // Send the request
          const response = await apiPut(url, params, token);

          if (response.success) {
            getProjections();
            swal(
              `${textStatus}!`,
              `The product has been ${textStatus.toLowerCase()}d.`,
              "success",
              {
                buttons: false,
                timer: 2000,
              }
            );
          }
        } catch (error) {
          setIsLoading(false);

          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // useEffect(() => {
  //   deleteProjections(deleteId);
  // }, [deleteId]);

  // console.log("00000",getSingleMetrics)

  const getSingle = async (editId) => {
    // const url = `${REACT_APP_API_URL}projections/${editId}`;
    const url = `${REACT_APP_API_URL}projections/${editId}`;

    const params = {};
    const response = await apiGet(url, {}, token);

    if (response) {
      setGetSingleMetrics(response.data);
    }
  };

  // console.log("getSingleMetrics",getSingleMetrics)

  useEffect(() => {
    getSingle(editId);
  }, [editId]);

  const getUser = async (query = "", status, role) => {
    setIsLoading(true);
    const params = {
      // status: "ACTIVE",
      //   limit: pShow,
      //   page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
    };
    try {
      const url = `${REACT_APP_API_URL}users?companyId=${user?.companyId}`;

      const response = await apiGet(url, params, token);
      if (response.success) {
        const dbValues = response.data.records;
        setUsers(dbValues);

        // Initialize button states for all users
        // const initialStates = {};
        // dbValues.forEach((user) => {
        //   initialStates[user.id] = {
        //     isActive: user.status === "ACTIVE",
        //   };
        // });
        // setButtonStates(initialStates);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("dabbb",users)

  const getProjections = async (searchQuery) => {
    setIsLoading(true);
    const params = {
      // status: "ACTIVE",
      //   limit: pShow,
      //   page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
    };
    try {
      let url = `${REACT_APP_API_URL}projections`;

      if (searchQuery) {
        url += `?name=${searchQuery}`;
      }

      const response = await apiGet(url, params, token);
      if (response.success) {
        const dbValues = response.data.records;
        setProjections(dbValues);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getProjections(searchQuery);
    }, 500);
  }, [searchQuery]);

  useEffect(() => {
    if (isEditModal && getSingleMetrics) {
      setValue("username", getSingleMetrics.userId || "");
      setValue("metricId", getSingleMetrics.metricId || "");
      setValue("targetValue", getSingleMetrics.targetValue || "");
      setValue("period", getSingleMetrics.period || "");
    }
  }, [getSingleMetrics]);

  useEffect(() => {
    getMetricsGoals();
    getMetrics();
    getProjections();
  }, []);

  useEffect(() => {
    getUser();
  }, [user]);

  const options = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
  ];

  const singleMetrics = async (id) => {
    console.log(";;;");
    try {
      // const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/companies/${id}`;
      const url = `${REACT_APP_API_URL}metrics/${id}`;

      const params = {};
      const response = await apiGet(url, params, token);
      if (response.success) {
        const companyData = response.data;
        setSelectedMetrics(response.data);
      }
    } catch (error) {
      console.error("Error fetching single company:", error);
    }
  };

  const getMonthLabel = (date) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const generateMonths = () => {
    const currentDate = new Date();
    const months = [];

    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(currentDate.getMonth() - 1);
    months.push(getMonthLabel(lastMonth));

    months.push(getMonthLabel(currentDate));

    for (let i = 1; i <= 6; i++) {
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(currentDate.getMonth() + i);
      months.push(getMonthLabel(nextMonth));
    }

    return months;
  };

  return (
    <div className="page-content" id="user-management">
      <div className="custom-container mt-3">
        {/* <h2 style={{ fontSize: "20px" }} className="pb-3 fw-bold border-bottom" >Add,Edit & Remove</h2> */}

        <div className="d-flex justify-content-between">
          <div className="mt-3 mb-3">
            <button
              className="btn text-light"
              style={{ backgroundColor: "#0AB39C" }}
              onClick={() => {
                setIsOpenModal(true);
                reset();
              }}
            >
              <span className="me-2">+</span> Add
            </button>
          </div>

          <form className="mt-2">
            <div className="search-ctm new-search">
              <input
                placeholder="Search..."
                value={searchQuery}
                // onChange={handleSearch} // Handle input change
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* <button type="submit">
                <CiSearch />
              </button> */}
            </div>
          </form>
        </div>

        <div className="table-wrapper">
          {
            <Table className="align-middle table-nowrap mb-0">
              <thead>
                <tr>
                  <th scope="col"> Name</th>
                  <th scope="col">
                    <MdOutlineArrowDropUp fontSize={20} /> Projected
                  </th>
                  <th scope="col">
                    <MdOutlineArrowDropUp fontSize={20} /> Current
                  </th>
                  <th scope="col">
                    <MdOutlineArrowDropUp fontSize={20} />
                    Remaining
                  </th>
                  <th scope="col">
                    <MdOutlineArrowDropUp fontSize={20} /> Pace #
                  </th>

                  <th scope="col">
                    <MdOutlineArrowDropUp fontSize={20} /> Pace %
                  </th>

                  <th scope="col">
                    <MdOutlineArrowDropUp fontSize={20} /> Length
                  </th>

                  <th scope="col">
                    <MdOutlineArrowDropUp fontSize={20} /> Period
                  </th>

                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <SkeletonTable
                    rows={5}
                    columns={[200, 150, 100, 200, 150, 100]}
                  />
                ) : projections.length > 0 ? (
                  projections.map((projection) => (
                    <tr key={projection.id}>
                      <td className="fw-medium">
                        <div className="user-img">
                          {projection.users.firstName}{" "}
                          {projection.users.lastName}
                        </div>
                      </td>
                      <td>
                        {projection.metrics.type === "CURRENCY" ? "$" : ""}
                        {projection.targetValue}
                        {projection.metrics.type === "PERCENTAGE" ? "%" : ""}
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: "12px",
                            padding: "5px",
                            backgroundColor: "#DAF4F0",
                            color: "#0AB39C",
                          }}
                        >
                          {projection.metrics.type === "CURRENCY" ? "$" : ""}
                          {projection.totalMetricsValue}
                          {projection.metrics.type === "PERCENTAGE" ? "%" : ""}
                        </span>
                      </td>
                      <td>
                        <span className="ctm-badge warning">
                          {projection.metrics.type === "CURRENCY" ? "$" : ""}
                          {projection.remaining}
                          {projection.metrics.type === "PERCENTAGE" ? "%" : ""}
                        </span>
                      </td>
                      <td>No Data</td>
                      <td>
                        {projection?.adminLastLogin?.timestamp
                          ? dayjs(projection.adminLastLogin.timestamp).format(
                              "YYYY MMMM D, h:mm A"
                            )
                          : "No Data"}
                      </td>
                      <td>{projection.period}</td>
                      <td>
                        {projection?.endDate
                          ? dayjs(projection.endDate).format("MMMM YYYY")
                          : "No Data"}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Link
                            onClick={() => {
                              setIsEditModal(true);
                              setEditId(projection.id);
                              singleMetrics(projection.metricId);
                            }}
                            style={{ backgroundColor: "#0AB39C" }}
                            className="action-btn edit text-light text-decoration-none d-flex justify-content-center align-items-center"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn action-btn delete ms-2"
                            onClick={() =>
                              deleteProjections(projection.id, "ACTIVE")
                            }
                          >
                            <TbReload />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Centered "No Data Found" Message
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <strong>No Data Found</strong>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          }
        </div>

        {(isOpenModal || isEditModal) && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div
                    className="modal-header pb-3"
                    style={{ background: "#F4F6F9" }}
                  >
                    <h5 className="modal-title">
                      {isEditModal ? "Edit Projections" : "Add Projections"}{" "}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => {
                        setIsOpenModal(false);
                        setIsEditModal(false);
                      }}
                      // onClick={onClose}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* <form> */}

                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">
                        User Name
                      </label>
                      <select
                        className="form-select"
                        id="username"
                        name="username"
                        {...register("username")}

                        // value={formData.role}
                        // onChange={handleInputChange}
                      >
                        <option selected value="">
                          Select User
                        </option>

                        {users.map((user) => (
                          <option value={user.id}>
                            {user.firstName} {user.lastName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">
                        Metric Name
                      </label>
                      <select
                        className="form-select"
                        id="metrics"
                        name="metrics"
                        {...register("metricId")}
                        onChange={(e) => singleMetrics(e.target.value)}

                        // value={formData.role}
                        // onChange={handleInputChange}
                      >
                        <option value="" selected>
                          Select Metric
                        </option>

                        {metrics.map((metric) => (
                          <option value={metric.id}>{metric.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="metricName" className="form-label">
                        Projection #
                      </label>
                      {/* <Controller
                      name="targetValue"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div className="input-group"> 
                          {
                            (selectedMetrics?.type=="NUMBER") && 
                          <span className="input-group-text">$</span>
                          }
                          <input
                            type="text"
                            className="form-control"
                            id="targetValue"
                            placeholder="Enter Projection Value"
                            {...field}
                            onChange={(e) => {
                              const inputValue = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numeric and dot values
                              field.onChange(inputValue); // Update the form field value
                            }}
                          />
                      </div>
                    )}
                  /> */}
                      {console.log("tank", selectedMetrics)}
                      <Controller
                        name="targetValue"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <input
                            className="form-control"
                            placeholder="Enter Projection Value"
                            value={
                              selectedMetrics?.type === "CURRENCY"
                                ? `$${field.value || ""}` // Add dollar sign dynamically for "NUMBER" type
                                : selectedMetrics?.type == "PERCENTAGE"
                                ? `%${field.value || ""}`
                                : field.value || "" // For other types, just display the value
                            }
                            onChange={(e) => {
                              const inputValue = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                              ); // Keep only numeric and dot values
                              field.onChange(inputValue); // Update the form field value
                            }}
                          />
                        )}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">
                        Period
                      </label>
                      {/* <select
                        className="form-select"
                        id="period"
                        name="period"
                        {...register("period",onChange:{((e)=>(setPeriod(e.target.value)))})}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>

                      </select> */}

                      <select
                        className="form-select"
                        id="period"
                        name="period"
                        {...register("period")} // Register the field with react-hook-form
                        onChange={(e) => setPeriod(e.target.value)} // Add onChange handler separately
                        value={period} // Controlled component: value is set by state
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>

                    {/* monthly appear field */}

                    {typeSelect == "PERCENTAGE" ? (
                      <div>
                        <div className="mb-3">
                          <label htmlFor="operator" className="form-label">
                            Field 1 Label
                          </label>
                          <select
                            type="text"
                            className="form-control"
                            // id="operator"
                            // name="operator"
                            {...register("value1")}
                            // value={formData.operator}
                            // onChange={handleInputChange}
                          >
                            <option value={""}>Select...</option>

                            {metrics.map((metric) => (
                              <option value={metric.id}>{metric.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">
                            Operator
                          </label>
                          <select
                            className="form-select"
                            // id="role"
                            // name="role"
                            // value={formData.role}
                            // onChange={handleInputChange}
                            {...register("operator")}
                            value={"/"}
                          >
                            <option selected value="/">
                              /
                            </option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">
                            2nd field Label
                          </label>
                          <select
                            type="text"
                            className="form-control"
                            id="operator"
                            name="operator"
                            {...register("value2")}
                          >
                            <option value="">Select...</option>
                            {metrics.map((metric) => (
                              <option value={metric.id}>{metric.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {/* </form> */}
                  </div>
                  <div className="modal-footer border-none">
                    {/* <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => {setIsOpenModal(false); setIsEditModal(false)}}
                      // onClick={onClose}
                    >
                      Close
                    </button> */}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      // onClick={handleSubmit}
                      style={{ backgroundColor: "#0AB39C" }}
                    >
                      {isEditModal ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricGoal;
