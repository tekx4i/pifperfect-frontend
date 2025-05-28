import React, { useEffect, useState } from "react";
import SingleProduct from "./Component/SingleProduct";
import plusIcon from "../../../assets/newImages/plusIcon.svg";
import { ReactSVG } from "react-svg";
import { Link } from "react-router-dom";
import "./style.scss";
import { apiDelete, apiGet, apiPut } from "../../../CustomHooks/useAuth";
import SkeltonLoader from "../../../helpers/SkeltonLoader";
import { Table } from "reactstrap";
import { MdOutlineArrowDropUp } from "react-icons/md";
import SkeletonTable from "../../../helpers/SkeltonLoader";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdBlock } from "react-icons/md";

//

import { FaSortUp, FaSortDown } from "react-icons/fa"; // For sorting icons
import Creatable from "react-select/creatable";

import { IoIosArrowRoundUp, IoIosArrowRoundDown } from "react-icons/io"; // For sorting icons
import WarningSign from "../../../assets/activetabs/warning-signs-svgrepo-com.svg";

// import plusIcon from "../../../assets/newImages/plusIcon.svg";
import sortIcon from "../../../assets/newImages/sort.svg";
import { TbReload } from "react-icons/tb";
import {
  UNSAFE_useScrollRestoration,
  useNavigate,
  useParams,
} from "react-router-dom";
import userDummy from "../../../assets/newImages/about.jpg";
import UserMinus from "../../../assets/newImages/user-minus.png";
import editIcon from "../../../assets/newImages/edit.svg";
import activateIcon from "../../../assets/newImages/refresh.png";
import checkIcon from "../../../assets/newImages/check.svg";
import authenticateUser from "../../../assets/newImages/security-user.png";
import auth from "../../../CustomHooks/useAuth";
import { CiSearch } from "react-icons/ci";
// import SkeletonTable from "../../../helpers/SkeltonLoader";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
// import { ReactSVG } from "react-svg";
import "./style.scss";
import { useSearchParams, Navigate } from "react-router-dom";
import Pagination from "../../../Components/Pagination/Pagination";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [companyUsers, setCompanyUsers] = useState([]);
  const { id } = useParams(); // Retrieve the id from the URL
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  // console.log("plplplp",user?.companies[0].currencySymbol)
  const token = localStorage.getItem("token");
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  const getProducts = async (searchParams) => {
    setIsLoading(true);
    try {
      let url = `${REACT_APP_API_URL}products?companyId=${user?.companyId}`;

      if (searchParams) {
        url += `&productName=${searchParams}`;
      }

      const response = await apiGet(url, {}, token);

      if (response.success) {
        setProducts(response.data.records);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [user]);

  const deleteFunction = async (id) => {
    if (!token) {
      console.error("Authorization token is missing.");
      return;
    }
    try {
      // setDeleteLoading(selectedId);
      const url = `${REACT_APP_API_URL}products/${id}`;
      const response = await apiDelete(url, token);
      // setIsDeleteModalOpen(false)
      // getData();
      if (response.success) {
        getProducts();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      // setDeleteLoading(false);
    }
  };

  // const toggleMetricsStatus = async (id, currentStatus) => {
  //   try {
  //     const url = `${REACT_APP_API_URL}products/${id}`;

  //     // Prepare the new status
  //     const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  //     const params = {
  //       status: newStatus,
  //     };

  //     // Send the API request
  //     const response = await apiPut(url, params, token);

  //     if (response) {
  //       console.log("Status toggled successfully:", response);
  //       getProducts(); // Refresh the metrics data
  //     }
  //   } catch (error) {
  //     console.log("Error toggling status:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const toggleMetricsStatus = async (id, currentStatus) => {
    // Determine the new status and action text
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const actionText = currentStatus === "ACTIVE" ? "Deactivate" : "Activate";

    // Show confirmation dialog using SweetAlert
    swal({
      title: `Are you sure you want to ${actionText} this product?`,
      text: `This action will ${actionText} the product.`,
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          value: null,
          visible: true,
          className: "cancel-btn",
          closeModal: true,
        },
        confirm: {
          text: `Yes, ${actionText} it!`,
          value: true,
          visible: true,
          className:
            currentStatus === "ACTIVE" ? "deactivate-btn" : "activate-btn",
          closeModal: false,
        },
      },
    }).then(async (willChange) => {
      if (willChange) {
        try {
          const url = `${REACT_APP_API_URL}/products/${id}`;
          const params = {
            status: newStatus,
          };

          // Send the API request
          const response = await apiPut(url, params, token);

          if (response) {
            console.log("Status toggled successfully:", response);
            swal(
              `${actionText}!`,
              `The product has been ${actionText.toLowerCase()}d.`,
              "success",
              {
                buttons: false,
                timer: 2000,
              }
            );
            getProducts(); // Refresh the product data
          } else {
            swal(
              "Error!",
              "Something went wrong while changing status.",
              "error"
            );
          }
        } catch (error) {
          console.error("Error toggling status:", error);
          swal("Error!", "Something went wrong.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleSearch = (searchParams) => {
    getProducts(searchParams);
  };

  return (
    <div className="custom-container">
      <div className="col-md-12 p-0 mt-5">
        <div className="add-btns d-flex justify-content-between ">
          <Link
            to={"/sales-manager/products/add"}
            className="default__btn align-items-center"
          >
            <ReactSVG src={plusIcon} /> <span>Add New Product</span>
          </Link>

          <form className="mt-2 d-flex gap-3 mb-3">
            <div className="search-ctm new-search">
              <input
                placeholder="Search..."
                // value={}
                onChange={(e) => handleSearch(e.target.value)} // Handle input change
                // onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="table mt-3">
        <div className="table-wrapper">
          <Table className="align-middle table-nowrap mb-0">
            <thead>
              <tr>
                <th scope="col">Product Name</th>
                <th scope="col">Product Description</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                // Show skeleton loader while loading
                <tr>
                  <td colSpan={4}>
                    <SkeletonTable
                      rows={5}
                      columns={[200, 150, 100, 200, 300, 100]}
                    />
                  </td>
                </tr>
              ) : products.length > 0 ? (
                // Render products data
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="">
                      <div className="user-img">{product.productName}</div>
                    </td>
                    <td>{product.description}</td>
                    <td>
                      {user?.companies[0]?.currencySymbol ?? "$"}
                      {product.price}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center flex-wrap gap-2">
                        
                        <button
                          className={`btn action-btn ms-2 ${
                            product.status === "ACTIVE" ? "delete" : "success"
                          }`}
                          onClick={() =>
                            toggleMetricsStatus(product.id, product.status)
                          }
                          disabled={product.isDelete == false ? true : ""} // Disable the button while toggling
                        >
                          {product.status === "ACTIVE" ? (
                            <MdBlock />
                          ) : (
                            <TbReload />
                          )}
                        </button>
                        <Link
                          to={`/sales-manager/products/edit/${product.id}`}
                          className="action-btn edit"
                        >
                          <ReactSVG src={editIcon} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Show "No Product Found" message when there's no data
                <tr>
                  <td
                    colSpan={4}
                    className="text-center"
                    style={{ verticalAlign: "center" }}
                  >
                    No Product Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
