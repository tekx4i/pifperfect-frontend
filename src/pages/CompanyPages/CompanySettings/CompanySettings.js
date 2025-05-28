import React, { useState } from "react";
import ProfileSettings from "./Components/ProfileSettings";
import { ReactSVG } from "react-svg";
import "./style.scss";
import NotificationSettings from "./Components/NotificationSettings";
import LanguageRegion from "./Components/LanguageRegion";
import AccountSettings from "./Components/AccountSettings";
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
import { useSelector } from "react-redux";

const Settings = () => {

  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

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

  document.title = "Settings | PIFPerfect";
  const [tab, setTab] = useState(1);
  return (
    <div className="page-content" id="user-management">
      <div>
        <div className="custom-header-ctm">
          <h4>Compnay Settings</h4>
        </div>
        <div className="custom-container">
          <div className="custom-tabs">
            <button className={`custom-tab-btn ${tab === 1 ? "active" : ""}`} onClick={() => setTab(1)}>
              <ReactSVG src={tab === 1 ? userActive : user} /> <span>Profile Settings</span>
            </button>
            <button className={`custom-tab-btn ${tab === 2 ? "active" : ""}`} onClick={() => setTab(2)}>
              <ReactSVG src={tab === 2 ? notifiActive : notifi} /> <span>Notification Settings</span>
            </button>
            <button className={`custom-tab-btn ${tab === 3 ? "active" : ""}`} onClick={() => setTab(3)}>
              {tab === 3 ? <img src={locationActive} /> : <ReactSVG src={location} />}
              <span>Language & Region</span>
            </button>
            <button className={`custom-tab-btn ${tab === 4 ? "active" : ""}`} onClick={() => setTab(4)}>
              <img src={tab === 4 ? frameActive : frame} /> <span>Account Security</span>
            </button>
          </div>
          <div className="ctm-form px-0" style={{ marginTop: "20px" }}>
            {tab === 1 && <ProfileSettings getCities={getCities} cities={cities} setCities={setCities} country={country} setCountry={setCountry} isLoading={isLoading} setIsLoading={setIsLoading}  register={register} handleSubmit={handleSubmit} setValue={setValue} reset={reset} />}
            {tab === 2 && <NotificationSettings />}
            {tab === 3 && <LanguageRegion />}
            {tab === 4 && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
