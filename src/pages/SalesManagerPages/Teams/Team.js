import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import SkeletonLoader from "../../../helpers/SkeltonLoader";
import userDummy from "../../../assets/newImages/about.jpg";
import editIcon from "../../../assets/newImages/edit.svg";
import closeIcon from "../../../assets/newImages/close-circle.svg";
import { apiGet, apiPut } from "../../../CustomHooks/useAuth";
import dayjs from "dayjs"
import { CiSearch } from "react-icons/ci";


const Company = () => {
  const [isLoading, setIsLoading] = useState(true); // Default to true
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env
  const [companyId, setCompanyId] = useState()
  const [data, setData] = useState()
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const getCompanies = async (query="") => {
    setIsLoading(true);
    try {
      // const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/companies`;

      const url = `${REACT_APP_API_URL}companies/${companyId}/users?roleId=${data.role}&name=${query}`;

      const response = await apiGet(url, {}, token);

      if (response.success) {
        setUsers(response.data.records);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      getCompanies();
    }
  }, [companyId]);

  const deactivateCompany = async (id, currentStatus) => {
    if (!token) {
      console.error("Authorization token is missing.");
      return;
    }
    try {
      const url = `${REACT_APP_API_URL}users/${id}`;
      const params = { isBlocked: !currentStatus }; // Toggle the current status
      const response = await apiPut(url, params, token);

      if (response.success) {
        // Update the user's status in the local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, isActive: !currentStatus } : user
          )
        );
      } else {
        console.error("Failed to update the user's status.");
      }
    } catch (error) {
      console.error("Error toggling company status:", error);
    }
  };



  //   useEffect(() => {
  //     if (getSingle) {

  //         editSetValue("value", getSingle.Value);
  //         editSetValue("expiration", formattedExpiration)
  //         editSetValue("user_id", getSingle.User);
  //         editSetValue("limit", getSingle.Limit);

  //     }
  // }, [getSingle, editDistributor]);

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setCompanyId(JSON.parse(storedUser).companyId); // Parse the JSON string
      setData(JSON.parse(storedUser)); // Parse the JSON string

    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault()
    // const value = e.target.value;

    // setSearchQuery(value);

    // Debounced search
    setTimeout(() => {
      getCompanies(searchQuery); // Fetch data based on search query
    }, 500);
  };

  return (
    <div className="page-content" id="companies">
      <div className="custom-header-ctm">
        <div className="row w-100 m-0">
          <div className="col-md-6 p-0">
            <h4 className="w-100">All Team Members</h4>

          </div>
          <div className="col-md-6 p-0 ">
            <div className="add-btns justify-conten-end">
              <div className="">
                <form onSubmit={handleSearch}>
                  <div className="search-ctm">
                    <input
                      placeholder="Search company by name"
                      value={searchQuery}
                      // onChange={handleSearch} // Handle input change
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit"><CiSearch /></button>
                  </div>
                </form>              </div>
              <Link to="/sales-manager/team/add" className="default__btn">
                <span>Add Sales Team Member</span>
              </Link>
            </div>
          </div>
        </div>
      </div>


      <div className="custom-container ">
        <div className="table-responsive mt-5">
          {(
            // Show the table when data is loaded
            <Table className="align-middle table-nowrap mb-0">
              <thead>
                <tr>
                  <th scope="col">User Name</th>
                  <th scope="col">Recent Login Time</th>
                  <th scope="col">Address</th>
                  <th scope="col">Location</th>
                  <th scope="col">Sales Target</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  isLoading ? (
                    // Show SkeletonLoader when loading
                    <SkeletonLoader rows={4} columns={[200, 150, 100, 150, 100, 150]} width="100%" height={40} />
                  ) :

                    users.length > 0 ? (

                      users.map((user) => (
                        <tr key={user?.id}>
                          <td className="fw-medium">
                            <div className="user-img">
                              <img
                                src={user.image ? `${REACT_APP_API_IMG_URL}${user.image}` : "https://www.londondentalsmiles.co.uk/wp-content/uploads/2017/06/person-dummy.jpg"}
                                alt="user"
                              />
                              {user?.firstName} {user.id}
                            </div>

                          </td>
                          <td>
                            <span className="ctm-badge warning">{user.lastName}</span>
                          </td>
                          <td>{user.address}</td>

                          {/* <td>{user.isTaxable ? "Yes" : "No"}</td> */}
                          <td>{dayjs(user.joinDate).format("DD-MM-YYYY")}</td>
                          <td>{dayjs(user.establishedDate).format("DD-MM-YYYY")}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link
                                onClick={() => deactivateCompany(user?.id, user.isActive)} // Pass user.id and the current status
                                className={`action-btn ${user.isActive ? "deactivate" : "activate"}`}
                              >
                                <ReactSVG src={closeIcon} />
                                {user.isActive ? "Deactivate" : "Activate"}
                              </Link>

                              <Link to={`/sales-manager/team/${user.id}`} className="action-btn edit">
                                <ReactSVG src={editIcon} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))) :
                      (
                        <tr>
                          <td colSpan={5} className="text-center" style={{ verticalAlign: "center" }}>
                            No Data Found
                          </td>
                        </tr>
                      )
                }

              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Company;
