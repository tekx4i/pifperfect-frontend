import React, { useState, useEffect } from "react";
import { FormGroup, Input } from "reactstrap";
import { apiGet, apiPut } from "../../../../CustomHooks/useAuth";
import { ReactSVG } from "react-svg";
import refreshIcon from "../../../../assets/newImages/refresh-2.svg";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"; // Professional skeleton loader library
import "react-loading-skeleton/dist/skeleton.css";

const AssignPermissions = ({ tab, roleId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [data, setData] = useState({});
  const [checkedPermissions, setCheckedPermissions] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  const { REACT_APP_API_URL } = process.env;

  const handleToggle = (permissionId) => {
    setCheckedPermissions((prev) => {
      const updatedPermissions = prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId];

      setIsUpdated(true);
      return updatedPermissions;
    });
  };

  const getPermissions = async () => {
    setIsLoading(true);
    try {
      const url = `${REACT_APP_API_URL}permissions/role/${roleId}`;
      const response = await apiGet(url, {}, token);

      if (response.success) {
        const allPermissions = response.data.allPermissions || [];

        const initialCheckedPermissions = [];
        allPermissions.forEach((category) => {
          category.permissions.forEach((permission) => {
            if (permission.role_permissions && permission.role_permissions.length > 0) {
              initialCheckedPermissions.push(permission.id);
            }
          });
        });

        setCheckedPermissions(initialCheckedPermissions);
        setData(response);
        setIsUpdated(false);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPermissions();
  }, [roleId]);

  const updatePermissions = async () => {
    if (!isUpdated) return;

    const params = {
      roleId: roleId,
      permissions: checkedPermissions,
    };

    try {
      const url = `${REACT_APP_API_URL}permissions/assign`;

      const response = await apiPut(url, params, token);
      if (response.success) {
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
    } finally {
      setIsUpdated(false);
    }
  };


  return (

    
      // data.data.allPermissions > 0 ? (
    <div id="assignPermission">
      {isLoading ? (
        <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
          <div className="skeleton-loader">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="skeleton-item">
                  <Skeleton width={200} height={25} />
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <Skeleton width={150} height={20} />
                      <Skeleton width={50} height={25} className="mt-2" />
                    </div>
                    <div className="col-md-6">
                      <Skeleton width={150} height={20} />
                      <Skeleton width={50} height={25} className="mt-2" />
                    </div>
                  </div>
                  <hr className="ctm-hr mt-4" />
                </div>
              ))}
          </div>
        </SkeletonTheme>
      ) : (
        data.data?.allPermissions?.map((category) => (
          <div key={category.id}>
            <h5>{category.name}</h5>
            <div className="row">
              {category.permissions.map((permission) => (
                <div className="col-md-6" key={permission.id}>
                  <div className="switch_custom">
                    <p>{permission.name}</p>
                    <div className="switch">
                      <FormGroup switch>
                        <Input
                          type="switch"
                          checked={checkedPermissions.includes(permission.id)}
                          onChange={() => handleToggle(permission.id)}
                        />
                      </FormGroup>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr className="ctm-hr" />
          </div>
        ))
      )}
      <button type="button" onClick={updatePermissions} className="custom_submit_btn">
        <ReactSVG src={refreshIcon} />Save Changes
      </button>
    </div>
      )

    // : "asdasdasd"
    
    
  // );
};

export default AssignPermissions;
