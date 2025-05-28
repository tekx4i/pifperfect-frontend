import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import chevronDown from "../../assets/newImages/chevron.svg";
import { ReactSVG } from "react-svg";
//
import { flushStorage } from "../../helpers/storage";

const ProfileDropdown = () => {
  const [data, setData] = useState({});

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate("/company");
  };

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserData(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  const handleLogout = () => {
    flushStorage();
    // Redirect to login page
  };

  const profiledropdownData = createSelector(
    (state) => state.Profile,
    (state) => ({
      user: state.user,
    })
  );
  // Inside your component
  const { user } = useSelector(profiledropdownData);

  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      setUserName(
        process.env.REACT_APP_DEFAULTAUTH === "fake"
          ? obj.username === undefined
            ? user.first_name
              ? user.first_name
              : obj.data.first_name
            : "Admin" || "Admin"
          : process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? obj.email && obj.email
          : "Admin"
      );
    }
  }, [userName, user]);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setData(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center ">
            {/* <img className="rounded-circle header-profile-user" src={` ${REACT_APP_API_IMG_URL}${data.image}`}
                            alt="Header Avatar" /> */}
            <img
              className="rounded-circle header-profile-user"
              src={
                data.image
                  ? ` ${REACT_APP_API_IMG_URL}${data.image}`
                  : "https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png"
              }
              alt="Header Avatar"
            />

            <span className="text-start ms-xl-1">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                <div className="d-flex gap-1">
                  {userData.firstName}
                  <ReactSVG src={chevronDown} />
                </div>
              </span>
              {/* <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">Founder</span> */}
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem className="p-0">
            <Link to="/settings" className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>
          {/* <DropdownItem className='p-0'>
                        <Link to="/apps-chat" className="dropdown-item">
                            <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle">Messages</span>
                        </Link>
                    </DropdownItem> */}
          {/* <DropdownItem className='p-0'>
                        <Link to="#" className="dropdown-item">
                            <i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle">Taskboard</span>
                        </Link>
                    </DropdownItem> */}
          {/* <DropdownItem className='p-0'>
                        <Link to="/pages-faqs" className="dropdown-item">
                            <i
                                className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i> <span
                                    className="align-middle">Help</span>
                        </Link>
                    </DropdownItem> */}
          <div className="dropdown-divider"></div>
          {/* <DropdownItem className='p-0'>
                        <Link to="/pages-profile" className="dropdown-item">
                            <i
                                className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span
                                    className="align-middle">Balance : <b>$5971.67</b></span>
                        </Link>
                    </DropdownItem > */}
          <DropdownItem className="p-0">
            <Link to="/settings?tab=6" className="dropdown-item">
              <span className="badge bg-success-subtle text-success mt-1 float-end">
                New
              </span>
              <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle">Settings</span>
            </Link>
          </DropdownItem>
          {/* <DropdownItem className='p-0'>
                        <Link to="/auth-lockscreen-basic" className="dropdown-item">
                            <i
                                className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span>
                        </Link>
                    </DropdownItem> */}
          <DropdownItem className="p-0">
            <Link to="/login" onClick={handleLogout} className="dropdown-item">
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle" data-key="t-logout">
                Logout
              </span>
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
