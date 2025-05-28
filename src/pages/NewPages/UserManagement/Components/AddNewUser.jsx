import { React, useEffect, useMemo, useRef, useState } from "react";
import "./style.scss";
import { ReactSVG } from "react-svg";
import leftArrow from "../../../../assets/newImages/arrow-left.svg";
import closeIcon from "../../../../assets/newImages/close-circle.svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import { Link } from "react-router-dom";
import auth, { apiGet, apiGetPublic } from "../../../../CustomHooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import TimezoneSelect from "react-timezone-select";
import countryList from "react-select-country-list";
import Select from "react-select";

const AddNewUser = () => {
  const [loading, setIsLoading] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [country, setCountry] = useState("");
  const [fields, setFields] = useState([{ company: "", role: "" }]);
  const [companies, setCompanies] = useState([]);
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  // const [selectedTimezone, setSelectedTimezone] = useState({});
  const [selectedTimezone, setSelectedTimezone] = useState(null);

  // const [fields, setFields] = useState([{ company: "", role: "" }]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onSubmit", // or "onChange" / "onBlur" for real-time validation
  });
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;

  const token = localStorage.getItem("token");

  const options = useMemo(() => countryList().getData(), []);
  const onSubmit = async (data) => {
    console.log("jiio", data);

    // console.log("country data",data.country.label)
    // if (!data.timezone) {
    //   swal("Error!", "Timezone is required", "error");
    //   return;
    // }

    // if (!country) {
    //   // Custom check if country isn't integrated properly with react-hook-form
    //   swal("Error!", "Country selection is required", "error");
    //   return;
    // }
    try {
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}users`;

      const formData = new FormData();
      formData.append("firstName", data.first_name);
      formData.append("lastName", data.last_name);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      // formData.append("address", data.address);
      formData.append("country", country.label);
      // formData.append("city", data.city);
      // formData.append("zipcode", data.zipcode);
      formData.append("companyId", 1);
      formData.append("role", 2);
      // formData.append("startDate", data.startDate);
      formData.append("timezone", data.timezone.value);

      // formData.append("region",data.timezone)

      fields.forEach((field, index) => {
        formData.append(
          `companyRoles[${index}][companyId]`,
          data.fields[index]?.company?.value // Corrected path
        );
        formData.append(
          `companyRoles[${index}][role]`,
          data.fields[index]?.role?.value // Corrected path
        );
      });

      const response = await auth.apiPost(url, formData, token);
      if (response.success) {
        swal("Success!", "User added successfully!", "success");
        setFields([{ company: "", role: "" }]); // Reset fields
      }
    } catch (error) {
      console.error(error);
      swal("Error!", "Something went wrong.", "error");
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    getCompanies();
  }, []);

  // useEffect(())

  // const handleDeactivate = () => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     buttons: ["Cancel", "Yes, deactivate it!"],
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       swal("Deactivated!", "The profile has been deactivated.", "success",{buttons:false,timer:"1000"});
  //     }
  //   });
  // };

  const handleDeactivate = async (userId) => {
    swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      buttons: ["Cancel", "Yes, deactivate it!"],
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/users/${userId}`; // Update with the correct endpoint
          const response = await auth.apiPost(
            url,
            { status: "deactivated" },
            token
          ); // Replace with appropriate API method

          if (response.success) {
            swal(
              "Deactivated!",
              "The profile has been deactivated.",
              "success",
              {
                buttons: false,
                timer: 2000,
              }
            );
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

  const changeHandler = (value) => {
    setCountry(value);
  };

  const addField = () => {
    setFields([...fields, { company: "", role: "" }]);
  };

  const resetFields = () => {};

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
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
    getRoles();
  }, []);

  document.title = "Company | PIFPerfect";

  return (
    <div className="page-content">
      <div>
        <div className="custom-header-ctm">
          <Link to="/user-management" className="no-underline">
            <h4 className="d-flex gap-2">
              <div>
                <ReactSVG src={leftArrow} />
              </div>
              <div>
                <p>Add User</p>
              </div>
            </h4>
          </Link>
        </div>
        <div className="ctm-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h5>Personal Details</h5>
            <div className="row">
              <div className="col-md-6">
                {/* <label className="form-label ">*</label> */}
                <label className="form-label fw-bold">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="First Name"
                  {...register("first_name", { required: true })}
                />
              </div>

              <div className="col-md-6 ps-md-1">
                <label className="form-label fw-bold">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  placeholder="Last Name"
                  {...register("last_name")}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Phone <span className="text-danger">*</span>
                </label>
                <Controller
                  name="phone"
                  control={control}
                  // rules={{ required: true }}
                  // rules={{ required: true }}
                  render={({ field }) => (
                    <PhoneInput
                      className="phone-input"
                      country={"us"}
                      onChange={(value) => field.onChange(value)}
                      {...field}
                      inputProps={{
                        required: true,
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-md-6 ps-md-1">
                {/* {errors.email && (
                  <span style={{ color: "red" }} className="pb-5">
                    Email should be required
                  </span>
                )} */}
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

              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Country <span className="text-danger">*</span>
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={options}
                      value={options.find(
                        (option) => option.value === field.value
                      )} // Map value for controlled input
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption.value); // Update form state
                        setCountry(selectedOption); // Update local state if needed
                      }}
                      placeholder="Select your country"
                    />
                  )}
                />
              </div>

              <div className="col-md-6 ps-md-1">
                <div className="select-wrapper">
                  {/* {errors.timezone && (
                    <p className="error" style={{ color: "red" }}>
                      {errors.timezone.message}
                    </p>
                  )} */}
                  <label className="form-label fw-bold">
                    Timezone <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="timezone"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <TimezoneSelect
                        {...field}
                        // value={field.value}
                        // onChange={(value) => field.onChange(value || null)}
                        value={field.value || { label: "", value: "" }} // Provide fallback if field.value is null
                        onChange={(value) =>
                          field.onChange(value || { label: "", value: "" })
                        } // Ensure a valid object on change
                        placeholder="Select your timezone"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* <hr className="ctm-hr" />
            <h5>Joining Details</h5>
            <div className="row">
              <div className="col-md-4">
                <Controller
                  name="startDate" // Register name
                  control={control}
                  defaultValue={12} // Initial value
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
            </div> */}

            <hr className="ctm-hr" />
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
                  {/* <CreatableSelect
                    isClearable
                    options={[
                      { label: "One", value: 1 },
                      { label: "Two", value: 2 },
                      { label: "Three", value: 3 },
                    ]}
                  /> */}
                  {/* <select
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
                    <option selected> Select Company </option>
                    {companies
                      .filter((comp) => comp.isActive) // Filter companies where isActive is false
                      .map((comp) => (
                        <option key={comp.id} value={comp.id}>
                          {comp.name}
                        </option>
                      ))}
                  </select> */}
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

            <div className="submit-btns mt-5">
              <button className="custom_submit_btn" type="submit">
                <ReactSVG src={refreshIcon} /> Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewUser;
