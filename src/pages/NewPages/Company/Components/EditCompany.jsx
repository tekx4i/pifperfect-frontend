import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import leftArrow from "../../../../assets/newImages/arrow-left.svg";
import closeIcon from "../../../../assets/newImages/close-circle.svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import calenderIcon from "../../../../assets/newImages/calendar.svg";
import galleryUpload from "../../../../assets/newImages/gallery-export.svg";
import "./styles.scss";
import { Link } from "react-router-dom";
import { FormGroup, Input } from "reactstrap";

const EditNewCompany = () => {
  const [state, setState] = useState(true);
  const [estDate, setEstDate] = useState();
  const [joinDate, setJoinDate] = useState();
  const [image, setImage] = useState(null);

  document.title = "Edit Comapny | PIFPerfect";

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to reset the image and file input
  const handleRemoveImage = () => {
    setImage(null);
    document.getElementById("fileInput").value = "";
  };

  return (
    <div className="page-content" id="edit-company">
      <div>
        {/* <BreadCrumb title="Orders" pageTitle="Ecommerce" /> */}
        <div className="custom-header-ctm">
          <Link to="/company/team">
            <h4 className="d-flex">
              <ReactSVG src={leftArrow} /> <span>Edit Company</span>
            </h4>
          </Link>
        </div>
        <div className="ctm-form">
          <form>
            <h5>Legal Details</h5>
            <div className="row">
              <div className="col-md-6">
                <input className="form-control" placeholder="Company Name" />
              </div>
              <div className="col-md-6 ps-md-1">
                <input
                  className="form-control"
                  placeholder="Trademark Number"
                />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="License Number" />
              </div>
              <div className="col-md-6 ps-md-1">
                <select className="form-select">
                  <option>Industry Type</option>
                </select>
              </div>
            </div>
            <hr className="ctm-hr" />
            <h5>Location Details</h5>
            <div className="row">
              <div className="col-md-6">
                <select className="form-select">
                  <option>Select Country</option>
                </select>
              </div>
              <div className="col-md-6 ps-md-1">
                <select className="form-select">
                  <option>Select City</option>
                </select>
              </div>
              <div className="col-md-12">
                <input className="form-control" placeholder="License Number" />
              </div>
            </div>

            <hr className="ctm-hr" />
            <div className="row">
              <div className="col-md-6">
                <h5>Joining Date</h5>
                {!joinDate ? (
                  <button
                    className="date_ctm"
                    onClick={() => setJoinDate(true)}
                  >
                    <p>12/2/2024</p>
                    <ReactSVG src={calenderIcon} />
                  </button>
                ) : (
                  <input className="form-control" type="date" />
                )}
              </div>
              <div className="col-md-6">
                <h5>Established Date</h5>
                {!estDate ? (
                  <button className="date_ctm" onClick={() => setEstDate(true)}>
                    <p>12/2/2024</p>
                    <ReactSVG src={calenderIcon} />
                  </button>
                ) : (
                  <input className="form-control" type="date" />
                )}
              </div>
            </div>
            <hr className="ctm-hr" />
            <h5>Company Logo / Profile Image</h5>
            <div className="row">
              <div className="col-md-12">
                <div className="file_upload">
                  <ReactSVG src={galleryUpload} />
                  <p>
                    <strong>Upload </strong>or Drop an Image
                  </p>
                  <input
                    type="file"
                    id="fileInput" // Add an ID to the file input
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
            {image && (
              <div className="image-preview">
                <img
                  src={image}
                  alt="Company Logo"
                  className="uploaded-image"
                />
                {/* Add a button to remove the image */}
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                >
                  x
                </button>
              </div>
            )}
            <div className="submit-btns">
              <button className="custom_submit_btn">
                <ReactSVG src={refreshIcon} /> Add Company
              </button>
              <button className="custom_submit_btn danger">
                <ReactSVG src={closeIcon} /> Deactivate Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNewCompany;
