import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueCharts } from "./DashboardEcommerceCharts";
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import { getRevenueChartsData } from "../../slices/thunks";
import { createSelector } from "reselect";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import sortIcon from "../../assets/newImages/sort.svg";
import LineChart from "../../assets/maps/lineChart";
import { apiGet } from "../../CustomHooks/useAuth";
import { useUserInfo } from '../../Context/UserContext';

const Revenue = () => {
  const { userData, updateUserInfo, userInfo } = useUserInfo();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;

  const [user, setUser] = useState({});
  const [chartData, setchartData] = useState([]);
  const [company, setCompany] = useState([])
  const token = localStorage.getItem("token")
  // const userInfo = localStorage.getItem("userInfo")
  const [test, setTest] = useState()
  // const dummy = ["Company1", "Company2", "Company3", "Company4", "Company5",]
  // const dummy = [{ id: 1, name: "Sales Manager Company", role: 3 }, { id: 1, name: "Setter Company", role: 4 }, { id: 1, name: "Comapny Admin", role: 2 }]
  const handleUpdateUser = (e) => {
    // const newUserInfo = { name: "Jane Smith", email: "janesmith@example.com" };
    const newUserInfo = { ...user, role: e.target.value }

    updateUserInfo(newUserInfo);
  };

  const getCompanies = async () => {
    setIsLoading(true);
    try {
      const url = `${REACT_APP_API_URL}companies`; // Include search query
      const response = await apiGet(url, {}, token);

      if (response.success) {
        setCompany(response.data.records);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanies()
  }, [])

  const selectDashboardData = createSelector(
    (state) => state.DashboardEcommerce,
    (revenueData) => revenueData.revenueData,
  );
  // Inside your component
  const revenueData = useSelector(selectDashboardData);

  useEffect(() => {
    setchartData(revenueData);
  }, [revenueData]);

  const onChangeChartPeriod = (pType) => {
    dispatch(getRevenueChartsData("all"));
  };

  useEffect(() => {
    dispatch(getRevenueChartsData("all"));
  }, [dispatch]);

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);


  const handleCompany = (e) => {
    const selectedRole = e.target.value; // Get the selected value

    if (selectedRole) {
      const updatedUser = { ...user, role: selectedRole }; // Update the user object
      setUser(updatedUser); // Update state
      localStorage.setItem("userInfo", JSON.stringify(updatedUser)); // Update localStorage
    } else {
      console.error("No value selected.");
    }
  };




  useEffect(() => {
    // Get user info from local storage
    const storedTest = localStorage.getItem("userInfo");
    if (storedTest) {
      setTest(JSON.parse(storedTest)); // Parse the JSON string
    }
  }, [userInfo]);


  return (
    <React.Fragment>
      <div className="security-header">
        <h5>Latest Reports & Analytics</h5>
        {/* <p>Current User: {userInfo ? userInfo.name : "No User"}</p> */}
        {/* <button onClick={handleUpdateUser}>Update User Info</button> */}

        {/* {test?.name} */}

        {
          test?.role !== 1 &&
          <div className="add-btns">
            {
              <select className="form-select dashboard-select" onChange={(e) => handleUpdateUser(e)}>
                {/* <option value={2}>Select Company</option>
              <option value={2}>Company</option>
              <option value={3}>Sales Manager</option>
              <option value={4}>Setter</option> */}

                {/* <option value={2}>Company</option> */}

                {/* {user.role == 1 &&
                company.map((comp) => (
                  <option>{comp.name}</option>
                ))
              } */}
                <option value={test?.role}>Select</option>

                {
                  test?.role !== 1 &&
                  Array.isArray(test?.companies) &&
                  test?.companies.map((data) => (
                    <option value={data.roleId} key={data.id}>{data.name}</option>
                  ))
                }



              </select>
            }

          </div>
        }

      </div>
      <div className="custom-card">

        <LineChart />



      </div>
    </React.Fragment>
  );
};

export default Revenue;
