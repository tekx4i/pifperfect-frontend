import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import leftArrow from "../../../../assets/newImages/arrow-left.svg";
import closeIcon from "../../../../assets/newImages/close-circle.svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import calenderIcon from "../../../../assets/newImages/calendar.svg";
import galleryUpload from "../../../../assets/newImages/gallery-export.svg";
import "./styles.scss";
import { Link, useParams, useNavigate } from "react-router-dom"; // Use useParams for retrieving id
import { useForm, Controller } from "react-hook-form";
import { FormGroup, Input } from "reactstrap";
import useAuth, {
  apiGet,
  apiGetPublic,
  apiPost,
  apiPut,
} from "../../../../CustomHooks/useAuth";
import dayjs from "dayjs";
import { IoCloseCircleSharp } from "react-icons/io5";

const AddNewCompany = () => {
  const { id } = useParams(); // Retrieve the id from the URL
  const [state, setState] = useState(true);
  const [estDate, setEstDate] = useState();
  const [joinDate, setJoinDate] = useState();
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [industry, setIndustry] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [images, setImages] = useState([]);
  const [singleImage, setSingleImage] = useState();

  const [singleCompany, setSingleCompany] = useState();

  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [subIndustries, setSubIndustries] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({});

  document.title = id
    ? "Edit Company | PIFPerfect"
    : "Add Company | PIFPerfect";

  const getIndustries = async () => {
    try {
      // setIsLoading(true);
      const url = `${REACT_APP_API_URL}industries?parent_id=null`;
      const response = await apiGet(url, {}, token);
      setIndustry(response.data.records);
      if (response.success) {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
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
    getIndustries();
  }, []);

  useEffect(() => {
    getSubIndustries(selectedIndustry);
  }, [selectedIndustry]);

  useEffect(() => {
    getIndustries();
    if (id) {
      // Fetch existing data to populate form fields when in edit mode
      getCompanyDetails();
      getSingleCompany(id); // Edit mode mein company details fetch kare
    }
  }, [id]);

  // useEffect(() => {
  //   if (id) {

  //     const formattedExpiration = getSingle.Expiration
  //       ? dayjs(getSingle.Expiration).format("YYYY-MM-DD") // Format the date to 'YYYY-MM-DD'
  //       : ''; // Set to empty if no expiration is found

  //     editSetValue("joinDate", formattedExpiration)
  //   }
  // }, [id]);

  const getCompanyDetails = async () => {
    try {
      const url = `${REACT_APP_API_URL}api/companies/${id}`;
      const response = await apiGet(url);

      if (response.success) {
        // Set the fetched data to form values
        const companyData = response.data.payload;

        const formattedExpiration = companyData.joinDate
          ? dayjs(companyData.joinDate).format("YYYY-MM-DD") // Format the date to 'YYYY-MM-DD'
          : ""; // Set to empty if no expiration is found

        // setValue("name", companyData.name);
        setValue("industry", companyData.industry);
        setValue("joinDate", companyData.joinDate);
        setValue("establishedDate", companyData.establishedDate);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const token = localStorage.getItem("token");

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
      formData.append("adminFirstName", data.adminFirstName);
      formData.append("adminLastName", data.adminLastName);
      formData.append("adminEmail", data.adminEmail);
      formData.append("adminEmail", data.adminEmail);
      formData.append("companyRoles", []);

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

  const getSingleCompany = async (id) => {
    try {
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}companies/${id}`;

      const params = {};
      const response = await apiGet(url, params, token);
      if (response.success) {
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

  if (isLoading) {
    setValue("name", "Loading...");
  }

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  return (
    <div className="page-content" id="add-company">
      <div className="custom-header-ctm ">
        <Link to="/company" className="no-underline">
          <h4 className="d-flex">
            <ReactSVG src={leftArrow} />{" "}
            <span>{id ? "Edit Company" : "Add New Company"}</span>
          </h4>
        </Link>
      </div>
      <div className="ctm-form ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {!id && (
            <>
              <h5 className="">Admin Details</h5>
              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    Admin First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    placeholder={id ? "" : "Admin First Name"}
                    {...register("adminFirstName")}
                    // disabled={id} // Disable field in edit mode
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    Admin Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    placeholder={id ? "" : "Admin Last Name"}
                    {...register("adminLastName")}
                    // disabled={id} // Disable field in edit mode
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                <label className="form-label fw-bold">
                  Admin Email <span className="text-danger">*</span>
                </label>
                  <input
                    className="form-control"
                    placeholder={id ? "" : "Admin Email"}
                    {...register("adminEmail")}
                    // disabled={id} // Disable field in edit mode
                  />
                </div>
              </div>
            </>
          )}

          <hr className="ctm-hr" />
          <h5>Personal Details</h5>
          <div className="row p-0 m-0">
            <div className="col-md-6">
              <input
                className="form-control "
                style={{ height: "57px" }}
                placeholder={id ? "" : "Company name"}
                {...register("name")}
                // disabled={id} // Disable field in edit mode
              />
            </div>

            <div className="col-md-6">
              <div className="companyselect_input">
                <select
                  className="form-select"
                  id="industrySelect"
                  style={{ height: "57px" }}
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
                <label style={{ fontSize: "12px" }} htmlFor="floatingSelect">
                  Select Roles
                </label>
              </div>
            </div>
          </div>
          <div className="row p-0 m-0">
            <div className="col-md-6 mt-2">
              <div className="companyselect_input">
                <select
                  className="form-select "
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
                <label htmlFor="subIndustrySelect" style={{ fontSize: "12px" }}>
                  Sub Industries
                </label>
              </div>
            </div>
          </div>
          <hr className="ctm-hr" />
          <h5>Is Your Company Taxable?</h5>
          <div className="row">
            <div className="col-md-12">
              <div className="switch_custom">
                <p>
                  Yes we operate under the government institution act of yearly
                  tax paying
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
          </div>
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
                type="date"
                {...register("joinDate")}
              />
              {/* )} */}
            </div>
            {/* <div className="col-md-6">
              <h5>Established Date</h5>

              <input
                className="form-control"
                type="date"
                {...register("establishedDate")}
              />
            </div> */}
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
              {id && Array.isArray(singleImage) && singleImage.length > 0 && (
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

          <div className="submit-btns">
            <button className="custom_submit_btn">
              <ReactSVG src={refreshIcon} />
              {id ? "Update Company" : "Add Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCompany;
