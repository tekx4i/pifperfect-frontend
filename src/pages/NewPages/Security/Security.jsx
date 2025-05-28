import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Card, Table, CardBody, Col, Container, CardHeader, Nav, NavItem, NavLink, Row, Modal, ModalHeader, Form, ModalBody, Label, Input, FormFeedback } from "reactstrap";
import crownIcon from "../../../assets/newImages/crown.svg";
import profileIcon from "../../../assets/newImages/profile-tick.svg";
import userIcon from "../../../assets/newImages/user-octagon.svg";
import graphIcon from "../../../assets/newImages/graph.png";
import graphiconActive from "../../../assets/newImages/graph.svg";
import userIconActive from "../../../assets/newImages/user-octagon-active.svg";
import profileActive from "../../../assets/newImages/profile-tick-active.svg";
import crownActive from "../../../assets/newImages/crown-2.svg";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { ReactSVG } from "react-svg";
import "./styles.scss";

const AssignPermissions = lazy(() => import("./Components/AssignPermissions"));

const Security = () => {

  document.title = "Security | PIFPerfect";
  const [tab, setTab] = useState(1);
  const [roleId, setRoleId] = useState(1)


  return (
    <div className="page-content" id="user-management">
      <div>
        {/* <BreadCrumb title="Orders" pageTitle="Ecommerce" /> */}
        <div className="cuxstom-header-ctm">
          {/* <h4>Security & Access</h4> */}
          <div className="add-btns"></div>
        </div>
        <div className="custom-container">
          <div className="col-md-6 p-0 bg-danger">
            <h4 className="custom-header-ctm ps-0">Security & Access</h4>
          </div>
          <div className="custom-tabs">
            <button className={`custom-tab-btn ${tab === 1 ? "active" : ""}`} onClick={() => { setTab(1); setRoleId(1) }}>
              <ReactSVG src={tab === 1 ? crownIcon : crownActive} /> <span>Super Admin</span>
            </button>
            <button className={`custom-tab-btn ${tab === 2 ? "active" : ""}`} onClick={() => { setTab(2); setRoleId(2) }}>
              <ReactSVG src={tab === 2 ? profileActive : profileIcon} /> <span>Company Admin</span>
            </button>
            <button className={`custom-tab-btn ${tab === 3 ? "active" : ""}`} onClick={() => { setTab(3); setRoleId(3) }}>
              <ReactSVG src={tab === 3 ? userIconActive : userIcon} /> <span>Sales Manager</span>
            </button>
            <button className={`custom-tab-btn ${tab === 4 ? "active" : ""}`} onClick={() => { setTab(4); setRoleId(4) }}>
              <img src={tab === 4 ? graphiconActive : graphIcon} /> <span>Sales Representative</span>
            </button>
          </div>
          <form className="ctm-form mt-0 px-0">
            <Suspense fallback={"Loading.."}>
              <AssignPermissions tab={tab} roleId={roleId} />
            </Suspense>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Security;
