import { React, useEffect, useMemo, useRef, useState } from "react";
import "./style.scss";
import { ReactSVG } from "react-svg";
import leftArrow from "../../../../assets/newImages/arrow-left.svg";
import closeIcon from "../../../../assets/newImages/close-circle.svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import { Link, Navigate } from "react-router-dom";
import auth, { apiGet, apiGetPublic } from "../../../../CustomHooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom"; // Use useParams for retrieving id
import TimezoneSelect from "react-timezone-select";
import { Checkbox } from "@progress/kendo-react-inputs";
import lockIcon from "../../../../assets/newImages/lock.svg";
import authenticateUser from "../../../../assets/newImages/security-user.png";

import countryList from "react-select-country-list";
import Select from "react-select";

const AddNewUser = () => {
  const [data, setData] = useState();
  const { id } = useParams(); // Retrieve the id from the URL
  const [loading, setIsLoading] = useState();
  const [startDate, setStartDate] = useState(new Date());
  // const [country, setCountry] = useState("");
  const [fields, setFields] = useState([{ company: "", role: "" }]);
  // console.log("llll")
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [selectedTimezone, setSelectedTimezone] = useState({});
  // const [selectedTimezone2, setSelectedTimezone2] = useState({
  //   value: "Europe/Amsterdam",
  // });

  console.log("****", selectedTimezone);

  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [country, setCountry] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  console.log("poookie", country);

  const options = useMemo(() => countryList().getData(), []);
  const onSubmit = async (data) => {
    console.log("dddd", data);
    try {
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}users/${id}`;

      const formData = new FormData();
      formData.append("firstName", data.first_name);
      formData.append("lastName", data.last_name);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      // formData.append("address", data.address);
      formData.append("country", country.label);
      // formData.append("city", data.city);
      // formData.append("zipcode", data.zipcode);
      // formData.append("companyId", 1);
      // formData.append("role", 2);
      // formData.append("startDate", data.startDate);
      formData.append("timezone", data.timezone.value);

      fields.forEach((field, index) => {
        formData.append(
          `companyRoles[${index}][companyId]`,
          data.fields[index]?.company?.value
        );
        formData.append(
          `companyRoles[${index}][roleId]`,
          data.fields[index]?.role?.value
        );
      });

      const response = await auth.apiPut(url, formData, token);
      if (response.success) {
        navigate("/user-management");
        swal("Success!", "User added successfully!", "success", {
          buttons: false,
          timer: 1500,
        });
        setFields([{ company: "", role: "" }]); // Reset fields
      }
    } catch (error) {
      console.error(error);
      swal("Error!", "Something went wrong.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyDetails = async () => {
    try {
      const url = `${REACT_APP_API_URL}users/${id}`;
      const params = {};
      const response = await apiGet(url, params, token);

      if (response.success) {
        // Set the fetched data to form values
        const companyData = response.data;
        console.log("unbeleie", companyData);

        setData(companyData);
        // const formattedExpiration = companyData.joinDate
        //   ? dayjs(companyData.joinDate).format("YYYY-MM-DD") // Format the date to 'YYYY-MM-DD'
        //   : ""; // Set to empty if no expiration is found

        // setValue("name", companyData.name);
        setValue("first_name", companyData.firstName);
        setValue("last_name", companyData.lastName);
        setValue("email", companyData.email);
        setValue("phone", companyData.phone);
        setCountry({
          label: companyData.country,
        });
        setSelectedTimezone({
          value: companyData.timezone,
        });
        // setCountry(companyData.country);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("select time zone", selectedTimezone);

  useEffect(() => {
    // const storedCountry = JSON.parse(localStorage.getItem("userInfo"));

    if (data?.country) {
      const countryOption = options.find(
        (option) => option.label === data?.country
      );
      if (countryOption) {
        setCountry(countryOption);
      }
    }
  }, [options]);

  useEffect(() => {
    getCompanyDetails();
  }, []);

  const handleDeactivate = async () => {
    const newStatus = data?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"; // Toggle logic
    const btnText = newStatus == "ACTIVE" ? "Activate" : " Deactivate";
    // const newStatus=data?.status=="ACTIVE" ? "INACTIVE" : "ACTIVE"
    swal({
      title: "Are you sure?",
      text: "Deactivating this user will deactivate them in all companies.",
      icon: "warning",
      buttons: ["Cancel", `Yes, ${btnText} User`],
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const url = `${REACT_APP_API_URL}/users/${id}`; // Update with the correct endpoint
          const response = await auth.apiPut(url, { status: newStatus }, token); // Replace with appropriate API method

          if (response.success) {
            swal(`${btnText}!`, `The profile has been ${btnText}.`, "success", {
              buttons: false,
              timer: 2000,
            });
            getCompanyDetails();
          } else {
            swal("Error!", "Something went wrong while deactivating.", "error");
          }
        } catch (error) {
          console.error(error);
          swal("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  useEffect(() => {
    getCompanyDetails();
  }, []);

  const changeHandler = (value) => {
    setCountry(value);
  };

  const addField = () => {
    setFields([...fields, { company: "", role: "" }]);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const storedCountry = JSON.parse(localStorage.getItem("userInfo"));

    if (data) {
      const countryOption = options.find(
        (option) => option.label === storedCountry.country
      );
      if (countryOption) {
        setCountry(countryOption);
      }
    }
  }, [options]);

  // input checkboxes checked

  const [checked, setChecked] = useState(false);
  const handleClick = () => {
    setChecked(!checked);
  };
  const handleChange = (event) => {
    setChecked(event.value);
  };

  const getCompanies = async () => {
    // setIsLoading(true);
    try {
      const url = `${REACT_APP_API_URL}companies`; // Include search query
      const params = {
        // status: "ACTIVE",
        // limit: pShow,
        // page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
      };
      const response = await apiGet(url, params, token);
      // setTotalPage(response.data.totalPages);

      if (response.success) {
        const formatedData = response.data.records.map((d) => ({
          value: d.id,
          label: d.name,
        }));
        setCompanies(formatedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
        console.log(dbValues, "dab");
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
    getRoles();
    getCompanies();
  }, []);

  useEffect(() => {
    if (selectedTimezone) {
      setValue("timezone", selectedTimezone); // Update the form value manually
    }
  }, [selectedTimezone, setValue]); // Run when selectedTimezone updates

  document.title = "Company | PIFPerfect";

  return (
    <div className="page-content">
      <div>
        <div className="custom-header-ctm">
          <Link to="/user-management" className="no-underline">
            <h4 className="d-flex">
              <ReactSVG src={leftArrow} />{" "}
              <span>
                {" "}
                {data?.firstName
                  ? `${data?.firstName} ${data?.lastName}`
                  : "Edit User"}
              </span>
            </h4>
          </Link>
        </div>
        <div className="ctm-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h5>Personal Details</h5>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="First Name"
                  {...register("first_name")}
                />
              </div>
              <div className="col-md-6 ">
                <label className="form-label fw-bold">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Last Name"
                  {...register("last_name")}
                />
              </div>
              <div className="col-md-6 ">
                <label className="form-label fw-bold">
                  Phone <span className="text-danger">*</span>
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <PhoneInput
                      className="phone-input"
                      country={"us"}
                      onChange={(value) => field.onChange(value)}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Email Address"
                  type="email"
                  {...register("email")}
                />
              </div>

              <div className="row p-0 m-0">
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    Country <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={options}
                    // value={country}
                    value={country}
                    onChange={changeHandler}
                    placeholder={"Select your country"}
                  />
                </div>
                {console.log("timezone coms", selectedTimezone)}

                <div className="col-md-6">
                  <div className="select-wrapper">
                    <label className="form-label fw-bold">
                      Timezone <span className="text-danger">*</span>
                    </label>
                    <Controller
                      rules={{
                        required: "Timezone is required", // Validation rule
                      }}
                      name="timezone" // Field name
                      control={control} // Pass the control from useForm
                      defaultValue={selectedTimezone} // Default value
                      render={({ field }) => (
                        <TimezoneSelect
                          {...field} // Spread field props for value and onChange
                          value={field.value} // Bind the value to the form state
                          onChange={field.onChange} // Update the form state on selection
                          placeholder="Select your timezone"
                        />
                      )}
                    />
                    {errors.timezone && (
                      <p className="error">{errors.timezone.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr className="ctm-hr" />
            <h5>Joining Details</h5>
            <div className="row">
              <div className="col-md-4">
                <Controller
                  name="startDate" // Register name
                  control={control}
                  defaultValue={null} // Initial value
                  render={({ field }) => (
                    <DatePicker
                      {...field} // Pass react-hook-form props to DatePicker
                      selected={field.value}
                      className="form-control w-100"
                      onChange={(date) => {
                        setStartDate(date); // Update local state
                        field.onChange(date); // Update react-hook-form state
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="dd/mm/yyyy"
                      disabled
                    />
                  )}
                />
              </div>
            </div>

            <hr className="ctm-hr" />

            {/* <h5>Company Details</h5>
            {fields.map((field, index) => (
              <div className="row mb-3" key={index}>
                <div className="col-md-5">
                  <select
                    className="form-select"
                    value={field.company}
                    onChange={(e) =>
                      setFields(
                        fields.map((item, i) =>
                          i === index
                            ? { ...item, company: e.target.value }
                            : item
                        )
                      )
                    }
                  >
                    <option value="">Choose a Company</option>
                    <option value="Company A">Company A</option>
                    <option value="Company B">Company B</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <select
                    className="form-select"
                    value={field.role}
                    onChange={(e) =>
                      setFields(
                        fields.map((item, i) =>
                          i === index ? { ...item, role: e.target.value } : item
                        )
                      )
                    }
                  >
                    <option value="">Choose a Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>
                <div className="col-md-2 d-flex align-items-start p-0 pt-3">
                  <button
                    type="button"
                    className="text-danger bg-transparent border-0 "
                    onClick={() => handleRemoveField(index)}
                  >
                    <IoIosCloseCircleOutline style={{ fontSize: "20px" }} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary"
              onClick={addField}
              disabled={fields.length === 2}
            >
              + Add More
            </button> */}

            <h5>Company Details</h5>
            {fields.map((field, index) => (
              <div className="row mb-3" key={index}>
                <div className="col-md-5">
                  <label className="form-label fw-bold">
                    Company <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name={`fields[${index}].company`}
                    control={control}
                    defaultValue={field.company || null}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="basic-single"
                        classNamePrefix="select"
                        options={companies}
                        placeholder="Select Company"
                        isClearable
                      />
                    )}
                  />
                </div>

                <div className="col-md-5">
                  <label className="form-label fw-bold">
                    Role <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name={`fields[${index}].role`} // Name of the field
                    control={control}
                    defaultValue={null} // Initial value
                    render={({ field }) => (
                      <Select
                        {...field} // Connects the Select component with react-hook-form
                        className="basic-single"
                        classNamePrefix="select"
                        options={roles}
                        // name="roles"
                        placeholder="Select Roles"
                        isClearable
                      />
                    )}
                  />
                </div>

                <div className="col-md-1 p-0">
                  <button
                    type="button"
                    className="btn text-danger mt-3 p-0"
                    onClick={() => handleRemoveField(index)}
                  >
                    <IoIosCloseCircleOutline style={{ fontSize: "18px" }} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-primary"
              onClick={addField}
              disabled={fields.length == companies.length}
            >
              + Add More
            </button>

            <div className={"mt-5 k-d-flex k-align-items-center"}>
              {/* <button type="button" className="k-mr-4" onClick={handleClick}>
                {" "}
                Change state
              </button> */}
              <Checkbox
                onChange={handleChange}
                // onClick={handleClick}
                label={"Change Password?"}
              />
            </div>
            {checked && (
              <div
                style={{ transition: "all 1s" }}
                className="account-settings mt-3"
              >
                {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                {/* <h5>Change Password</h5> */}
                <div className="row">
                  <div className="col-md-6 position-relative">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Change Password"
                      {...register("oldPassword")}
                    />

                    <div className="input-icon">
                      <ReactSVG src={lockIcon} />
                    </div>
                  </div>

                  <div className={"mb-4 mt-2 k-d-flex k-align-items-center"}>
                    {/* <button type="button" className="k-mr-4" onClick={handleClick}>
                {" "}
                Change state
              </button> */}
                    <Checkbox
                      // checked={checked}
                      // onChange={handleChange}
                      // onClick={handleClick}
                      label={"Are you sure you want to change the password?"}
                    />
                  </div>
                </div>
                <div className="row">
                  {/* <div className="col-md-6 position-relative">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter New Password"
                      {...register("newPassword")}
                    />
                    <div className="input-icon">
                      <ReactSVG src={lockIcon} />
                    </div>
                  </div>
                  <div className="col-md-6 position-relative">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm New Password"
                      {...register("newPasswordConfirm")}
                    />
                    <div className="input-icon">
                      <ReactSVG src={lockIcon} />
                    </div>
                  </div> */}

                  <div class="form-group">
                    <label for="exampleTextarea">Password Change Reason</label>
                    <input
                      class="form-control"
                      id="exampleTextarea"
                      placeholder="Enter your message here"
                    />
                  </div>
                </div>
                <hr className="ctm-hr" />
                <div className="authenticate_now">
                  <h4>2 Factor Authentication (2FA)</h4>
                  <button className="custom_submit_btn primary">
                    <img src={authenticateUser} /> <span>Authenticate Now</span>
                  </button>
                </div>
                {/* <div className="submit-btns">
                  <button className="custom_submit_btn">
                    <ReactSVG src={refreshIcon} /> Save Changes
                  </button>
                </div> */}
                {/* </form> */}
              </div>
            )}
            <div className="submit-btns mt-5">
              <button className="custom_submit_btn" type="submit">
                <ReactSVG src={refreshIcon} /> Save Changes
              </button>
              <button
                className="custom_submit_btn danger"
                type="button"
                onClick={() => handleDeactivate()}
              >
                <ReactSVG src={closeIcon} />{" "}
                {data?.status == "ACTIVE"
                  ? "Deactivate Profile"
                  : "Activate Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewUser;
