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
import useAuth, { apiGet, apiGetPublic, apiPost, apiPut } from "../../../../CustomHooks/useAuth";
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
    const [singleImage, setSingleImage] = useState()
    const [user, setUser] = useState({});
    const [singleCompany, setSingleCompany] = useState();
    const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env

    // const formattedExpiration = dayjs(data.joinDate).toISOString();

    const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm({
    });

    document.title = id ? "Edit Company | PIFPerfect" : "Add Company | PIFPerfect";

    // const getIndustries = async () => {
    //     try {
    //         setIsLoading(true);
    //         const url = `${REACT_APP_API_URL}companies/industries`;
    //         const response = await apiGetPublic(url);
    //         setIndustry(response.data.payload);
    //         setIsLoading(false);
    //     } catch (error) {
    //         console.log(error);
    //         setIsLoading(false);
    //     }
    // };

    useEffect(() => {
        // getIndustries();
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
                    : ''; // Set to empty if no expiration is found


                // setValue("name", companyData.name);
                setValue("industry", companyData.industry);
                setValue("joinDate", companyData.joinDate);
                setValue("establishedDate", companyData.establishedDate);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // Get user info from local storage
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Parse the JSON string
        }
    }, []);

    const token = localStorage.getItem("token")

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const url = id
                ? `${REACT_APP_API_URL}users/${id}`
                : `${REACT_APP_API_URL}users`;

            // const formattedExpiration = dayjs(data.expiration).toISOString();

            const formData = new FormData();
            formData.append("firstName", data.first_name);
            formData.append("lastName", data.last_name);
            formData.append("email", data.email);
            formData.append("address", data.address);
            formData.append("role", 4);
            formData.append("companyId", user.companyId)
            formData.append("phone", data.phone)




            if (images.length > 0) {
                formData.append("image", images[0].file);
            }

            const response = await id ? apiPut(url, formData, token) : apiPost(url, formData, token);
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
        setSingleImage("")
        document.getElementById("fileInput").value = "";
    };


    const getSingleCompany = async (id) => {
        try {
            // const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/companies/${id}`;
            const url = `${REACT_APP_API_URL}users/${id}`;

            const params = {}
            const response = await apiGet(url, params, token);
            if (response.success) {
                const companyData = response.data;
                // Form fields mein data set karein


                setValue("first_name", companyData.firstName || "");
                setValue("last_name", companyData.lastName || "");
                setValue("email", companyData.email || "");
                setValue("address", companyData.address || "");
                setValue("isTaxable", companyData.isTaxable ? 1 : 0); // Set the correct defauuuuuuuuuuuggggggggggle
                setValue("phone", companyData.phone); // Set the correct defauuuuuuuuuuuggggggggggle



                // Agar image bhi set karni hai
                if (companyData.image) {
                    setSingleImage([
                        {
                            file: null, // Original file backend se nahi aayegi
                            preview: companyData.image, // Logo ka URL
                        },
                    ]);
                }
            }
        } catch (error) {
            console.error("Error fetching single company:", error);
        } finally {
        }
    };


    return (
        <div className="page-content" id="add-company">
            <div className="custom-header-ctm">
                <Link to="/sales-manager/team">
                    <h4 className="d-flex">
                        <ReactSVG src={leftArrow} /> <span>{id ? "Edit Sales Team" : "Add New Sales Team"}</span>
                    </h4>
                </Link>
            </div>
            <div className="ctm-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h5>Personal Details</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                placeholder="First Name"
                                {...register("first_name")}
                            // disabled={id} // Disable field in edit mode
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                className="form-control"
                                placeholder="Last Name"
                                {...register("last_name")}
                            // disabled={id} // Disable field in edit mode
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                className="form-control"
                                placeholder="Phone"
                                {...register("phone")}
                            // disabled={id} // Disable field in edit mode
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                className="form-control"
                                placeholder="Email"
                                {...register("email")}
                            // disabled={id} // Disable field in edit mode
                            />
                        </div>

                        <hr className="ctm-hr" />

                        <h5>Residential Data</h5>


                        <div className="col-md-12">
                            <input
                                className="form-control"
                                placeholder="Address"
                                {...register("address")}
                            // disabled={id} // Disable field in edit mode
                            />
                        </div>

                        <hr className="ctm-hr" />


                    </div>


                    <h5>Sales Manager Logo / Profile Image</h5>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="file_upload">
                                <ReactSVG src={galleryUpload} />
                                <p>
                                    <strong>Upload </strong>or Drop an Image
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
                    {Array.isArray(images) && images.length > 0 ? (
                        <div className="image-preview flex-column d-flex col-md-3" style={{ position: "relative" }}>
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
                    ) : (
                        <div className="image-preview flex-column d-flex col-md-3" style={{ position: "relative" }}>
                            {id && Array.isArray(singleImage) && singleImage.length > 0 && (
                                <>
                                    <img
                                        src={`${REACT_APP_API_IMG_URL}${singleImage[0].preview}`} // Show the default image only if ID exists
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
                                </>

                            )}
                        </div>
                    )}


                    <div className="submit-btns">
                        <button className="custom_submit_btn">{id ? "Update Company" : "Add Company"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewCompany;
