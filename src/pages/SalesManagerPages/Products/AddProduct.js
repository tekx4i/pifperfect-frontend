import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import leftArrow from "../../../assets/newImages/arrow-left.svg";
import linkIcon from "../../../assets/newImages/link.svg";
import "./style.scss";
import galleryUpload from "../../../assets/newImages/gallery-export.svg";
import { useForm, Controller } from "react-hook-form";
import { apiGet, apiPost } from "../../../CustomHooks/useAuth";
import { IoCloseCircleSharp } from "react-icons/io5";

import { MultiSelect } from "react-multi-select-component";

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [options, setOptions] = useState([]); // Store MultiSelect options
  const [metricsIds, setMetricsIds] = useState([]); // Stores only [IDs] for API

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({});
  const token = localStorage.getItem("token");
  const [selected, setSelected] = useState([]);
  // console.log("LLLL",selected)
  const [user, setUser] = useState({});
  const [metrics, setMetrics] = useState([]);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      preview: URL.createObjectURL(file),
      file,
    }));
    setImages([...images, ...imagePreviews]);
  };

  const getMetrics = async () => {
    try {
      let url = `${REACT_APP_API_URL}metrics?companyId=${user.companyId}`;
      const response = await apiGet(url, {}, token);
      console.log("res", response);
      if (response.success) {
        const metricsData = response?.data?.records; // Extract records array
        console.log("jufu", metricsData);

        // Convert API data to MultiSelect format
        const formattedMetrics = metricsData.map((metric) => ({
          label: metric.name, // Display name
          value: metric.id, // Unique identifier
        }));

        setOptions(formattedMetrics);

        // Preselect some metrics (optional)
        // setSelected(formattedMetrics.slice(0, 1)); // Preselect first item
        // setSelected(formattedMetrics, "liko"); // Preselect first item
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch metrics on mount
  useEffect(() => {
    getMetrics();
  }, [user]);

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}products`;

      // const formattedExpiration = dayjs(data.expiration).toISOString();

      const params = {
        productName: data.product_name,
        description: data.product_description,
        companyId: user.companyId,
        price: data.product_price,
        metrics: metricsIds,
      };

      // const formData = new FormData();
      // formData.append("productName", data.product_name);
      // formData.append("description", data.product_description);
      // formData.append("companyId", user.companyId);
      // formData.append("defaultCashValue", 21000.1);
      // formData.append("api_key", data.api_key);
      // formData.append("price", data.product_price);

      // if (images.length > 0) {
      //   formData.append("image", images[0].file);
      // }

      console.log(metrics);

      const response = await apiPost(url, params, token);
      if (response.success) {
        setIsLoading(false);
        reset();
        setImages([]);
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

  const handleMultiSelectChange = (selectedItems) => {
    console.log("ccc", selectedItems);
    setSelected(selectedItems); // Store selected objects
    setMetricsIds(selectedItems.map((item) => item.value)); // Extract IDs
  };

  // console.log("----",user)

  return (
    <div className="page-content" id="add-product">
      <div>
        <div className="custom-header-ctm">
          <Link to="/company/products" className="no-underline">
            <h4 className="d-flex">
              <ReactSVG src={leftArrow} /> <span>Add New Product</span>
            </h4>
          </Link>
        </div>
        <div className="ctm-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input
                  className="form-control"
                  placeholder="Enter Product Name"
                  {...register("product_name")}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label ">Product Price</label>
                <Controller
                  name="product_price"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      className="form-control"
                      placeholder="Enter Product Price"
                      value={`$${field.value || ""}`} // Add dollar symbol dynamically
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(
                          /[^0-9.]/g,
                          ""
                        ); // Keep only numeric and dot values
                        field.onChange(inputValue); // Update the form field value
                      }}
                    />
                  )}
                />
              </div>

              <hr className="ctm-hr" />
              <div className="col-md-12">
                <label className="form-label">Product Description</label>
                <textarea
                  className="textarea form-control"
                  placeholder="Enter Product Description"
                  // rows="8"
                  {...register("product_description")}
                ></textarea>
              </div>
              <hr className="ctm-hr" />
              {console.log("set", selected)}
              <div>
                <label>Select Metrics</label>
                {/* <pre>{JSON.stringify(selected)}</pre> */}
                {/* <MultiSelect
                  options={options}
                  value={selected}
                  // onChange={setSelected}
                  onChange={handleMultiSelectChange}
                  labelledBy="Select"
                /> */}

                <Controller
                  name="selected"
                  control={control}
                  defaultValue={[]} // Default value for the multi-select
                  render={({ field }) => (
                    <MultiSelect
                      options={options} // Using the existing options array
                      placeholder="Select Products"
                      value={selected}
                      onChange={handleMultiSelectChange} // Keeping your existing change handler
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
                                  handleMultiSelectChange(
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

              {/* <div className="col-md-6">
                <label className="form-label">API Key / Developer Link</label>
                <input
                  className="form-control"
                  placeholder="Paste API key"
                  {...register("api_key")}
                />
              </div>

              <hr className="ctm-hr" />
              <h5>Product Image</h5>
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
              <div className="row">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="image-preview flex-column d-flex col-md-3"
                  >
                    <img
                      src={image.preview}
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
                      className="btn text-danger p-0 me-2"
                      onClick={() => handleRemoveImage(index)}
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
                ))}
              </div> */}
            </div>
            <button className="custom_submit_btn mt-3" type="submit">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
