import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownMenu, DropdownToggle, Form } from "reactstrap";

//import images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";

//import Components
import SearchOption from "../Components/Common/SearchOption";
import LanguageDropdown from "../Components/Common/LanguageDropdown";
import WebAppsDropdown from "../Components/Common/WebAppsDropdown";
import MyCartDropdown from "../Components/Common/MyCartDropdown";
import FullScreenDropdown from "../Components/Common/FullScreenDropdown";
import NotificationDropdown from "../Components/Common/NotificationDropdown";
import ProfileDropdown from "../Components/Common/ProfileDropdown";
import LightDark from "../Components/Common/LightDark";

import { changeSidebarVisibility } from "../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { ReactSVG } from "react-svg";
import questionMark from "../assets/newImages/questions.svg";
import { useUserInfo } from "../Context/UserContext";
import { apiGet } from "../CustomHooks/useAuth";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const { userData, updateUserInfo, userInfo } = useUserInfo();
  const [test, setTest] = useState();
  const token=localStorage.getItem("token")
  const [company,setCompany]=useState()

  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;


  const getCompanies = async () => {
    // setIsLoading(true);
    try {
      // const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/companies`;

      const url = `${REACT_APP_API_URL}companies/${test?.companyId}`;

      const response = await apiGet(url, {}, token);
      
      if (response.success) {
        setCompany(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
    //   setIsLoading(false);
    }
  };

  useEffect(() => {
    if (test?.companyId) {
      getCompanies();
    }
  }, [test]);


  useEffect(() => {
    // Get user info from local storage
    const storedTest = localStorage.getItem("userInfo");
    if (storedTest) {
      setTest(JSON.parse(storedTest)); // Parse the JSON string
    }
  }, [userInfo]);


  return (
    <React.Fragment>
      <header id="page-topbar" className={headerClass}>
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box horizontal-logo">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" height="17" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLight} alt="" height="17" />
                  </span>
                </Link>
              </div>
              <div className="super-admin-detail">
                <h3>
                  {" "}
                  {test?.role == 1
                    ? "Super admin"
                    : test?.role == 2
                    ? `${company?.name ? company?.name : "Company Admin"} `
                    : test?.role == 3
                    ? "Sales Manager"
                    : "Sales Representative"}{" "}
                  Dashboard{" "}
                </h3>
                {/* <p>Welcome {user.firstName}! {test.firstName} </p> */}
                <p>Welcome {test?.firstName} </p>
              </div>
              {/* <button
                                onClick={toogleMenuBtn}
                                type="button"
                                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                                id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button> */}

              {/* <SearchOption /> */}
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* NotificationDropdown */}
              <NotificationDropdown />

              {/* ProfileDropdown */}
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
