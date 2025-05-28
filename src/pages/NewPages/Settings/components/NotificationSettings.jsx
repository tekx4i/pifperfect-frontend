import React, { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import { FormGroup, Input } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { apiPut, apiGet } from "../../../../CustomHooks/useAuth";

const NotificationSettings = () => {
  const [user, setUser] = useState(null); // Ensure initial user is null
  const token = localStorage.getItem("token");
  const { handleSubmit, setValue, control } = useForm();
  const { REACT_APP_API_URL } = process.env

  // Get user ID from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser).id);
    }
  }, []);

  // Fetch notification settings when `user` is available
  useEffect(() => {
    const getSingleNotification = async () => {
      if (!user) return; // Wait until the user ID is set
      try {
        const url = `${REACT_APP_API_URL}users/${user}`;
        const response = await apiGet(url, {}, token);

        if (response.success) {
          const companyData = response.data;

          // Set the value dynamically
          setValue("pushNotification", companyData.pushNotification ? 1 : 0);
        }
      } catch (error) {
        console.error("Error fetching single user:", error);
      }
    };

    getSingleNotification();
  }, [user, setValue, token]); // Re-run if user or token changes

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const url = `${REACT_APP_API_URL}users/${user}`;
      const formData = new FormData();
      formData.append("pushNotification", data.pushNotification ? 1 : 0);

      const response = await apiPut(url, formData, token);
      if (response.success) {
        console.log("Notification settings updated successfully.");
      }
    } catch (error) {
      console.log("Error updating notification settings:", error);
    }
  };

  return (
    <div className="notification-settings">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Push Notifications</h5>
        <div className="row">
          <div className="col-md-12">
            <div className="switch_custom">
              <p>Allow to receive push notifications for user activities and logs count</p>
              <div className="switch">
                <FormGroup switch>
                  <Controller
                    name="pushNotification"
                    control={control}
                    defaultValue={0} // Default to 0 initially
                    render={({ field }) => (
                      <Input
                        type="switch"
                        checked={!!field.value} // Ensure boolean value for the switch
                        onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                      />
                    )}
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </div>
        <div className="submit-btns">
          <button type="submit" className="custom_submit_btn">
            <ReactSVG src={refreshIcon} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;
