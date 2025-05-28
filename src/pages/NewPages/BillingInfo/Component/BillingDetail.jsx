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
import "./styles.scss";
import { Link } from "react-router-dom";
import { FormGroup, Input } from "reactstrap";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom"; // Use useParams for retrieving id
import { apiGet, apiGetPublic } from "../../../../CustomHooks/useAuth";
import { IoCloseCircleSharp } from "react-icons/io5";

const BillingDetail = () => {
  const { id } = useParams(); // Retrieve the id from the URL

  const options = useMemo(() => countryList().getData(), []);
  const [country, setCountry] = useState("");
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
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [singleData, setSingleData] = useState();
  const [subIndustries, setSubIndustries] = useState([]);

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
    setCities([]); // Reset cities when country changes
    setValue("city", ""); // Reset city field when country changes
  };

  const cureencyOptions = [
    { value: "USD", label: "$ (USD)" },
    { value: "EUR", label: "€ (EUR)" },
    { value: "GBP", label: "£ (GBP)" },
  ];

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

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const url = id
        ? `${REACT_APP_API_URL}companies/update/${id}`
        : `${REACT_APP_API_URL}companies/add`;

      // const formattedExpiration = dayjs(data.expiration).toISOString();

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("industry", data.industry);
      // formData.append("isTaxable", data.isTaxable);
      formData.append("isTaxable", data.isTaxable ? 1 : 0); // Default to 0 if undefined

      formData.append("joinDate", data.joinDate);
      formData.append("establishedDate", data.establishedDate);

      // if (images.length > 0) {
      //   formData.append("logo", images[0].file);
      // }

      if (images.length > 0) {
        formData.append("logo", images[0].file);
      } else if (singleImage?.length > 0) {
        formData.append("logo", singleImage);
      } else {
        formData.append("logo", ""); // Send empty string if no image
      }

      const response = (await id)
        ? apiPut(url, formData, token)
        : apiPost(url, formData, token);
      if (response) {
        setIsLoading(false);
        reset();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
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

  const getSingleCompany = async (id) => {
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
    if (id) {
      // Fetch existing data to populate form fields when in edit mode
      // getCompanyDetails();
      getSingleCompany(id); // Edit mode mein company details fetch kare
    }
  }, [id]);

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

  const getSubIndustries = async (id) => {
    try {
      const url = `${REACT_APP_API_URL}industries/${id}/sub-industries`;
      const response = await apiGet(url, {}, token);
      setSubIndustries(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubIndustries(selectedIndustry);
  }, [selectedIndustry]);

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

  document.title = "Billing Detail | PIFPerfect";
  return (
    <div className="page-content" id="billing-detail">
      <div>
        {/* <BreadCrumb title="Orders" pageTitle="Ecommerce" /> */}
        <div className="custom-header-ctm">
          <Link to="/billing">
            <h4 className="d-flex">
              <ReactSVG src={leftArrow} />{" "}
              <span>ScalesUpliftok Billing Information</span>
            </h4>
          </Link>
        </div>
        <div className="ctm-form pt-0 mt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h5>Payment History</h5>
            <div className="row">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="First Name"
                  {...register("first_name")}
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Last Name"
                  {...register("last_name")}
                />
              </div>

              <h5>Personal Details</h5>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Company Name"
                  {...register("name")}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Billing Email"
                  {...register("email")}
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Street"
                  {...register("address")}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  type="number"
                  placeholder="Zip Code"
                  {...register("zipcode")}
                />
              </div>

              <div className="col-md-6">
                <Select
                  options={options}
                  value={country}
                  onChange={changeHandler}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="City"
                  {...register("city")}
                />
              </div>
              {/* <div className="col-md-6 ps-md-1">
                <select
                  className="form-select"
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  {...register("industry")}
                  value={null}
                  // disabled={id} // Disable select in edit mode
                >
                  <option value={""}>Select Inustry</option>
                  {industry.map((indus) => (
                    <option value={indus.id} key={indus.id}>
                      {indus.name}
                    </option>
                  ))}
                </select>
              </div> */}

              <div className="col-md-6">
                <div className="select-wrapper">
                  <Select
                    options={cureencyOptions}
                    placeholder="Select Currency"
                    defaultValue={"$"}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div
                  className="companyselect_input"
                  style={{ position: "relative" }}
                >
                  <select
                    className="form-select pt-3"
                    id="industrySelect"
                    aria-label="Floating label select for industry"
                    {...register("industry", {
                      onChange: (e) => setSelectedIndustry(e.target.value),
                    })}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Industry
                    </option>
                    {industry.map((indus) => (
                      <option value={indus.id} key={indus.id}>
                        {indus.name}
                      </option>
                    ))}
                  </select>
                  <label
                    style={{
                      fontSize: "12px",
                      position: "absolute",
                      top: "-7px",
                      left: "12px",
                      backgroundColor: "#FFFFFF",
                      paddingLeft: "6px",
                      paddingRight: "6px",
                    }}
                    htmlFor="floatingSelect"
                  >
                    Select Roles
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <div
                  className="companyselect_input"
                  style={{ position: "relative" }}
                >
                  <select
                    className="form-select pt-3"
                    id="subIndustrySelect"
                    aria-label="Floating label select for sub industries"
                    defaultValue=""
                    {...register("sub_industry")}
                  >
                    <option value="">Select Sub Industries</option>
                    {subIndustries?.map((indus) => (
                      <option value={indus.id} key={indus.id}>
                        {indus.name}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="subIndustrySelect"
                    style={{
                      fontSize: "12px",
                      position: "absolute",
                      top: "-7px",
                      left: "12px",
                      backgroundColor: "#FFFFFF",
                      paddingLeft: "6px",
                      paddingRight: "6px",
                    }}
                  >
                    Sub Industries
                  </label>
                </div>
              </div>
            </div>
            {/* <hr className="ctm-hr" /> */}

            <div className="page-content p-0 m-0">
              <div>
                {/* <BreadCrumb title="Orders" pageTitle="Ecommerce" /> */}
                <div className="custom-header-ctm ps-0">
                  <Link to="/billing">
                    <h4 className="d-flex">
                      <ReactSVG src={leftArrow} />{" "}
                      <span>{singleData?.name}</span>
                    </h4>
                  </Link>
                </div>
                <div className="ctm-form ps-0 mt-0">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* {!id && (
                      <>
                        <h5 className="">Admin Details</h5>
                        <div className="row">
                          <div className="col-md-6">
                            <input
                              className="form-control"
                              placeholder={id ? "" : "Admin First Name"}
                              {...register("adminFirstName")}
                              // disabled={id} // Disable field in edit mode
                            />
                          </div>
                          <div className="col-md-6 ps-md-1">
                            <input
                              className="form-control"
                              placeholder={id ? "" : "Admin Last Name"}
                              {...register("adminLastName")}
                              // disabled={id} // Disable field in edit mode
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 ps-md-1 ms-2 ">
                            <input
                              className="form-control"
                              placeholder={id ? "" : "Admin Email"}
                              {...register("adminEmail")}
                              // disabled={id} // Disable field in edit mode
                            />
                          </div>
                        </div>
                      </>
                    )} */}

                    {/* <hr className="ctm-hr" /> */}
                    {/* <h5>Is Your Company Taxable?</h5>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="switch_custom">
                          <p>
                            Yes we operate under the government institution act
                            of yearly tax paying
                          </p>
                          <div className="switch">
                            <FormGroup switch>
                              <Controller
                                name="isTaxable"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="switch"
                                    checked={field.value}
                                    onChange={(e) =>
                                      field.onChange(e.target.checked ? 1 : 0)
                                    }
                                  />
                                )}
                              />
                            </FormGroup>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <hr className="ctm-hr" />
                    <div className="row">
                      <div className="col-md-6">
                        <h5>Date Joined</h5>
                        {/* {!joinDate ? ( */}
                        {/* <button className="date_ctm" onClick={() => setJoinDate(true)}> */}
                        {/* <p>12/2/2024</p> */}
                        {/* <ReactSVG src={calenderIcon} /> */}
                        {/* </button> */}
                        {/* ) : ( */}
                        <input
                          className="form-control"
                          disabled
                          type="date"
                          {...register("joinDate")}
                        />
                        {/* )} */}
                      </div>
                    </div>
                    <hr className="ctm-hr" />
                    <h5>Company Logo / Profile Image</h5>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="file_upload">
                          <ReactSVG src={galleryUpload} />
                          <p>
                            <strong>Upload </strong>or Drop Company Logo
                          </p>
                          <input
                            type="file"
                            id="fileInput"
                            onChange={handleImageUpload}
                            accept="image/*"
                            // disabled={id} // Disable file upload in edit mode
                          />
                        </div>
                      </div>
                    </div>
                    {/* {Array.isArray(images) && images.length > 0 ? (
            <div className="image-preview flex-column d-flex col-md-3 " style={{ position: "relative" }}>
              <img
                src={images[0].preview} // Show the preview of the first uploaded image
                alt="Uploaded Preview"
                className="uploaded-image"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <button
                type="button"
                className="btn text-danger p-0"
                onClick={handleRemoveImage}
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px", // Position to the right corner
                  background: "transparent", // Optional: Transparent button background
                  border: "none", // Optional: Remove border for cleaner look
                }}
              >
                <IoCloseCircleSharp size={22} />

              </button>
            </div>
          )

            : (
              <div className="image-preview flex-column d-flex col-md-3" style={{ position: "relative" }}>
                {id && Array.isArray(singleImage) && singleImage.length > 0 && (
                  <>
                    <img
                      src={`${REACT_APP_API_IMG_URL}${singleImage[0].preview}`}
                      alt="Uploaded Preview"
                      className="uploaded-image"
                      x style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <button
                      type="button"
                      className="btn text-danger text-xl p-0"
                      onClick={handleRemoveImage}
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px", // Position to the right corner
                        background: "transparent", // Optional: Transparent button background
                        border: "none", // Optional: Remove border for cleaner look
                      }}
                    >
                      <IoCloseCircleSharp size={22} />
                    </button>
                  </>
                )}
              </div>

            )
          } */}

                    {Array.isArray(images) && images.length > 0 ? (
                      <div
                        className="image-preview flex-column d-flex col-md-3"
                        style={{ position: "relative" }}
                      >
                        <img
                          src={images[0].preview} // Show the preview of the first uploaded image
                          alt="Uploaded Preview"
                          className="uploaded-image"
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageClick(images[0].preview)} // Open modal on click
                        />
                        <button
                          type="button"
                          className="btn text-danger p-0"
                          onClick={handleRemoveImage}
                          style={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            background: "transparent",
                            border: "none",
                          }}
                        >
                          <IoCloseCircleSharp size={22} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="image-preview flex-column d-flex col-md-3"
                        style={{ position: "relative" }}
                      >
                        {id &&
                          Array.isArray(singleImage) &&
                          singleImage.length > 0 && (
                            <>
                              <img
                                src={`${REACT_APP_API_IMG_URL}${singleImage[0].preview}`}
                                alt="Uploaded Preview"
                                className="uploaded-image"
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleImageClick(
                                    `${REACT_APP_API_IMG_URL}${singleImage[0].preview}`
                                  )
                                } // Open modal on click
                              />
                              <button
                                type="button"
                                className="btn text-danger text-xl p-0"
                                onClick={handleRemoveImage}
                                style={{
                                  position: "absolute",
                                  top: "0px",
                                  right: "0px",
                                  background: "transparent",
                                  border: "none",
                                }}
                              >
                                <IoCloseCircleSharp size={22} />
                              </button>
                            </>
                          )}
                      </div>
                    )}

                    {/* Modal for Image Preview */}
                    {selectedImage && (
                      <div
                        className="image-modal"
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          // background: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 1000,
                        }}
                      >
                        <div
                          className="modal-content"
                          style={{
                            background: "#fff",
                            borderRadius: "10px",
                            padding: "20px",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            width: "50%", // Modal box width
                            height: "50%", // Modal box height
                          }}
                        >
                          <button
                            type="button"
                            onClick={handleClosePreview}
                            style={{
                              position: "absolute",
                              top: "-16px",
                              right: "-12px",
                              background: "red",
                              border: "none",
                              color: "#fff",
                              fontSize: "18px",
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              cursor: "pointer",
                            }}
                          >
                            ✖
                          </button>
                          <img
                            src={selectedImage}
                            alt="Full Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* <div className="submit-btns">
                      <button type="submit" className="custom_submit_btn">
                        <ReactSVG src={refreshIcon} />
                        {id ? "Update Company" : "Add Company"}
                      </button>
                    </div> */}
                  </form>

                  <hr className="ctm-hr mt-5" />
                </div>
              </div>
            </div>

            {/* -------- */}
            <div className="row">
              <div className="col-md-12">
                <div className="switch_custom">
                  <h5 className="mb-0 align-self-center">
                    Is Your Company Taxable?
                  </h5>
                  <div className="switch">
                    <FormGroup switch>
                      <Input
                        type="switch"
                        // checked={state}
                        checked={country.label == "Canada" ? true : false}
                        onClick={() => {
                          setState(!state);
                        }}
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
            <hr className="ctm-hr" />
            <div className="row">
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
            </div>
            <hr className="ctm-hr" />

            <h5>Payment History</h5>
            <div className="row">
              <div className="col-12">
                <div className="switch_custom">
                  <div className="payment-history">
                    <h5 className="payment-history-label">
                      Monthly Plan Purchased
                    </h5>
                    <div className="stripe-payment-label">$78 / month</div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="ctm-hr" />
            <div className="card-detailing">
              <h6>Henry Carl</h6>
              {/* <h5 onClick={() => setHide(!hide)}>{!hide ? "**** **** **** 1234" : "1234 1234 1234 1234"}</h5> */}
              <h5>Stripe</h5>
            </div>

            {/* <div className="card-detailing">
              <h6>
                <ReactSVG src={checkIcon} /> Auto Renewal Period
              </h6>

              <h5>11/10/2024</h5>

            </div> */}
            <h5>Renewal Period</h5>

            {/* <h6>Select Renewal Date</h6> */}

            <DatePicker
              selected={startDate}
              className="form-control w-100"
              onChange={(date) => {
                setStartDate(date);
                setIsTextArea(true);
              }}
              dateFormat="dd/MM/yyyy" // Set the date format here
              locale="en-GB" // Use the registered UK locale
              placeholderText="dd/mm/yyyy" // Placeholder text
            />

            {IstextArea && (
              <div class="form-group">
                <label for="exampleTextarea">Reason</label>
                <textarea
                  class="form-control"
                  id="exampleTextarea"
                  rows="5"
                  placeholder="Enter your message here"
                ></textarea>
              </div>
            )}

            {/* <h5 className="subscription-management">Subscription Management</h5> */}
            <div className="submit-btns">
              <button className="custom_submit_btn danger">
                <ReactSVG src={trashIcon} /> Cancel Subscription
              </button>
              <button className="custom_submit_btn">
                <ReactSVG src={refreshIcon} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillingDetail;
