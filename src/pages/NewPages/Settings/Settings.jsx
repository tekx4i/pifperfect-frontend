import React, { useState, useEffect } from "react";
import ProfileSettings from "./components/ProfileSettings";
import EmailSettings from "./components/EmailSettings";
import { ReactSVG } from "react-svg";
import "./style.scss";
import NotificationSettings from "./components/NotificationSettings";
import LanguageRegion from "./components/LanguageRegion";
import AccountSettings from "./components/AccountSettings";
import CompanySettings from "./components/CompanySettings";
import notifi from "../../../assets/newImages/notification.svg";
import location from "../../../assets/newImages/location.svg";
import frame from "../../../assets/newImages/frame.svg";
import user from "../../../assets/newImages/user.svg";
// active
import notifiActive from "../../../assets/newImages/notification-active.svg";
import locationActive from "../../../assets/newImages/locationactive.png";
import frameActive from "../../../assets/newImages/shield-security-active.svg";
import userActive from "../../../assets/newImages/user-active.svg";
import useAuth, { apiPost } from "../../../CustomHooks/useAuth";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const Settings = () => {
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  // const options = useMemo(() => countryList().getData(), []);

  const getCities = async () => {
    try {
      setIsLoading(true);
      const url = `https://countriesnow.space/api/v0.1/countries/cities`;
      const params = { country: country.label };
      const response = await apiPost(url, params);
      setCities(response.data);
      setIsLoading(false);

      // Pre-select the first city after cities are loaded
      if (response.data.length > 0) {
        setValue("city", response.data[0]);
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

  document.title = "Settings | PIFPerfect";
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const queryParam = parseInt(searchParams.get("tab")) || 1; // Retrieves the value of the 'pp' query parameter
  // const initialTab = parseInt(searchParams.get("pp"));
  // const initialTab = location.state?.tab || 1; // Default to 1 if no state is passed

  console.log("para,s", queryParam);
  const [tab, setTab] = useState(queryParam);

  useEffect(() => {
    if (queryParam == 1) {
      setTab(1);
      console.log("yes runnning");
    }

    if (queryParam == 6) {
      setTab(6);
      console.log("yes runnning");
    }
  }, [queryParam]);

  return (
    <div className="page-content" id="user-management">
      <div>
        <div className="custom-header-ctm">
          {
            <h4>
              {" "}
              {user?.role == 1
                ? "Super Admin"
                : user?.role == 2
                ? "Company Admin"
                : user?.role == 3
                ? "Sales Manager"
                : "Sales Representative"}{" "}
              Settings
            </h4>
          }
        </div>
        <div className="custom-container">
          <div className="custom-tabs">
            <button
              className={`custom-tab-btn ${tab === 1 ? "active" : ""}`}
              onClick={() => setTab(1)}
            >
              <ReactSVG src={tab === 1 ? userActive : user} />{" "}
              <span>Profile Settings</span>
            </button>

            {/* EMAIL SETTINGS */}

            {/* {user?.role !== 1 && user?.role !== 2 && (
              <button
                className={`custom-tab-btn ${tab === 5 ? "active" : ""}`}
                onClick={() => setTab(5)}
              >
                <img src={tab === 5 ? frameActive : frame} />{" "}
                <span>Email Settings</span>
              </button>
            )} */}

            {/* EMAIL SETTINGS */}

            {/* {
              user?.role == 1 &&
              <button className={`custom-tab-btn ${tab === 2 ? "active" : ""}`} onClick={() => setTab(2)}>
                <ReactSVG src={tab === 2 ? notifiActive : notifi} /> <span>Notification Settings</span>
              </button>
            } */}
            {/* <button
              className={`custom-tab-btn ${tab === 3 ? "active" : ""}`}
              onClick={() => setTab(3)}
            >
              {tab === 3 ? (
                <img src={locationActive} />
              ) : (
                <ReactSVG src={location} />
              )}
              <span>Language & Region</span>
            </button> */}

            {user?.role == 2 && (
              <button
                className={`custom-tab-btn ${tab === 6 ? "active" : ""}`}
                onClick={() => setTab(6)}
              >
                <img src={tab === 6 ? frameActive : frame} />{" "}
                <span>Company Settings</span>
              </button>
            )}

            {user?.role !== 2 && (
              <button
                className={`custom-tab-btn ${tab === 4 ? "active" : ""}`}
                onClick={() => setTab(4)}
              >
                <img src={tab === 4 ? frameActive : frame} />{" "}
                <span>Account Security</span>
              </button>
            )}
          </div>
          <div className="ctm-form px-0" style={{ marginTop: "20px" }}>
            {tab === 1 && (
              <ProfileSettings
                getCities={getCities}
                cities={cities}
                setCities={setCities}
                country={country}
                setCountry={setCountry}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                register={register}
                handleSubmit={handleSubmit}
                setValue={setValue}
                reset={reset}
              />
            )}

            {tab === 2 && <NotificationSettings />}
            {tab === 3 && <LanguageRegion />}
            {tab === 4 && <AccountSettings />}
            {tab === 5 && <EmailSettings />}
            {tab === 6 && <CompanySettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
