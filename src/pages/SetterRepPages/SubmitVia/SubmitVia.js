import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ReactSVG } from "react-svg";
import submitIcon from "../../../assets/newImages/submit-icon.svg";
import "./style.scss";
import { apiGet, apiPost } from "../../../CustomHooks/useAuth";
import { formFields } from "../SubmitNumbers/SubmitNumberData";
import ProductPic from "../../../assets/images/products/product-pic.jpeg";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import { MdOutlineKeyboardArrowUp } from "react-icons/md";

const SubmitNumber = () => {
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({});
  const token = localStorage.getItem("token");
  const [test, setTest] = useState();
  // metricses main form fields values arhy  or companyproductss main product top wali

  const [company, setCompany] = useState(0);
  const [companyProducts, setCompanyProducts] = useState([]);
  const [formData, setFormData] = useState(formFields.payload.records);
  const [metrics, setMetrics] = useState();
  // console.log(test,",,,,comapnyproduct")
  const getCompaniesProducts = async (test) => {
    try {
      const url = `${REACT_APP_API_URL}products`;
      const response = await apiGet(url, {}, token);

      if (response.success) {
        setCompanyProducts(response.data?.records);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("ooo",companyProducts)

  useEffect(() => {
    getCompaniesProducts();
    console.log("assasas");
  }, [company]);

  // const onSubmit = async (data) => {
  //   console.log("Submitted Data", data);
  //   try {
  //     setIsLoading(true);
  //     const url = `${REACT_APP_API_URL}dailyMetrics`;

  //     // Dynamically construct params from accordion input fields
  //     const groupedData = companyProducts.map((product, accordionIndex) => {
  //       const productData = {};
  //       metrics.forEach((field) => {
  //         const fieldName = `${accordionIndex}-${field.id}`; // Matches the unique names from register
  //         productData[field.id] = data[fieldName]; // Map input values from the submitted form data
  //       });
  //       // return { productId: product.id, ...productData }; // Include product ID or relevant details
  //       return { metricId: metrics.id, ...productData }; // Include product ID or relevant details

  //     });

  //     console.log("Grouped Data for API:", groupedData);

  //     const response = await apiPost(url, groupedData, token);
  //     if (response.success) {
  //       setIsLoading(false);
  //       reset(); // Reset the form on success
  //     }
  //   } catch (error) {
  //     console.error("Error submitting data:", error);
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data) => {
    console.log("Submitted Data", data);
    try {
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}dailyMetrics`;

      // Construct the request body
      const metricsData = [];

      companyProducts.forEach((product, accordionIndex) => {
        product.metrics.forEach((field) => {
          // Get metrics for the current product
          const fieldName = `${accordionIndex}-${field.id}`; // Matches input names
          const value = data[fieldName]; // Get the corresponding value

          if (value !== undefined && value !== "") {
            metricsData.push({
              metricId: field.metricId, // Correctly assigning metricId
              productId: product.id, // Include productId
              value: Number(value), // Ensure the value is a number
            });
          }
        });
      });

      const payload = { metrics: metricsData };

      console.log("Transformed API Payload:", payload);

      const response = await apiPost(url, payload, token);
      if (response.success) {
        setIsLoading(false);
        reset(); // Reset form on success
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedTest = localStorage.getItem("userInfo");
    if (storedTest) {
      setTest(JSON.parse(storedTest));
    }
  }, []);

  // console.log("meta",metrics)

  // const

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const getMetrics = async (test) => {
    try {
      // const url = `${REACT_APP_API_URL}metrics?role=${Number(test?.role)}&companyId=${test?.companyId}`;
      const url = `${REACT_APP_API_URL}metrics`;

      const response = await apiGet(url, {}, token);
      console.log("Response:", response);

      if (response.success) {
        setMetrics(response.data.records);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (test) {
      getMetrics(test);
      getCompaniesProducts(test);
    }
  }, [test]);

  return (
    <div className="page-content" id="settergap-submit-number">
      <div className="custom-container mt-4">
        <div className="custom-header-ctm">
          <div className="row w-100 m-0 d-flex justify-content-between">
            {/* <div className="col-md-12 p-0"> */}

            <div className="col-md-6 p-0">
              <h4 className="w-100">Submit Your Today’s Numbers</h4>
            </div>
          </div>
        </div>
        {/*  */}

        <div className="ctm-form mt-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              {companyProducts?.map((accordion, accordionIndex) => (
                <div
                  key={accordionIndex}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    overflow: "hidden",
                  }}
                >
                  {console.log("aaaaaa", accordion)}
                  <div
                    style={{
                      // background: "#f7f7f7",
                      padding: "10px 15px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => toggleAccordion(accordionIndex)}
                    className="d-flex mb-0 justify-content-between align-items-center"
                  >
                    <div>
                      <img
                        className="product__pic"
                        src={
                          accordion.image
                            ? `${REACT_APP_API_IMG_URL}${accordion.image}`
                            : "https://picsum.photos/200"
                        }
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        alt="Product"
                      />

                      <span style={{ fontSize: "15px" }}>
                        {accordion.productName}
                      </span>
                    </div>

                    {/* Conditionally render the text */}
                    <p className="pt-3">
                      {activeIndex === accordionIndex ? (
                        <MdOutlineKeyboardArrowUp fontSize={30} />
                      ) : (
                        <MdOutlineKeyboardArrowDown fontSize={30} />
                      )}
                    </p>
                  </div>

                  <div
                    style={{
                      maxHeight: activeIndex === accordionIndex ? "500px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease",
                      background: "#fff",
                      padding:
                        activeIndex === accordionIndex ? "10px 15px" : "0",
                    }}
                  >
                    {/* {accordion.metrics.map((data) => (
                      <>
                        <h1>yoyo</h1>
                      </>
                    ))} */}

{activeIndex === accordionIndex && (
  accordion.metrics.length > 0 ? (
    accordion.metrics.map((field, fieldIndex) => (
      <div
        key={`${accordionIndex}-${fieldIndex}`}
        style={{ marginBottom: "10px" }}
      >
        <input
          {...register(`${accordionIndex}-${field.id}`)}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>
    ))
  ) : (
    <p style={{ textAlign: "center", color: "#888", padding: "10px" }}>
      No data found
    </p>
  )
)}

                  </div>
                </div>
              ))}
            </div>

            <button
              className="custom_submit_btn"
              // disabled={isLoading}
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <ReactSVG src={submitIcon} />
              {isLoading ? "Submitting..." : "Submit Numbers"}
            </button>
          </form>
        </div>
        {/*  */}

        <div className="ctm-form mt-5"></div>
      </div>
    </div>
  );
};

export default SubmitNumber;
