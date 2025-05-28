import React, { useState, useEffect } from "react";
import FormWithLabel from "./Component/FieldWithLabel";
import { ReactSVG } from "react-svg";
import { salesManagerForm } from "./metricData";
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
import { MultiSelect } from "react-multi-select-component";
import UserMinus from "../../../assets/newImages/user-minus.png";
import { TbReload } from "react-icons/tb";

const MetricGoal = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const { REACT_APP_API_URL } = process.env;

  const [tab, setTab] = useState(1);
  const [role, setRole] = useState(3);
  const [user, setUser] = useState({});
  const [typeSelect, setTypeSelect] = useState(0);
  const [deleteId, setDeleteId] = useState();
  const [getSingleMetrics, setGetSingleMetrics] = useState();

  // const [loading, setIsLoading] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const token = localStorage.getItem("token");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editId, setEditId] = useState();
  const [selected, setSelected] = useState([]);
  const [products, setProducts] = useState([]);
  const [IsOpenPredefined, setIsOpenPredefined] = useState(false);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  console.log("Search tex", searchQuery);

  const options = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
  ];

  const getProducts = async (user) => {
    setIsLoading(true);
    try {
      // const url = `${REACT_APP_API_URL}products?companyId=${user.companyId}`;
      const url = `${REACT_APP_API_URL}products?companyId=${user?.companyId}`;

      const response = await apiGet(url, {}, token);
      if (response.success) {
        // setProducts(response.data.records);
        const options = response.data.records.map((product) => ({
          label: product.productName,
          value: product.id,
        }));

        setProducts(options);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricsGoals = async (status) => {
    let url = `${REACT_APP_API_URL}metrics`;

    if (status) {
      url += `?status=${status}`;
    }

    const response = await apiGet(url, {}, token);
  };

  // useEffect(()=>{
  //   const localStorage=localStorage.
  // },[])

  // useEffect(() => {
  //   getMetricsGoals();
  //   const token = localStorage.getItem("user");
  // }, []);

  const getMetrics = async (value, status) => {
    try {
      let url = "";
      if (user.role == 1) {
        url = `${REACT_APP_API_URL}metrics`;
      } else {
        url = `${REACT_APP_API_URL}metrics?companyId=${user.companyId}`;
      }

      if (status) {
        url += `&status=${status}`;
      }

      if (value) {
        url += `&name=${value}`;
      }

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

  useEffect(() => {
    getMetrics();
  }, [user]);

  const onSubmit = async (data) => {
    console.log("kuk", data);
    try {
      // {
      //   isEditModal ?
      // }
      let url = "";
      {
        isEditModal
          ? (url = `${REACT_APP_API_URL}metrics/${editId}`)
          : (url = `${REACT_APP_API_URL}metrics`);
      }

      // Prepare the URL with query parameters
      // const params = {
      //   name: data.name,
      //   // type: typeSelect,
      //   type: data.type,
      //   operator: data.operator,
      //   ...(data.type === "PERCENTAGE" && {
      //     value1Id: data.value1,
      //     value2Id: data.value2,
      //   }),
      //   role: data.role,

      //   user.role !=1{

      //     companyId: user.companyId,
      //     productId: data.product,
      //     productIds: selected.map((m) => m.value),
      //   }
      // };

      const params = {
        name: data.name,
        type: data.type,
        operator: data.operator,
        ...(data.type === "PERCENTAGE" && {
          value1Id: data.value1,
          value2Id: data.value2,
        }),
        role: data.role,
      };

      // Conditionally add extra fields

      if (user.role == 1) {
        params.isDefault = true;
      }

      if (user.role !== 1) {
        params.companyId = user.companyId;
        params.productId = data.product;
        params.productIds = selected.map((m) => m.value);
      }

      // Send the request
      let response;
      if (isEditModal) {
        response = await apiPut(url, params, token);
      } else {
        response = await apiPost(url, params, token);
      }

      if (response.success) {
        // setIsOpenModal(false);

        {
          !isEditModal ? reset() : "";
        }

        getMetrics();
        // reset();

        // if (isEditModal) {
        //   setValue("name", "2"); // Clear value or set a default
        //   setValue("type", "3"); // For typeSelect
        //   setValue("operator", "4"); // Clear operator
        //   setValue("value1", ""); // Clear value1
        //   setValue("value2", ""); // Clear value2
        //   setValue("role", "4"); // Set default role if needed
        // }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditModal && getSingleMetrics) {
      // Set other form values
      setValue("name", getSingleMetrics.name || "");
      setValue("type", getSingleMetrics.type || 1);
      setValue("operator", getSingleMetrics.operator || "");
      setValue("value1", getSingleMetrics.value1 || "");
      setValue("value2", getSingleMetrics.value2 || "");
      setValue("role", getSingleMetrics.role || "4");

      // Pre-fill the multi-select field
      if (products?.length > 0) {
        // Ensure products array is loaded
        const preSelectedProducts = products.filter((option) =>
          getSingleMetrics.products?.includes(option.value)
        );
        setSelected(preSelectedProducts);
        setValue("selected", preSelectedProducts);
      }
    }
  }, [isEditModal, getSingleMetrics, products, setValue]);

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

  const toggleMetricsStatus = async (id, currentStatus) => {
    // Determine the new status and action text
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const actionText = currentStatus === "ACTIVE" ? "Deactivate" : "Activate";

    // Show confirmation dialog using SweetAlert
    swal({
      title: `Are you sure you want to ${actionText} this metric?`,
      text: `This action will ${actionText} the metric.`,
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
          text: `Yes, ${actionText} it!`,
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
          const url = `${REACT_APP_API_URL}metrics/${id}`;
          const params = {
            status: newStatus,
          };

          // Send the API request
          const response = await apiPut(url, params, token);

          if (response) {
            swal(
              `${actionText}!`,
              `The metric has been ${actionText.toLowerCase()}d.`,
              "success",
              {
                buttons: false,
                timer: 2000,
              }
            );
            getMetrics(); // Refresh the metrics data
          } else {
            swal(
              "Error!",
              "Something went wrong while changing status.",
              "error"
            );
          }
        } catch (error) {
          console.error("Error toggling status:", error);
          swal("Error!", "Something went wrong.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // useEffect(() => {
  //   deleteMetrics(deleteId);
  // }, [deleteId]);

  // const userRoles=localStorage.getItem("userInfo")

  const getSingle = async (editId) => {
    const url = `${REACT_APP_API_URL}metrics/${editId}`;
    const params = {};
    const response = await apiGet(url, {}, token);

    if (response) {
      setGetSingleMetrics(response.data);
    }
  };

  useEffect(() => {
    getSingle(editId);
  }, [editId]);

  useEffect(() => {
    getMetricsGoals();
  }, []);

  console.log("liiii", metrics);

  useEffect(() => {
    getProducts(user);
  }, [user]);

  // useEffect(()=>{
  //   getMetrics();

  // },[metrics])

  const onPredefinedSubmit = async (data) => {
    console.log("loooppa", data);
    try {
      let url = `${REACT_APP_API_URL}metrics`;

      // Prepare the URL with query parameters
      const params = {};

      // Send the request
      const response = await apiPost(url, params, token);

      if (response.success) {
        reset();
        getMetrics();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e);
    getMetrics(e, status); // Fetch data based on search query
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
              <span className="me-2">+</span> Add Metrics
            </button>

            {/* <button
              className="FFbtn text-light ms-3"
              style={{ backgroundColor: "#0AB39C" }}
              onClick={() => {
                setIsOpenPredefined(true);
                reset();
              }}
            >
              <span className="me-2">+</span> Predefined
            </button> */}
          </div>

          <form className="mt-2 d-flex gap-3 mb-3">
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
                  getMetrics(searchQuery, value);
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
            <div className="search-ctm new-search">
              <input
                placeholder="Search..."
                // value={}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }} // Handle input change
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
                  <th scope="col"> Metric Name</th>
                  <th scope="col">
                    <MdOutlineArrowDropUp fontSize={20} /> Type
                  </th>
                  <th scope="col">
                    <MdOutlineArrowDropUp fontSize={20} /> Status
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
                ) : // Check if metrics array is empty
                metrics.length > 0 ? (
                  // Render metrics data
                  metrics.map((metric) => (
                    <tr key={metric.id}>
                      <td className="fw-medium">
                        <div className="user-img">{metric.name}</div>
                      </td>
                      <td>{metric.type}</td>
                      <td>
                        <span
                          className={`p-1 pe-2 ps-2 text-light text-sm rounded-pill ${
                            metric.status === "ACTIVE"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          <small>{metric.status}</small>
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Link
                            onClick={() => {
                              setIsEditModal(true);
                              setEditId(metric.id);
                            }}
                            // style={{ backgroundColor: "#0AB39C" }}
                            className="action-btn edit text-light text-decoration-none d-flex justify-content-center align-items-center"
                          >
                            <ReactSVG src={editIcon} />
                          </Link>
                          <button
                            disabled={metric.isDeleted ? false : true}
                            className={`btn border-0 action-btn ms-2 ${
                              metric.status === "ACTIVE" ? "delete" : "success"
                            }`}
                            onClick={() =>
                              toggleMetricsStatus(metric.id, metric.status)
                            }
                            // disabled={isLoading} // Disable the button while toggling
                          >
                            {metric.status === "ACTIVE" ? (
                              <img src={UserMinus} alt="Deactivate" />
                            ) : (
                              <TbReload />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Render "No Product Found" message
                  <tr>
                    <td colSpan="4" className="text-center fw-medium">
                      No Product Found
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
                    {isEditModal ? (
                      <h5 className="modal-title">Edit Metrics</h5>
                    ) : (
                      <h5 className="modal-title">Add Metrics</h5>
                    )}
                    {/* <h5 className="modal-title">Add Customer</h5> */}
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => {
                        setIsOpenModal(false);
                        setIsEditModal(false);
                        reset();
                      }}
                      // onClick={onClose}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* <form> */}
                    <div className="mb-3">
                      <label htmlFor="metricName" className="form-label">
                        Metrics Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="metricName"
                        name="metricName"
                        {...register("name")}
                        // value={formData.metricName}
                        // onChange={handleInputChange}
                      />
                    </div>

                    {/* Multi Select Field
                    <div className="mb-3">
                      <label htmlFor="multiSelect" className="form-label">
                        Select Product(s)
                      </label>
                      <Controller
                        name="selected"
                        control={control}
                        defaultValue={[]} // Default value for the multi-select
                        placeholder="Select Products"
                        render={({ field }) => (
                          <MultiSelect
                            options={products}
                            placeholder="Select Products"
                            value={selected}
                            onChange={setSelected}
                            labelledBy="Select"
                            // Custom rendering for selected pills
                            valueRenderer={(selectedItems) => (
                              <div className="selected-pills">
                                {selectedItems.map((item) => (
                                  <span key={item.value} className="pill">
                                    {item.label}
                                    <button
                                      type="button"
                                      className="pill-remove rounded-pill ms-2 bg-transparent border-0 text-light text-xl"
                                      onClick={() =>
                                        setSelected(
                                          selected.filter(
                                            (i) => i.value !== item.value
                                          )
                                        )
                                      }
                                    >
                                      &times;
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                            // Custom rendering for dropdown options (without checkboxes)
                            ItemRenderer={({ option, checked, onClick }) => (
                              <div
                                onClick={onClick}
                                style={{
                                  cursor: "pointer",
                                  padding: "5px 10px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <span style={{ marginLeft: "10px" }}>
                                  {option.label}
                                </span>
                              </div>
                            )}
                          />
                        )}
                      />
                    </div> */}

                    {user.role !== 1 && (
                      <div className="mb-3">
                        <label htmlFor="multiSelect" className="form-label">
                          Select Product(s)
                        </label>
                        <Controller
                          name="selected"
                          control={control}
                          defaultValue={[]} // Default value for the multi-select
                          placeholder="Select Products"
                          render={({ field }) => (
                            <MultiSelect
                              options={products}
                              placeholder="Select Products"
                              value={selected}
                              onChange={setSelected}
                              labelledBy="Select"
                              // Custom rendering for selected pills
                              valueRenderer={(selectedItems) => (
                                <div className="selected-pills">
                                  {selectedItems.map((item) => (
                                    <span key={item.value} className="pill">
                                      {item.label}
                                      <button
                                        type="button"
                                        className="pill-remove rounded-pill ms-2 bg-transparent border-0 text-light text-xl"
                                        onClick={() =>
                                          setSelected(
                                            selected.filter(
                                              (i) => i.value !== item.value
                                            )
                                          )
                                        }
                                      >
                                        &times;
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                              // Custom rendering for dropdown options (without checkboxes)
                              ItemRenderer={({ option, checked, onClick }) => (
                                <div
                                  onClick={onClick}
                                  style={{
                                    cursor: "pointer",
                                    padding: "5px 10px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span style={{ marginLeft: "10px" }}>
                                    {option.label}
                                  </span>
                                </div>
                              )}
                            />
                          )}
                        />
                      </div>
                    )}

                    {/* <div className="mb-3">
                          <label htmlFor="operator" className="form-label">
                            Products
                          </label>
                          <select
                            type="text"
                            className="form-control"
                            // id="operator"
                            // name="operator"
                            {...register("products")}
                            // value={formData.operator}
                            // onChange={handleInputChange}
                          >
                            <option value={""}>Select...</option>

                            {products.map((product) => (
                              <option value={product.id}>{product.productName}</option>
                            ))}
                          </select>
                    </div> */}

                    {!isEditModal ? (
                      <>
                        <div className="mb-3">
                          <label htmlFor="type" className="form-label">
                            Type
                          </label>
                          <select
                            className="form-select"
                            id="type"
                            name="type"
                            // value={formData.type}
                            // onChange={(e) => handleTypeSelect(e.target.value)}
                            // {...register("type"),onc}
                            // {...register("type", {
                            //   onChange: (e) => handleTypeSelect(e.target.value),
                            // })}

                            {...register("type")}
                          >
                            {/* <option value="">Select Your Type</option> */}

                            <option value="NUMBER">Number</option>
                            <option value="CURRENCY">Currency</option>
                            {/* <option value="PERCENTAGE">Percentage</option> */}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="role" className="form-label">
                            Role
                          </label>
                          <select
                            className="form-select"
                            id="role"
                            name="role"
                            {...register("role")}

                            // value={formData.role}
                            // onChange={handleInputChange}
                          >
                            <option value="4">Closer</option>
                            <option value="5">Setter</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {/* {typeSelect == "PERCENTAGE" ? (
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
                    )} */}
                    {/* </form> */}
                  </div>
                  <div className="modal-footer border-none">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => {
                        setIsOpenModal(false);
                        setIsEditModal(false);
                      }}
                      // onClick={onClose}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      // oncli
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

        {/* PREDEFINED METRICS  */}

        {/* {IsOpenPredefined && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
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
                <div style={{width:"1000px"}} className="modal-content">
                  <div className="modal-body">
                    <Table className="align-middle table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th scope="col"> Company Name</th>
                          <th scope="col">
                            <MdOutlineArrowDropUp fontSize={20} /> Type
                          </th>
                          <th scope="col">
                            <MdOutlineArrowDropUp fontSize={20} /> Status
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
                        ) : // Check if metrics array is empty
                        metrics.length > 0 ? (
                          // Render metrics data
                          metrics.map((metric) => (
                            <tr key={metric.id}>
                              <td className="fw-medium">
                                <div className="user-img">{metric.name}</div>
                              </td>
                              <td>{metric.type}</td>
                              <td>
                                <span
                                  className={`p-1 pe-2 ps-2 text-light text-sm rounded-pill ${
                                    metric.status === "ACTIVE"
                                      ? "bg-success"
                                      : "bg-danger"
                                  }`}
                                >
                                  <small>{metric.status}</small>
                                </span>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <Link
                                    onClick={() => {
                                      setIsEditModal(true);
                                      setEditId(metric.id);
                                    }}
                                    style={{ backgroundColor: "#0AB39C" }}
                                    className="action-btn edit text-light text-decoration-none d-flex justify-content-center align-items-center"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    className={`btn action-btn ms-2 ${
                                      metric.status === "ACTIVE"
                                        ? "delete"
                                        : "success"
                                    }`}
                                    onClick={() =>
                                      toggleMetricsStatus(
                                        metric.id,
                                        metric.status
                                      )
                                    }
                                    disabled={isLoading} // Disable the button while toggling
                                  >
                                    {metric.status === "ACTIVE" ? (
                                      <img src={UserMinus} alt="Deactivate" />
                                    ) : (
                                      <TbReload />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          // Render "No Product Found" message
                          <tr>
                            <td colSpan="4" className="text-center fw-medium">
                              No Product Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )} */}

        {IsOpenPredefined && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <form onSubmit={handleSubmit(onPredefinedSubmit)}>
              <div
                className="modal-dialog modal-dialog-centered mx-auto"
                style={{ maxWidth: "1200px", width: "90%" }} // Increased width
                role="document"
              >
                <div className="modal-content w-100">
                  {/* Modal Header */}
                  <div className="modal-header">
                    <h5 className="modal-title">Predefined Metrics</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => {
                        setIsOpenModal(false);
                        setIsEditModal(false);
                        setIsOpenPredefined(false);
                      }}
                    ></button>
                  </div>

                  {/* Modal Body */}
                  <div className="modal-body">
                    <Table className="table align-middle table-bordered mb-0">
                      <thead>
                        <tr className="text-center">
                          <th scope="col">Metric</th>
                          <th scope="col">Custom Label</th>
                          <th scope="col">Status</th>
                          {/* <th scope="col">Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <SkeletonTable
                            rows={5}
                            columns={[200, 150, 100, 200]}
                          />
                        ) : metrics.length > 0 ? (
                          metrics.map((metric) => (
                            <tr key={metric.id} className="text-center">
                              {console.log("plieeeee", metric)}
                              <td className="fw-medium">
                                <small className="me-3 ">
                                  <input type="checkbox" />
                                </small>
                                {metric.name}
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Custom Label"
                                />
                              </td>
                              <td>
                                <span
                                  className={`p-1 pe-2 ps-2 text-light text-sm rounded-pill  `}
                                >
                                  <small>
                                    <input type="checkbox" />
                                  </small>
                                </span>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center gap-2">
                                  <Link
                                    onClick={() => {
                                      setIsEditModal(true);
                                      setEditId(metric.id);
                                    }}
                                    style={{ backgroundColor: "#0AB39C" }}
                                    className="action-btn edit text-light text-decoration-none d-flex justify-content-center align-items-center"
                                  >
                                    Edit
                                  </Link>
                                  {metric.isDeleted == false ? (
                                    <>
                                      {console.log("yessss")}
                                      <button
                                        className={`btn action-btn ${
                                          metric.status === "ACTIVE"
                                            ? "delete"
                                            : "success"
                                        }`}
                                        onClick={() =>
                                          toggleMetricsStatus(
                                            metric.id,
                                            metric.status
                                          )
                                        }
                                        disabled={isLoading}
                                      >
                                        {metric.status === "ACTIVE" ? (
                                          <img
                                            src={UserMinus}
                                            alt="Deactivate"
                                          />
                                        ) : (
                                          <TbReload />
                                        )}
                                      </button>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center fw-medium">
                              No Product Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {/* Modal Footer with Close Button */}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsOpenModal(false);
                        setIsEditModal(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* PREDEFINED METRICS */}
      </div>
    </div>
  );
};

export default MetricGoal;
