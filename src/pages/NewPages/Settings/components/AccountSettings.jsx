import { React, useState } from "react";
import { ReactSVG } from "react-svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import authenticateUser from "../../../../assets/newImages/security-user.png";
import lockIcon from "../../../../assets/newImages/lock.svg";
import { useForm, Controller } from "react-hook-form";
import { apiPost } from "../../../../CustomHooks/useAuth";
import { useSSR } from "react-i18next";

const AccountSettings = () => {
  const [passMatchError, setPassMatchError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({});
  const { REACT_APP_API_URL } = process.env;

  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    // if (data.newPassword == 0 && data.newPasswordConfirm == 0) {
    //   return;
    // }

    if (data.newPassword != data.newPasswordConfirm) {
      setPassMatchError(true);
      return;
    }
    try {
      // setIsLoading(true);
      const url = `${REACT_APP_API_URL}auth/changePassword`;

      // const formData = new FormData();
      // formData.append("oldPassword", data.oldPassword);
      // formData.append("newPassword", data.newPassword);
      // formData.append("retypePassword", data.newPasswordConfirm);

      const params = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        retypePassword: data.newPasswordConfirm,
      };

      const response = await apiPost(url, params, token);
      if (response.success) {
        // setIsLoading(false);
        reset();
      }
    } catch (error) {
      console.log(error);
      // setIsLoading(false);
    }
  };

  return (
    <div className="account-settings">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Change Password</h5>
        <div className="row">
          <div className="col-md-6 position-relative">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Old Password"
              {...register("oldPassword", {
                required: "Old Password is required",
              })}
            />

            <div className="input-icon">
              <ReactSVG src={lockIcon} />
            </div>

            {errors?.oldPassword && (
              <label className="text-danger mt-1">
                {errors?.oldPassword.message}
              </label>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 position-relative">
            <input
              type="password"
              className="form-control"
              placeholder="Enter New Password"
              {...register("newPassword", {
                required: "New Password is required",
              })}
            />
            <div className="input-icon">
              <ReactSVG src={lockIcon} />
            </div>
            <label className="text-danger mt-1">
              {errors?.newPassword?.message}
            </label>
          </div>
          <div className="col-md-6 position-relative">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm New Password"
              {...register("newPasswordConfirm", {
                required: "Confirm Password is required",
              })}
            />
            <div className="input-icon">
              <ReactSVG src={lockIcon} />
            </div>
            <label className="text-danger mt-1">
              {errors?.newPasswordConfirm?.message}
            </label>

            {passMatchError ? (
              <label className="text-danger">
                Confirm Password Not Matched
              </label>
            ) : (
              ""
            )}
          </div>
        </div>
        <hr className="ctm-hr" />
        {/* <div className="authenticate_now">
          <h4>2 Factor Authentication (2FA)</h4>
          <button className="custom_submit_btn primary">
            <img src={authenticateUser} /> <span>Authenticate Now</span>
          </button>
        </div> */}
        <div className="submit-btns">
          <button className="custom_submit_btn">
            <ReactSVG src={refreshIcon} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
