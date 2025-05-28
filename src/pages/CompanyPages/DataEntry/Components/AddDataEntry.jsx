import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import leftArrow from "../../../../assets/newImages/arrow-left.svg";
import closeIcon from "../../../../assets/newImages/close-circle.svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import calenderIcon from "../../../../assets/newImages/calendar.svg";
import galleryUpload from "../../../../assets/newImages/gallery-export.svg";
import "./styles.scss";
import { Link, useParams } from "react-router-dom"; // Use useParams for retrieving id
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

  const [isLoading, setIsLoading] = useState(false);
  const [industry, setIndustry] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [images, setImages] = useState([]);
  const [singleImage, setSingleImage] = useState();

  const [singleCompany, setSingleCompany] = useState();

  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;

  // const formattedExpiration = dayjs(data.joinDate).toISOString();

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
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}companies/industries`;
      const response = await apiGetPublic(url);
      setIndustry(response.data.payload);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

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
        ? `${REACT_APP_API_URL}dailyMetrics/${id}`
        : `${REACT_APP_API_URL}dailyMetrics/add`;

      const formData = new FormData();

      // Append only the new fields
      if (data.value) formData.append("value", data.value);
      if (data.reason) formData.append("reason", data.reason);

      if (images.length > 0) {
        formData.append("logo", images[0].file);
      }

      const response = id
        ? await apiPut(url, formData, token)
        : await apiPost(url, formData, token);

      if (response.success) {
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
    document.getElementById("fileInput").value = "";
  };

  const getSingleCompany = async (id) => {
    try {
      // const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/companies/${id}`;
      const url = `${REACT_APP_API_URL}dailyMetrics/${id}`;

      const params = {};
      const response = await apiGet(url, params, token);
      if (response.success) {
        const companyData = response.data;
        // Form fields mein data set karein

        const joinDateFormat = companyData.joinDate
          ? dayjs(companyData.joinDate).format("YYYY-MM-DD") // Format the date to 'YYYY-MM-DD'
          : ""; // Set to empty if no expiration is found

        const establishedDateFormat = companyData.establishedDate
          ? dayjs(companyData.establishedDate).format("YYYY-MM-DD") // Format the date to 'YYYY-MM-DD'
          : ""; // Set to empty if no expiration is found

        setValue("value", companyData.value || "");
        setValue("reason", companyData.reason || "");
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

  return (
    <div className="page-content" id="add-company">
      <div className="custom-header-ctm">
        <Link to="/company/data-entry" className="no-underline">
          <h4 className="d-flex">
            <ReactSVG src={leftArrow} />{" "}
            <span>{id ? "Edit Data Entry" : "Add Data Entry"}</span>
          </h4>
        </Link>
      </div>
      <div className="ctm-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Value Field */}
            <div className="col-md-12">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Enter Value"
                  {...register("value")}
                  type="number"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Reason Field */}
            <div className="col-md-6">
              <textarea
                className="form-control"
                placeholder="Enter Reason"
                {...register("reason")}
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <hr className="ctm-hr" />

          <div className="submit-btns">
            <button className="custom_submit_btn">
              {id ? "Update Data Entry" : "Add Data Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCompany;
