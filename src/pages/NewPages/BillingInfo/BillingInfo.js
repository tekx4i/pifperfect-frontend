import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  Table,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import plusIcon from "../../../assets/newImages/plusIcon.svg";
import sortIcon from "../../../assets/newImages/sort.svg";
import { Link } from "react-router-dom";
import userDummy from "../../../assets/newImages/about.jpg";
import UserMinus from "../../../assets/newImages/user-minus.png";
import editIcon from "../../../assets/newImages/edit.svg";
import arrowDown from "../../../assets/newImages/arrow-down.svg";
import searchIcon from "../../../assets/newImages/search.svg";
import eyeIcon from "../../../assets/newImages/eye.svg";
import { CiSearch } from "react-icons/ci";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { ReactSVG } from "react-svg";
import { apiGet } from "../../../CustomHooks/useAuth";
import SkeletonTable from "../../../helpers/SkeltonLoader";

const Company = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;
  const token = localStorage.getItem("token");

  const handleSearch = (e) => {
    e.preventDefault();

    setTimeout(() => {
      // getCompanies(searchQuery); // Fetch data based on search query
    }, 500);
  };

  const getCompanies = async (query = "") => {
    setIsLoading(true);
    try {
      const url = `${REACT_APP_API_URL}companies?name=${query}`; // Include search query
      const params = {
        status: "ACTIVE",
        // limit: pShow,
        // page: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
      };
      const response = await apiGet(url, params, token);
      // setTotalPage(response.data.totalPages);

      if (response.success) {
        setUsers(response.data.records);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  //

  document.title = "Billing Info | PIFPerfect";
  return (
    <div className="page-content" id="billing_info">
      <div>
        {/* <BreadCrumb title="Orders" pageTitle="Ecommerce" /> */}
        <div className="custom-header-ctm">
          <div className="row w-100 m-0">
            <div className="col-md-6 p-0">
              <h4 className="w-100">Billing Information</h4>
            </div>
            <div className="col-md-6 p-0">
              <div className="add-btns justify-conten-end">
                {/* <div className="search-ctm">
                  <input placeholder="Search any company" />
                  <div>
                    <ReactSVG src={searchIcon} />
                  </div>
                </div> */}
                <form onSubmit={handleSearch}>
                  <div className="search-ctm">
                    <input
                      placeholder="Search Billing info by name"
                      value={searchQuery}
                      // onChange={handleSearch} // Handle input change
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">
                      <CiSearch />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="custom-container">
          <div className="table-responsive mt-5">
            <div className="table-wrapper">
              <Table className="align-middle table-nowrap mb-0">
                <thead>
                  <tr>
                    <th scope="col">Company Name</th>
                    <th scope="col">Next Billing Date</th>
                    <th scope="col">Auto Renewal</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading ? (
                      <SkeletonTable 
                      rows={5}
                      columns={[300, 200, 200, 300, 200, 200,]}
                      />
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <tr>
                          <td className="fw-medium">
                            <div className="user-img">
                              <img src={userDummy} /> {user.name}
                            </div>
                          </td>

                          <td>10th Nov, 2024</td>
                          <td>
                            <span className="ctm-badge active">
                              <span className="active-dot"></span>Active
                            </span>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <Link
                                to={`/billing/detail/${user.id}`}
                                className="action-btn bg-transparent"
                              >
                                <ReactSVG src={eyeIcon} /> View Details
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center"
                          style={{ verticalAlign: "center" }}
                        >
                          No Data Found
                        </td>
                      </tr>
                    )
                  }

                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;
