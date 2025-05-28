import React, { useState, useMemo, useEffect } from "react";
import { ReactSVG } from "react-svg";
import leftArrow from "../../../../assets/newImages/arrow-left.svg";
import closeIcon from "../../../../assets/newImages/close-circle.svg";
import refreshIcon from "../../../../assets/newImages/repeat.svg";
import stripeIcon from "../../../../assets/newImages/Stripe.svg";
import checkIcon from "../../../../assets/newImages/check.svg";
import galleryUpload from "../../../../assets/newImages/gallery-export.svg";
import dayjs from "dayjs";
import trashIcon from "../../../../assets/newImages/trash.svg";
import Select from "react-select";
import countryList from "react-select-country-list";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import TimezoneSelect from "react-timezone-select";
import CalendarPic from "../../../../assets/newImages/calendar.svg";
import "../../BillingInfo/Component/styles.scss";
import { Link } from "react-router-dom";
import { FormGroup, Input } from "reactstrap";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom"; // Use useParams for retrieving id
import {
  apiGet,
  apiGetPublic,
  apiPost,
  apiPut,
} from "../../../../CustomHooks/useAuth";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";

const BillingDetail = () => {
  const { id } = useParams();
  const options = useMemo(() => countryList().getData(), []);
  // const [country, setCountry] = useState("");
  const [nextBillingDate, setNextBillingDate] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [IstextArea, setIsTextArea] = useState(false);
  const [state, setState] = useState(true);
  const [hide, setHide] = useState();
  const [showCard, setShowCard] = useState();
  const [cities, setCities] = useState([]);
  const [images, setImages] = useState([]);
  const [singleImage, setSingleImage] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [industry, setIndustry] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [singleData, setSingleData] = useState();
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [fields, setFields] = useState([{ company: "", role: "" }]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [country, setCountry] = useState({});
  const [currency, setCurrency] = useState({});

  // console.log("popo",currency)
  const [user, setUser] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm();

  const token = localStorage.getItem("token");

  const changeHandler = (value) => {
    setCountry(value);
    // setCities([]); // Reset cities when country changes
    // setValue("city", ""); // Reset city field when country changes
  };

  //

  const handleDeactivate = () => {
    swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      buttons: ["Cancel", "Yes, deactivate it!"],
    }).then((willDelete) => {
      if (willDelete) {
        // Handle deactivate action here, for example, make API call or change state
        swal("Deactivated!", "The profile has been deactivated.", "success");
      }
    });
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  // const onSubmit = async (data) => {
  //   try {
  //     setIsLoading(true);
  //     // const url = `http://192.168.88.52:3000/api/users`;
  //     const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/users`;

  //     const formData = new FormData();
  //     formData.append("first_name", data.first_name);
  //     formData.append("last_name", data.last_name);
  //     formData.append("phone", data.phone);
  //     formData.append("email", data.email);
  //     formData.append("address", data.address);
  //     formData.append("country", country.label);
  //     formData.append("city", data.city);
  //     formData.append("zipcode", data.zipcode);

  //     const response = await auth.apiPost(url, params, token);
  //     if (response.success) {
  //       setIsOpenModal(false);
  //       // reset();
  //       getUser();
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const onSubmit1 = async (data) => {
  //   console.log("ddodo",data)
  //   try {
  //     setIsLoading(true);
  //     const url =`${REACT_APP_API_URL}companies/update/${user.id}`
  //       // : `${REACT_APP_API_URL}companies/add`;

  //     // const formattedExpiration = dayjs(data.expiration).toISOString();

  //     const formData = new FormData();
  //     formData.append("name", data.name);
  //     formData.append("industry", data.industry);
  //     // formData.append("isTaxable", data.isTaxable);
  //     formData.append("isTaxable", data.isTaxable ? 1 : 0); // Default to 0 if undefined

  //     formData.append("joinDate", data.joinDate);
  //     formData.append("establishedDate", "2023-06-11");

  //     fields.forEach((field, index) => {
  //       formData.append(
  //         `companyRoles[${index}][companyId]`,
  //         data.fields[index]?.company?.value // Corrected path
  //       );
  //       formData.append(
  //         `companyRoles[${index}][role]`,
  //         data.fields[index]?.role?.value // Corrected path
  //       );
  //     });

  //     // if (images.length > 0) {
  //     //   formData.append("logo", images[0].file);
  //     // }

  //     if (images.length > 0) {
  //       formData.append("logo", images[0].file);
  //     } else if (singleImage?.length > 0) {
  //       formData.append("logo", singleImage);
  //     } else {
  //       formData.append("logo", ""); // Send empty string if no image
  //     }

  //     const response = await apiPut(url, formData, token)
  //     if (response) {
  //       setIsLoading(false);
  //       // reset();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit1 = async (data) => {

    console.log("Submitted Data:", data);

    try {
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}companies/update/${user.companyId}`;

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("country", country.label);
      formData.append("currencySymbol", currency.label);

      formData.append("industry", data.industry);
      formData.append("city", data.city);

      formData.append("isTaxable", data.isTaxable ? 1 : 0); // Ensure boolean is sent as 1 or 0
      formData.append("establishedDate", "2023-06-11");
      formData.append("roleLabels[0][roleId]", 4);
      formData.append("roleLabels[1][roleId]", 5);

      formData.append("roleLabels[0][label]", data.firstLabel);
      formData.append("roleLabels[1][label]", data.secondLabel);
      




      // fields.forEach((field, index) => {
      //   formData.append(
      //     `roleLabels[${index}][label]`,
      //     data.fields[index]?.company // Ensure the correct path
      //   );
      //   formData.append(
      //     `roleLabels[${index}][roleId]`,
      //     data.fields[index]?.role.value
      //   );
      // });

      // Handle Image Upload
      if (images.length > 0) {
        formData.append("logo", images[0].file);
      } else if (singleImage?.length > 0) {
        formData.append("logo", singleImage);
      } else {
        formData.append("logo", ""); // Send empty string if no image
      }

      const response = await apiPut(url, formData, token);
      if (response) {
        setIsLoading(false);
        // reset(); // Uncomment if you want to reset the form
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const addField = () => {
    setFields([...fields, { company: "", role: "" }]);
  };

  const getIndustries = async () => {
    try {
      // setIsLoading(true);
      const url = `${REACT_APP_API_URL}companies/industries`;
      const response = await apiGetPublic(url);
      setIndustry(response.data.payload);
      if (response.success) {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // console.log("panp",singleData)

  const getSingleCompany = async (id) => {
    // console.log("UOUO");

    try {
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}companies/${id}`;

      const params = {};
      const response = await apiGet(url, params, token);
      if (response.success) {
        setSingleData(response.data);
        setIsLoading(false);
        const companyData = response.data;

        const joinDateFormat = companyData.joinDate
          ? dayjs(companyData.joinDate).format("YYYY-MM-DD") // Format the date to 'YYYY-MM-DD'
          : ""; // Set to empty if no expiration is found

        const establishedDateFormat = companyData.establishedDate
          ? dayjs(companyData.establishedDate).format("YYYY-MM-DD") // Format the date to 'YYYY-MM-DD'
          : ""; // Set to empty if no expiration is found

        setValue("name", companyData.name || "");
        setValue("industry", companyData.industry || "");
        setValue("joinDate", joinDateFormat || "");
        setValue("establishedDate", establishedDateFormat || "");
        setValue("isTaxable", companyData.isTaxable ? 1 : 0); // Set the correct defauuuuuuuuuuuggggggggggle

        // Agar image bhi set karni hai
        if (companyData.logo) {
          setSingleImage([
            {
              file: null, // Original file backend se nahi aayegi
              preview: companyData.logo, // Logo ka URL
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching single company:", error);
    }
  };

  useEffect(() => {
    getIndustries();
    // if (id) {
    //   getSingleCompany(id); // Edit mode mein company details fetch kare
    // }
    // if (user?.companyId) {
    getSingleCompany(user?.companyId); // Edit mode mein company details fetch kare
    // }

    // console.log("yummmy",user)

    console.log("Single company id", user?.companyId);
  }, [user]);

  // {console.log("comp id yoyo",user?.companyId)}

  const handleImageUpload = (event) => {
    if (event.target.files.length === 0) return;
    const files = [...event.target.files];
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(newImages);
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setImages("");
    setSingleImage("");
    document.getElementById("fileInput").value = "";
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const cureencyOptions = [
    { value: "USD", label: "$" },
    { value: "EUR", label: "€" },
    { value: "GBP", label: "£" },
  ];

  const getRoles = async () => {
    // setUserLoading(true);
    try {
      // const url = `http://192.168.88.52:3000/api/auth/roles`;
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
          label: data.name,
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

  console.log("country single", country);

  useEffect(() => {
    setValue("name", singleData?.name);
    setValue("address", singleData?.address);
    setValue("city", singleData?.city);
    setCountry({
      label: singleData?.country,
    });

    setCurrency({
      label: singleData?.currencySymbol,
    });
    // setValue("country", singleData?.country);
    //   const defaultCountry = options.find(option => option.value === singleData?.country);
    // setValue("country", defaultCountry || null);

    // setValue("address", user.address);
    // setValue("city", user.city);
    // setValue("pushNotification", user.pushNotification);

    // setSingleImage(user.image);
  }, [singleData]);

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, []);

  document.title = "Billing Detail | PIFPerfect";
  return (
    <div className="page-content pt-0" id="billing-detail">
      <div>
        <div className="ctm-form pt-0 mt-0">
          <form onSubmit={handleSubmit(onSubmit1)}>
            {/* <h5>Payment History</h5> */}
            <div className="row">
              <h5>Personal Details</h5>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Company Name"
                  {...register("name")}
                />
              </div>
              {/* <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Billing Address"
                  {...register("billing_address")}
                />
              </div> */}

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Street"
                  {...register("address")}
                />
              </div>

              <div className="col-md-6">
                <Select
                  name="country"
                  options={options}
                  value={country}
                  onChange={changeHandler}
                />

                {/* <Controller
  name="country"
  control={control}
  defaultValue="country" // Set default value
  rules={{ required: "Country is required" }}
  render={({ field }) => (
    <Select
      {...field}
      options={options}
      value={options.find(option => option.value === field.value) || { label: country.label }} // Default selection
      onChange={(selectedOption) => field.onChange(selectedOption.label)}
      placeholder="Select your country"
    />
  )}
/> */}

                {/* <Controller
                  name="country"
                  control={control} // Use control from useForm()
                  rules={{ required: "Country is required" }} // Validation rules
                  render={({ field }) => (
                    <Select
                      {...field} // Spread field props (value and onChange)
                      options={options} // Provide options
                      value={options.find(
                        (option) => option.value === field.value
                      )} // Ensure the value matches the options
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.label)
                      } // Update the form state
                      placeholder="Select your country"
                    />
                  )}
                /> */}
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="City"
                  {...register("city")}
                />
              </div>
              <div className="col-md-6 ps-md-1">
                <select
                  className="form-select"
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  {...register("industry")}
                  value={null}
                  // disabled={id} // Disable select in edit mode
                >
                  <option value={""}>Select Industry</option>
                  {industry.map((indus) => (
                    <option value={indus.id} key={indus.id}>
                      {indus.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div className="col-md-6 ps-md-1">
                <div className="select-wrapper">
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
                        placeholder="Select your company timezone"
                      />
                    )}
                  />
                  {errors.timezone && (
                    <p className="error">{errors.timezone.message}</p>
                  )}
                </div>
              </div> */}

              <div className="col-md-6 ps-md-1">
                <div className="select-wrapper">
                  {/* <Select
                    options={cureencyOptions}
                    value={currency}
                    placeholder="Select Currency"
                    defaultValue={"$"}
                    onChange={(e) => setCurrency(e)}
                  /> */}
                  <Select
                    options={cureencyOptions}
                    value={currency || cureencyOptions[0]} // Set first option as default
                    placeholder="Select Currency"
                    onChange={(e) => setCurrency(e)}
                  />
                </div>
              </div>
            </div>
            {/* <hr className="ctm-hr" /> */}

            <hr className="ctm-hr" />
            <h5>Role Label Change</h5>

            {/* {fields.map((field, index) => (
              <div className="row mb-3" key={index}>
                <div className="col-md-5">
                  <Controller
                    name={`fields[${index}].role`} 
                    control={control}
                    defaultValue={null} 
                    render={({ field }) => (
                      <Select
                        {...field} 
                        className="basic-single"
                        classNamePrefix="select"
                        options={roles}
                        placeholder="Select Roles"
                        isClearable
                      />
                    )}
                  />
                </div>

                <div className="col-md-5">


                  <Controller
                    name={`fields[${index}].company`}
                    control={control} 
                    defaultValue={field.company || ""} 
                    render={({ field }) => (
                      <input
                        {...field} 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Company" 
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
            ))} */}

            {/* <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={addField}
              disabled={fields.length == companies.length}
            >
              +
            </button> */}

            <div className="row mb-3">
              {/* Left Side - Input Field */}
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Setter"
                  value="Setter"
                  // {...register("firstField")}
                  disabled
                />
              </div>

              {/* Right Side - Input Field */}
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Select Label"
                  {...register("firstLabel")}


                />
              </div>
            </div>

            <div className="row mb-3">
              {/* Left Side - Input Field */}
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Closer"
                  // {...register("secondField")}
                  value=""
                  disabled
                />
              </div>

              {/* Right Side - Input Field */}
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Label"
                  {...register("secondLabel")}
                />
              </div>
            </div>

            <button type="submit" className="custom_submit_btn mt-3">
              <ReactSVG src={refreshIcon} /> Submit
            </button>
          </form>

          {/* Payment UI that can be commented */}

          {/* <div className="row">
            <div className="col-12">
              <div className="payment-type">
                <h5 className="payment-label">Payment Type</h5>
                <div className="stripe-card">
                  <ReactSVG src={stripeIcon} />
                  <span onClick={() => setHide(!hide)}>
                    {!hide ? "**** **** **** 1234" : "1234 1234 1234 1234"}
                  </span>
                </div>
              </div>
            </div>
          </div> */}
          {/* <hr className="ctm-hr" /> */}
          {/* 
          <h5>Payment History</h5> */}

          {/* <hr className="ctm-hr" />
          <div className="card-detailing">
            <h6>Henry Carl</h6>
            <h5>Stripe</h5>
          </div> */}

          {/* <h5>Payment Plan</h5> */}

          {/* <div className="row">
            <div className="col-12">
              <div className="switch_custom">
                <div className="payment-history">
                  <h5 className="payment-history-label">Monthly Plan</h5>
                  <div className="stripe-payment-label">Yearly</div>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="row">
            <div className="col-12">
              <div className="switch_custom">
                <div className="payment-history">
                  <h5 className="payment-history-label">Next Billing Plan</h5>
                  <div className="stripe-payment-label position-relative">
                    {" "}
                    <span
                      className="text-muted small"
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "0.875rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {dayjs(startDate).format("YYYY,MMMM,DD ")}
                    </span>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        setIsTextArea(true);
                      }}
                      dateFormat="dd/MM/yyyy" 
                      locale="en-GB" 
                      placeholderText="dd/mm/yyyy" 
                      className="" 
                      customInput={
                        <button className="datepicker-icon-btn bg-transparent border-0">
                          <img src={CalendarPic} />
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="submit-btns">
            <button className="custom_submit_btn danger">
              <ReactSVG src={trashIcon} /> Cancel Subscription
            </button>
            <button className="custom_submit_btn">
              <ReactSVG src={refreshIcon} /> Choose Other Plan
            </button>
          </div> */}

          {/* Payment UI that can be commented */}
        </div>
      </div>
    </div>
  );
};

export default BillingDetail;
