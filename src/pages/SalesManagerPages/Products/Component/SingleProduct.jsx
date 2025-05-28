import React from "react";
import slack from "../../../../assets/newImages/slack.png";
import { Link } from "react-router-dom";
import editIcon from "../../../../assets/newImages/edit.svg";
import closeIcon from "../../../../assets/newImages/close-circle.svg";
import { ReactSVG } from "react-svg";
import trash from "../../../../assets/newImages/trash.svg";

const SingleProduct = ({
  deleteFunction,
  productName,
  id,
  productDescription,
  productImg,
  productPrice,
}) => {
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;

  return (
    <div
      style={{ height: "150px" }}
      className="sales-manager-single-product col-md-12 "
    >
      <div className=" h-100 d-flex align-items-center ">
        <img
          height={"100px"}
          width={"100px"}
          src={
            productImg
              ? `${REACT_APP_API_IMG_URL}${productImg}`
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          }
          className="me-3 rounded"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="title-desc h-100 d-flex justify-content-center flex-column ">
        <h6 className="">{productName}</h6>
        <small className=""> {productDescription}</small>
        <div className="pt-2">
          <b className="text-success ">${productPrice}</b>
        </div>
      </div>
      <div className="d-flex gap-2 action-btns">
        <Link
          to={`/sales-manager/products/edit/${id}`}
          className="action-btn edit"
        >
          <ReactSVG src={editIcon} />
        </Link>
        <Link
          className="action-btn delete"
          type="button"
          onClick={() => deleteFunction(id)}
        >
          <ReactSVG src={trash} />
        </Link>
      </div>
    </div>
  );
};

export default SingleProduct;
