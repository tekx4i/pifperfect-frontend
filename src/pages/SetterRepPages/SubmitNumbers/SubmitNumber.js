import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ReactSVG } from "react-svg";
import submitIcon from "../../../assets/newImages/submit-icon.svg";
import "../style.scss";
import { apiGet, apiPost } from "../../../CustomHooks/useAuth";
import { formFields } from "./SubmitNumberData";
import ProductPic from "../../../assets/images/products/product-pic.jpeg";

const SubmitNumber = () => {
  const { REACT_APP_API_URL } = process.env;
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({});
  const token = localStorage.getItem("token");
  const [test, setTest] = useState();
  const [company, setCompany] = useState(0);
  const [companyProducts, setCompanyProducts] = useState();
  const [formData, setFormData] = useState(formFields.payload.records);
  const [metrics, setMetrics] = useState([]);
  console.log("llllLL",metrics)
  const getCompaniesProducts = async () => {
    const url = `${REACT_APP_API_URL}products?companyId=${company}`;
    const response = await apiGet(url, {}, token);
    // console.log("response agya ",response.data.records)
    setCompanyProducts(response.data?.records);
  };

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
  //       formFields.forEach((field) => {
  //         const fieldName = `${accordionIndex}-${field.id}`; // Matches the unique names from register
  //         productData[field.id] = data[fieldName]; // Map input values from the submitted form data
  //       });
  //       return { productId: product.id, ...productData }; // Include product ID or relevant details
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

  useEffect(() => {
    const storedTest = localStorage.getItem("userInfo");
    if (storedTest) {
      setTest(JSON.parse(storedTest));
    }
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const getMetrics = async () => {
    try {
      const url = `${REACT_APP_API_URL}metrics?${test?.role}?${test?.companyId}`;

      const response = await apiGet(url, {}, token);

      if (response.success) {
        setMetrics(response.data.records);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMetrics();
  }, []);

  const onSubmit = async (data) => {
    console.log("Submitted Data", data);
    try {
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}dailyMetrics`;

      // Dynamically construct params from accordion input fields
      const groupedData = metrics.map((metric, index) => {
        const fieldName = `val${index}`;
        const productData = {
          metricId: metric.id,
          value: data[fieldName], // Capture the dynamic input value
        };
        return productData;
      });

      console.log("Grouped Data for API:", groupedData);
      const params = { metrics: groupedData };

      const response = await apiPost(url, params, token);
      if (response.success) {
        setIsLoading(false);
        reset(); // Reset the form on success
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content" id="settergap-submit-number">
      <div className="custom-container mt-4">
        <div className="custom-header-ctm">
          <div className="row w-100 m-0 d-flex justify-content-between">
            {/* <div className="col-md-12 p-0"> */}

            <div className="col-md-6 p-0">
              <h4 className="w-100">Submit Your Today’s Numbers</h4>
            </div>

            {/* <div className="col-md-2 p-0">
              <select
                className="form-select dashboard-select"
                onChange={(e) => {
                  const value = e.target.value;
                  setCompany(value);
                }}
              >
                <option value="">Select</option>

                {test?.companies.map((company) => (
                  <option value={company.id}>{company.name}</option>
                ))}
              </select>
            </div> */}

            {/* </div> */}
          </div>
        </div>
        {/*  */}
        {/* <div className="ctm-form mt-5">
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
                  <div
                    style={{
                      background: "#f7f7f7",
                      padding: "10px 15px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => toggleAccordion(accordionIndex)}
                  >
                    <div>
                    <img className="product__pic" src={ProductPic} />
                    {accordion.productName}
                      </div>
                      <p className="mt-3 pb-3 border-bottom"> describe something or called the scene “a disaster area,” and I think that was an accurate description. I applied for the position after reading the job description.
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
                    {activeIndex === accordionIndex &&
                      formFields.map((field, fieldIndex) => (
                        <div
                          key={`${accordionIndex}-${fieldIndex}`}
                          style={{ marginBottom: "10px" }}
                        >
                          
                          <label htmlFor={`${accordionIndex}-${field.id}`}>
                            {field.label}
                          </label>
                          <input
                            id={`${accordionIndex}-${field.id}`}
                            type={field.type}
                            name={`${accordionIndex}-${field.id}`}
                            placeholder={field.placeholder}
                            {...register(`${accordionIndex}-${field.id}`)} // Make name unique
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginTop: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="custom_submit_btn"
              disabled={isLoading}
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
        </div> */}
        {/*  */}

        <div className="ctm-form mt-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div
                style={{
                  // border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    padding: "10px 15px",
                  }}
                >
                  <> 
                    {metrics.map(
                      (metric, index) =>
                        !metric.isCalculated && (
                          <div
                            className="row mt-3 d-flex justify-content-between align-items-center"
                            key={metric.id}
                          >
                            {/* <div className="col-lg-6">
                            </div> */}
                            <div className="col-lg-6">
                              <label>{metric.name}</label>
                              <input
                                type="number"
                                placeholder="Enter field value"
                                {...register(`val${index}`)}
                                style={{
                                  width: "100%",
                                  padding: "8px",
                                  marginTop: "5px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                              />
                            </div>
                          </div>
                        )
                    )}
                    {metrics?.isCalculated == true && (
                      <>
                        <div className="row mt-3">
                          <div className="col-md-6 ">
                            <label>{field.value1}</label>
                            <input
                              type="text"
                              placeholder="Enter field value"
                              style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                              }}
                            />
                          </div>

                          <div className="col-md-6 ">
                            <label>{field.value2}</label>
                            <input
                              type="text"
                              placeholder="Enter field value"
                              style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <>
                      <div className="row mt-3">
                        <div className="col-md-6 ">
                          <label>Stornny Cents</label>
                          <input
                            type="text"
                            placeholder="Enter field value"
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginTop: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                          />
                        </div>

                        <div className="col-md-6 ">
                          <label>Sippi Mays</label>
                          <input
                            type="text"
                            placeholder="Enter field value"
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginTop: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </div>
                    </>

                    {field.isCalculated == true && (
                      <div>
                        <div>
                          <label>{field.name}+++</label>
                          <input
                            type="text"
                            placeholder="Enter field value"
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginTop: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                          />
                        </div>

                        <div>
                          <label>{field.name} +++</label>
                          <input
                            type="text"
                            placeholder="Enter field value"
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginTop: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                  {/* // ))} */}
                </div>
              </div>
            </div>

            <button
              className="custom_submit_btn"
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <ReactSVG src={submitIcon} />
              Submit Numbers
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitNumber;
