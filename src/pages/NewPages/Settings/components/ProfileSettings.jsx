import React, { useState, useEffect, useMemo } from "react";
import { ReactSVG } from "react-svg";
import galleryUpload from "../../../../assets/newImages/gallery-export.svg";
import { useForm } from "react-hook-form";
import useAuth, { apiPost } from "../../../../CustomHooks/useAuth";
import Select from "react-select";
import countryList from "react-select-country-list";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FormGroup, Input } from "reactstrap";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./style.scss";
import TimezoneSelect from "react-timezone-select";
import lockIcon from "../../../../assets/newImages/lock.svg";
import authenticateUser from "../../../../assets/newImages/security-user.png";
import swal from "sweetalert";
// import { Controller } from "react-hook-form"; // Import Controller from react-hook-form

const ProfileSettings = () => {
  // { getCities, cities, setCities, country, setCountry, isLoading, setIsLoading, register, handleSubmit, setValue, reset }
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState({});
  // const [selectedTimezone2, setSelectedTimezone2] = useState({
  //   value: "Europe/Amsterdam",
  // });

  // const { handleSubmit, setValue, control } = useForm();

  // const [user, setUser] = useState()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    handleSubmit: handleSubmit2,
    control,
  } = useForm();

  const [user, setUser] = useState({});

  // const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [singleImage, setSingleImage] = useState();
  const options = useMemo(() => countryList().getData(), []);
  const token = localStorage.getItem("token");
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  // const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("userInfo");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  const onSubmit = async (data) => {
    if (!country) {
      // Custom check if country isn't integrated properly with react-hook-form
      swal("Error!", "Country selection is required", "error");
      return;
    }
    try {
      // setIsLoading(true);
      const url = `${REACT_APP_API_URL}auth/changePassword`;

      // const formData = new FormData();
      // formData.append("oldPassword", data.oldPassword);
      // formData.append("newPassword", data.newPassword);
      // formData.append("retypePassword", data.newPasswordConfirm);

      const params = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        retypePassword: data.newPasswordConfirm,
      };

      const response = await apiPost(url, params, token);
      if (response.success) {
        // setIsLoading(false);
        reset();
      }
    } catch (error) {
      console.log(error);
      // setIsLoading(false);
    }
  };

  const getCities = async () => {
    try {
      setIsLoading(true);
      // const url = `https://countriesnow.space/api/v0.1/countries/cities`;
      const url = `https://countriesnow.space/api/v0.1/countries/states`;

      const params = { country: country.label };
      const response = await apiPost(url, params);
      setCities(response.data.states);
      setIsLoading(false);
      // Pre-select the first city after cities are loaded
      if (response.data?.length > 0) {
        setValue("city", response.data[0]);
      }
    } catch (error) {
      console.log(error);
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

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("userInfo");
  //   if (storedUser) {
  //     const parsedUser = JSON.parse(storedUser);
  //     setUser(parsedUser);

  //     // If the user already has an image, set it in the images state
  //     // if (parsedUser.image) {
  //     //   setImages([
  //     //     {
  //     //       file: null, // No file object available for the existing image
  //     //       preview: `${REACT_APP_API_IMG_URL}${parsedUser.image}`, // Use the API URL for the image
  //     //     },
  //     //   ]);
  //     // }
  //   }
  // }, []);

  useEffect(() => {
    const storedCountry = JSON.parse(localStorage.getItem("userInfo"));

    if (storedCountry.country) {
      const countryOption = options.find(
        (option) => option.label === storedCountry.country
      );
      if (countryOption) {
        setCountry(countryOption);
      }
    }
  }, [options]);

  useEffect(() => {
    const storedCity = JSON.parse(localStorage.getItem("userInfo"))?.city;

    if (storedCity && cities?.length > 0) {
      const isCityValid = cities.includes(storedCity); // Check if city exists in the fetched list
      if (isCityValid) {
        setValue("city", storedCity);
      }
    }
  }, [cities, setValue]);

  const changeHandler = (value) => {
    setCountry(value);
    setCities([]); // Reset cities when country changes
    setValue("city", ""); // Reset city field when country changes
  };

  useEffect(() => {
    setValue("first_name", user.firstName);
    setValue("last_name", user.lastName);
    setValue("email", user.email);
    setValue("phone", user.phone);
    setValue("zipcode", user.zipCode);
    setValue("phone", user.phone);
    // setValue("address", user.address);
    setValue("city", user.city);
    setValue("pushNotification", user.pushNotification);

    setSelectedTimezone({
      value: user.timezone,
    });

    setSingleImage(user.image);
  }, [user]);

  useEffect(() => {
    if (country) {
      getCities();
    }
  }, [country]);

  const handleImageUpload = (event) => {
    if (event.target.files.length === 0) return;
    const files = [...event.target.files];
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(newImages);
    setSingleImage("");
    event.target.value = "";
  };

  const editUser = async (data) => {
    console.log("ppppp", data);
    if (!data.timezone) {
      swal("Error!", "Timezone is required", "error");
      return;
    }

    try {
      const url = `${REACT_APP_API_URL}users/${user.id}`;

      const formData = new FormData();

      formData.append("firstName", data.first_name);
      formData.append("lastName", data.last_name);
      formData.append("phone", data.phone);
      // formData.append("address", data.address);
      formData.append("country", country.label);
      formData.append("city", data.city);
      formData.append("zipCode", 1);
      formData.append(
        "pushNotification",
        data.pushNotification == 1 ? true : false
      );
      formData.append("timezone", data.timezone.value);
      formData.append("oldPassword", data.oldPassword);
      formData.append("newPassword", data.newPassword);
      formData.append("retypePassword", data.newPasswordConfirm);

      // if (images.length > 0) {
      //   formData.append("image", images[0].file);
      // }

      if (images.length > 0) {
        formData.append("image", images[0].file);
      } else if (singleImage?.length > 0) {
        formData.append("image", singleImage);
      } else {
        formData.append("image", ""); // Empty image in payload
      }

      const response = await useAuth.apiPut(
        url,
        formData,
        localStorage.getItem("token")
      );
      if (response.success) {
        const updatedUser = {
          ...user,
          firstName: data.first_name,
          lastName: data.last_name,
          // email: data.email,
          phone: data.phone,
          // address: data.address,
          country: country.label,
          city: data.city,
          zipCode: data.zipcode,
          pushNotification: data.pushNotification,
          timezone: data.timezone.value,
          // image: images.length > 0 && images[0]?.file
          //   ? `${REACT_APP_API_IMG_URL}${response.payload.image}` // Use API response
          //   : user.image,
          image:
            images?.length > 0
              ? `${response.payload.image}` // Use uploaded image
              : singleImage?.length > 0
              ? singleImage // Retain existing image if no new upload
              : "", // Set image to empty if no image
        };

        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const [selectedImage, setSelectedImage] = useState(null); // For preview

  const handleImageClick = (image) => {
    setSelectedImage(image); // Set selected image for preview
  };

  const handleClosePreview = () => {
    setSelectedImage(null); // Close preview
  };

  useEffect(() => {
    if (!isLoading && Array.isArray(cities)) {
      setValue("city", user.city);
    }
  }, [user, cities, isLoading, setValue]);

  useEffect(() => {
    if (user?.timezone) {
      setValue("timezone", { value: user.timezone });
    }
  }, [user, setValue]); // Add setValue in dependency array

  return (
    <div className="profile-settings">
      <form onSubmit={handleSubmit(editUser)}>
        <h5>Personal Details</h5>
        <div className="row">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="First Name"
              {...register("first_name", {
                required: "First name is required",
              })}
            />
            {errors.first_name && (
              <p className="error">{errors.first_name.message}</p>
            )}
          </div>
          <div className="col-md-6 ps-md-1">
            <input
              className="form-control"
              placeholder="Last Name"
              defaultValue={user.lastName}
              {...register("last_name", { required: " Last name is required" })}
            />
            {errors.last_name && (
              <p className="error">{errors.last_name.message}</p>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <input
              type="email"
              className="form-control"
              disabled
              placeholder="Email Address"
              {...register("email", {
                required: "Email name is required",
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          {/* <div className="col-md-6 ps-md-1">
            <PhoneInput
              country={'us'}
              value={this.state.phone}
              onChange={phone => this.setState({ phone })}
            />
          </div> */}
          <div className="col-md-6 ps-md-1">
            <Controller
              name="phone" // Name of the field
              control={control} // Pass the control from useForm
              defaultValue={user.phone} // Default value for the input (optional)
              rules={{ required: "Phone number is required" }} // Validation rule (e.g., required)
              render={({ field, fieldState }) => (
                <>
                  <PhoneInput
                    className="phone-input"
                    country={"us"}
                    style={{
                      textIndent: "50px", // Moves the text inside the input 10px to the right
                      paddingLeft: "10px", // Alternatively, you can use paddingLeft
                    }}
                    onChange={(value) => field.onChange(value)} // Update form state on change
                    {...field} // Spread field props (e.g., ref)
                  />
                  {/* Optionally, display error messages */}
                  {/* {fieldState?.error && <p className="text-danger">{fieldState.error.message}</p>} */}
                </>
              )}
            />
            {/* Optionally, display error messages */}
            {/* {fieldState?.error && <p className="text-danger">{fieldState.error.message}</p>} */}
          </div>
        </div>

        {/* <div className="row">
          <div className="col-md-6">
            <input
              type="number"
              className="form-control"
              placeholder="Zip Code"
              {...register("zipcode", {
                required: "Zip Code is required",
              })}
            />
            {errors.zipcode && (
              <p className="error">{errors.zipcode.message}</p>
            )}
          </div>
        </div> */}

        <hr className="ctm-hr" />

        <h5>Location Details</h5>
        <div className="row">
          <div className="col-md-6">
            <Select
              options={options}
              value={country}
              defaultValue={"us"}
              onChange={changeHandler}
              placeholder="Select Your Country"
            />
          </div>

          <div className="col-md-6 ps-md-1">
            <select
              className="form-select"
              {...register("city", {
                required: "City name is required",
              })}
            >
              <option>Select States</option>

              {isLoading ? (
                <option>Loading...</option>
              ) : // cities.map((city, index) => (
              //   <option key={index} value={city}>
              //     {city}
              //   </option>
              // ))

              Array.isArray(cities) ? (
                cities.map((city, index) => (
                  <option key={index} value={city.name}>
                    {city.name}
                  </option>
                ))
              ) : (
                <option>Invalid cities data</option>
              )}
            </select>
            {errors.city && <p className="error">{errors.city.message}</p>}
          </div>

          <div className="col-md-6">
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
                    placeholder="Select Timezone"
                  />
                )}
              />
              {errors.timezone && (
                <p className="error">{errors.timezone.message}</p>
              )}
            </div>
          </div>
        </div>

        <hr className="ctm-hr" />

        <h5>Push Notifications</h5>
        <div className="row">
          <div className="col-md-12">
            <div className="switch_custom">
              <p>
                Allow to receive push notifications for user activities and logs
                count
              </p>
              <div className="switch">
                <FormGroup switch>
                  <Controller
                    name="pushNotification"
                    control={control}
                    defaultValue={0} // Default to 0 initially
                    render={({ field }) => (
                      <Input
                        type="switch"
                        checked={!!field.value} // Ensure boolean value for the switch
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

        {user.role == 2 && (
          <div className="account-settings mt-5">
            <form onSubmit={handleSubmit2(onSubmit)}>
              <h5>Change Password</h5>
              <div className="row">
                <div className="col-md-6 position-relative">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Old Password"
                    {...register("oldPassword")}
                  />
                  <div className="input-icon">
                    <ReactSVG src={lockIcon} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 position-relative">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter New Password"
                    {...register("password")}
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
                </div>
              </div>
              <hr className="ctm-hr" />
              {/* <div className="authenticate_now mb-4">
                <h4>2 Factor Authentication (2FA)</h4>
                <button className="custom_submit_btn primary">
                  <img src={authenticateUser} /> <span>Authenticate Now</span>
                </button>
              </div> */}
              {/* <div className="submit-btns">
              <button type="submit" className="custom_submit_btn">
                <ReactSVG src={refreshIcon} /> Save Changes
              </button>
            </div> */}
            </form>
            {/* <hr className="ctm-hr" /> */}
          </div>
        )}

        {/* <hr className="ctm-hr" /> */}

        <h5>Upload Profile Image</h5>
        <div className="row">
          <div className="col-md-12">
            <div className="file_upload ">
              <ReactSVG src={galleryUpload} />
              <p>
                <strong>Upload </strong>or Drop an Image
              </p>
              <input
                type="file"
                id="fileInput"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
          </div>
        </div>

        {singleImage?.length > 0 && images.length === 0 ? (
          <div
            className="image-preview flex-column d-flex col-md-3"
            style={{ position: "relative" }}
          >
            <img
              src={`${process.env.REACT_APP_API_IMG_URL}${singleImage}`}
              alt="Uploaded Preview2"
              className="uploaded-image"
              onClick={() =>
                handleImageClick(
                  `${process.env.REACT_APP_API_IMG_URL}${singleImage}`
                )
              }
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
                cursor: "pointer", // Indicate it's clickable
              }}
            />
            <button
              type="button"
              className="btn text-danger p-0"
              onClick={() => {
                setImages([]);
                setSingleImage([]);
              }}
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
            {images.length > 0 && (
              <div>
                <img
                  src={images[0]?.preview}
                  alt="Uploaded Preview"
                  className="uploaded-image"
                  onClick={() => handleImageClick(images[0]?.preview)}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    cursor: "pointer", // Indicate it's clickable
                  }}
                />
                <button
                  type="button"
                  className="btn text-danger p-0"
                  onClick={() => setImages([])}
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
            )}
          </div>
        )}

        {/* Preview Modal */}
        {selectedImage && (
          <div
            className="image-modal"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // background: "rgba(0, 0, 0, 0.5)", // Transparent black background
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              style={{
                background: "#fff", // White background for the modal box
                borderRadius: "10px",
                padding: "20px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Slight shadow for a modal look
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
                  borderRadius: "50%", // Circle close button
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
          <button type="submit" className="custom_submit_btn">
            <ReactSVG src={refreshIcon} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
