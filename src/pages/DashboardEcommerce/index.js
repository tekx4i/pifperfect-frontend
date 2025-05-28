import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Widget from "./Widgets";
import BestSellingProducts from "./BestSellingProducts";
import RecentActivity from "./RecentActivity";
import RecentOrders from "./RecentOrders";
import Revenue from "./Revenue";
import SalesByLocations from "./SalesByLocations";
import Section from "./Section";
import StoreVisits from "./StoreVisits";
import TopSellers from "./TopSellers";
import "./styles.scss";

const DashboardEcommerce = () => {
  document.title = "Dashboard | PIFPerfect";

  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="custom-container  mt-0">
          <Row>
            <Col>
              <div className="h-100">
                {/* <Section rightClickBtn={toggleRightColumn} /> */}
                <Row>{/* <Widget /> */}</Row>
                <Row>
                  <Col xl={12}>
                    <Revenue />
                  </Col>
                  {/* <SalesByLocations /> */}
                </Row>
                <Row>
                  {/* <BestSellingProducts /> */}
                  {/* <TopSellers /> */}
                </Row>
                <Row>
                  {/* <StoreVisits /> */}
                  <Col xl={12}>
                    <RecentOrders />
                  </Col>
                </Row>
              </div>
            </Col>
            {/* <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} /> */}
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
