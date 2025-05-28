import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import RecentOrders from "./RecentOrders";
import Revenue from "./Revenue";
import "./styles.scss";

const DashboardEcommerce = () => {
  document.title = "Dashboard | PIFPerfect";

  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content" id="authenticate-repo">
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
                    <div className="custom-card">
                      <ul>
                        {[1, 2, 3, 4].map(() => (
                          <li>
                            <div>Show Rate</div>
                            <div className="detail-text">97%</div>
                          </li>
                        ))}
                      </ul>
                    </div>
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
