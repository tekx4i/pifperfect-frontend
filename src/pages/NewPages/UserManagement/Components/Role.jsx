import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import leftArrow from "../../../../assets/newImages/arrow-left.svg";
import closeIcon from "../../../../assets/newImages/close-circle.svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import "./style.scss";
import { FormGroup, Input } from "reactstrap";
import { Link } from "react-router-dom";

const Role = () => {
  const [state, setState] = useState(true);

  document.title = "Company | PIFPerfect";
  return (
    <div className="page-content" id="role_based">
      <div>
        {/* <BreadCrumb title="Orders" pageTitle="Ecommerce" /> */}
        <div className="custom-header-ctm">
          <Link to="/user-management">
            <h4 className="d-flex">
              <ReactSVG src={leftArrow} /> <span>Role Base Access Control</span>
            </h4>
          </Link>
        </div>
        <div className="ctm-form">
          <form>
            <h5>User Details</h5>
            <div className="row">
              <div className="col-md-6">
                <input className="form-control" placeholder="First Name" />
              </div>
              <div className="col-md-6 ps-md-1">
                <input className="form-control" placeholder="Last Name" />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="Phone Number" />
              </div>
              <div className="col-md-6 ps-md-1">
                <input className="form-control" placeholder="Email Address" />
              </div>
            </div>
            <hr className="ctm-hr" />
            <div className="row">
              <div className="col-md-6">
                <h5>User Role</h5>
                <select className="form-select">
                  <option>Choose Candidate Role</option>
                </select>
              </div>
              <div className="col-md-6">
                <h5>Select Company</h5>
                <select className="form-select">
                  <option>Select Any Listed Company</option>
                </select>
              </div>
            </div>
            <hr className="ctm-hr" />
            <h5>User Permissions</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="switch_custom">
                  <p>Can edit user details</p>
                  <div className="switch">
                    <FormGroup switch>
                      <Input
                        type="switch"
                        checked={state}
                        onClick={() => {
                          setState(!state);
                        }}
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="switch_custom">
                  <p>Can track user’s performance</p>
                  <div className="switch">
                    <FormGroup switch>
                      <Input
                        type="switch"
                        checked={state}
                        onClick={() => {
                          setState(!state);
                        }}
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="switch_custom">
                  <p>Can add new candidates in any company</p>
                  <div className="switch">
                    <FormGroup switch>
                      <Input
                        type="switch"
                        checked={state}
                        onClick={() => {
                          setState(!state);
                        }}
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="switch_custom">
                  <p>Can access / generate custom reports anytime</p>
                  <div className="switch">
                    <FormGroup switch>
                      <Input
                        type="switch"
                        checked={state}
                        onClick={() => {
                          setState(!state);
                        }}
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
            <div className="submit-btns">
              <button className="custom_submit_btn">Save Details</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Role;
