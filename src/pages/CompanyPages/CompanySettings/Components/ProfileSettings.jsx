import React, { useState, useEffect, useMemo } from "react";
import { ReactSVG } from "react-svg";
import galleryUpload from "../../../../assets/newImages/gallery-export.svg";
import { useForm } from "react-hook-form";
import useAuth, { apiPost } from "../../../../CustomHooks/useAuth";
import Select from 'react-select';
import countryList from 'react-select-country-list';

const ProfileSettings = ({ getCities, cities, setCities, country, setCountry, isLoading, setIsLoading, register, handleSubmit, setValue, reset }) => {

  const [user, setUser] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);

  const options = useMemo(() => countryList().getData(), []);

  const { REACT_APP_API_URL } = process.env
  // const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const changeHandler = (value) => {
    setCountry(value);
    setCities([]); // Reset cities when country changes
    setValue("city", ""); // Reset city field when country changes
  }

  // const getCities = async () => {
  //   try {
  //     setIsLoading(true);
  //     const url = `https://countriesnow.space/api/v0.1/countries/cities`;
  //     const params = { country: country.label };
  //     const response = await apiPost(url, params);
  //     setCities(response.data);
  //     setIsLoading(false);

  //     // Pre-select the first city after cities are loaded
  //     if (response.data.length > 0) {
  //       setValue("city", response.data[0]);
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //   }
  // };

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
    event.target.value = "";
  };


  const editUser = async (data) => {
    try {
      // const url = `${REACT_APP_API_URL}api/users/${user.id}`;
      const url = `${REACT_APP_API_URL}users/${user.id}`;

      const formData = new FormData();
      formData.append("firstName", data.first_name);
      formData.append("lastName", data.last_name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("country", country.label);
      formData.append("city", data.city);
      formData.append("zipCode", data.zipcode);

      if (images.length > 0) {
        formData.append("image", images[0].file);
      }

      const response = await useAuth.apiPut(url, formData, localStorage.getItem("token"));
      if (response.success) {
        const updatedUser = {
          ...user,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          country: country.label,
          city: data.city,
          zipCode: data.zipcode,
          image: images.length > 0 ? images[0].file : user.image,
        };

        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        reset();
      }
      setUser(updatedUser);
      setIsLoading(false);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };


  const handleRemoveImage = () => {
    setImages(null);
    document.getElementById("fileInput").value = "";
  };



  return (
    <div className="profile-settings">
      <form onSubmit={handleSubmit(editUser)}>
        <h5>Personal Details</h5>
        <div className="row">
          <div className="col-md-6">
            <input className="form-control" placeholder="First Name" {...register("first_name")} />
          </div>
          <div className="col-md-6 ps-md-1">
            <input className="form-control" placeholder="Last Name" {...register("last_name")} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <input type="email" className="form-control" placeholder="Email Address" {...register("email")} />
          </div>
          <div className="col-md-6 ps-md-1">
            <input className="form-control" placeholder="Phone Number" {...register("phone")} />
          </div>
        </div>
        <hr className="ctm-hr" />

        <h5>Residential Information</h5>
        <div className="row">
          <div className="col-md-6">
            <Select options={options} value={country} onChange={changeHandler} />
          </div>
          <div className="col-md-6 ps-md-1">
            <select className="form-select" {...register("city")}>
              {isLoading ? (
                <option>Loading...</option>
              ) : (
                cities?.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Enter Street Address" {...register("address")} />
          </div>
          <div className="col-md-6 ps-md-1">
            <input className="form-control" placeholder="Enter Zip Code" {...register("zipcode")} />
          </div>
        </div>
        <hr className="ctm-hr" />
        <h5>Upload Profile Image</h5>
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
              />
            </div>
          </div>
        </div>

        {Array.isArray(images) && images.length > 0 ? (
          <div className="image-preview flex-column d-flex col-md-3">
            <img
              src={images[0]?.preview}
              alt="Uploaded Preview"
              className="uploaded-image"
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px"
              }}
            />
            <button
              type="button"
              className="btn text-danger"
              onClick={handleRemoveImage}
            >
              Remove
            </button>
          </div>
        ) : (
          <p>No image uploaded</p>
        )}

        <div className="submit-btns">
          <button type="submit" className="custom_submit_btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
