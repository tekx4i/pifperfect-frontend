import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ReactSVG } from "react-svg";
import leftArrow from "../../../assets/newImages/arrow-left.svg";
import linkIcon from "../../../assets/newImages/link.svg";
import "./style.scss";
import { useForm, Controller } from "react-hook-form";
import galleryUpload from "../../../assets/newImages/gallery-export.svg";
import { apiGet, apiPut } from "../../../CustomHooks/useAuth";
import { IoCloseCircleSharp } from "react-icons/io5";
import { MultiSelect } from "react-multi-select-component";

const EditProduct = () => {
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const [metricsIds, setMetricsIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [hasEditable, sethasEditable] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({});
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({});
  const { id } = useParams(); // Retrieve the id from the URL
  const [singleImage, setSingleImage] = useState();

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const imagePreviews = files.map((file) => ({
  //     preview: URL.createObjectURL(file),
  //     file,
  //   }));
  //   setImages([...images, ...imagePreviews]);
  // };

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const imagePreviews = files.map((file) => ({
  //     preview: URL.createObjectURL(file),
  //     file,
  //   }));

  //   // Add new images without overwriting the old ones
  //   setImages((prevImages) => [...prevImages, ...imagePreviews]);
  // };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Only get the first file
    const imagePreview = {
      preview: URL.createObjectURL(file),
      file,
    };

    setImages([imagePreview]); // Set images to only contain the first uploaded image
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setSingleImage("");
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

      // Ensure 'id' exists, as editing requires an existing user ID
      if (!id) {
        console.error("Edit operation requires a user ID.");
        setIsLoading(false);
        return;
      }

      const url = `${REACT_APP_API_URL}products/${id}`;

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
      // formData.append("api_key", data.api_key);
      // formData.append("companyId", user.companyId);
      // formData.append("defaultCashValue", 21000.1);
      // formData.append("price", data.product_price);

      // Add image to formData only if a new image is provided
      // if (images.length > 0) {
      //   formData.append("image", images[0].file);
      // }

      const response = await apiPut(url, params, token); // Only PUT request for edit
      if (response.success) {
        setIsLoading(false);
        const metricsData = response?.data?.records; // Extract records array
        console.log("jufu", metricsData);

        // Convert API data to MultiSelect format
        const formattedMetrics = metricsData.map((metric) => ({
          label: metric.name, // Display name
          value: metric.id, // Unique identifier
        }));
        // reset(); // Clear form inputs after successful edit
      }
    } catch (error) {
      console.error("Error during edit operation:", error);
      setIsLoading(false);
    }
  };

  const getSingleCompany = async (id) => {
    try {
      const url = `${REACT_APP_API_URL}products/${id}`;

      const params = {};
      const response = await apiGet(url, params, token);

      if (response.success) {
        const companyData = response.data;
        sethasEditable(companyData.hasEditable);

        setValue("product_name", companyData.productName || "");
        setValue("product_description", companyData.description || "");
        setValue("api_key", companyData.api_key || "");
        setValue("product_price", companyData.price || "");

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
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleCompany(id);
    }
  }, [id]);

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

  return (
    <div className="page-content" id="edit-product">
      <div>
        <div className="custom-header-ctm">
          <Link className="no-underline" to="/company/products">
            <h4 className="d-flex">
              <ReactSVG src={leftArrow} /> <span>Edit Product</span>
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
                {/* <input
                  className="form-control"
                  placeholder="Enter Product Price"
                  {...register("product_price")}
                /> */}
                {console.log("MIKASIN", hasEditable)}
                <Controller
                  name="product_price"
                  // disabled={hasEditable == true ? false : true}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      className="form-control"
                      disabled={hasEditable == true ? false : true}
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
                  {...register("product_description")}
                ></textarea>
              </div>

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
            </div>
            <button className="custom_submit_btn mt-3" type="submit">
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
