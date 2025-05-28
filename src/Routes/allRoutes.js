import React from "react";
import { Navigate } from "react-router-dom";
import { useUserInfo } from "../Context/UserContext"; // Assume context is set up
// Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";

// Widgets
// import Widgets from "../pages/Widgets/Index";

// Tables
import BasicTables from "../pages/Tables/BasicTables/BasicTables";

// API Key
// import APIKey from "../pages/APIKey/index";

// Authentication Pages
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";

// New Pages
import Company from "../pages/NewPages/Company/Company";
import Reporting from "../pages/NewPages/Reporting/Reporting";

import UserManagement from "../pages/NewPages/UserManagement/UserManagement";
import UserManagementAdd from "../pages/NewPages/UserManagement/Components/AddNewUser";
import UserManagementRole from "../pages/NewPages/UserManagement/Components/Role";
import EditUser from "../pages/NewPages/UserManagement/Components/EditNewUser";
import Metrics from "../pages/NewPages/Metrics/Metrics";
import BillingInfo from "../pages/NewPages/BillingInfo/BillingInfo";
import BillingDetail from "../pages/NewPages/BillingInfo/Component/BillingDetail";
import AddNewCompany from "../pages/NewPages/Company/Components/AddCompany";
import EditNewCompany from "../pages/NewPages/Company/Components/EditCompany";
import SubmitNumber from "../pages/SetterRepPages/SubmitNumbers/SubmitNumber";
import Reports from "../pages/NewPages/Reports/Reports";
import Settings from "../pages/NewPages/Settings/Settings";
import Security from "../pages/NewPages/Security/Security";
import Sample from "../pages/NewPages/Sample/Sample";

// Company Pages
import MetricGoal from "../pages/CompanyPages/MetricGoals/MetricGoal";
import Team from "../pages/CompanyPages/Teams/Team";
import AddTeam from "../pages/CompanyPages/Teams/Components/AddTeam";
import EditTeam from "../pages/CompanyPages/Teams/Components/AddTeam";
import DataEntry from "../pages/CompanyPages/DataEntry/DataEntry";
import AddDataEntry from "../pages/CompanyPages/DataEntry/Components/AddDataEntry";
import EditDataEntry from "../pages/CompanyPages/DataEntry/Components/AddDataEntry";
import CompanySettings from "../pages/CompanyPages/CompanySettings/CompanySettings";

// Sales Manager Pages
import ProductList from "../pages/SalesManagerPages/Products/ProductList";
import SubmitVia from "../pages/SetterRepPages/SubmitVia/SubmitVia";

import AddProduct from "../pages/SalesManagerPages/Products/AddProduct";
import EditProduct from "../pages/SalesManagerPages/Products/EditProduct";
import SalesTeam from "../pages/SalesManagerPages/Teams/Team";
import AddSalesTeam from "../pages/SalesManagerPages/Teams/Components/AddTeam";
import EditSalesTeam from "../pages/SalesManagerPages/Teams/Components/AddTeam";
import Projections from "../pages/SalesManagerPages/Projections/Projections";
// Setter Gap Pages
// import SubmitNumber from "../pages/SetterRepPages/SubmitNumbers/SubmitNumber";

// Role Protected Route Component
const RoleProtectedRoute = ({ allowedRoles, component }) => {
  const { updateUserInfo, userInfo } = useUserInfo();

  // If the user's role is NOT in the allowedRoles array, redirect to "Not Authorized" page
  if (userInfo && !allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/not-authorized" />;
  }

  return component; // Render the component if the user is authorized
};

// Routes
const authProtectedRoutes = [
  // { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/dashboard", component: <Reporting /> },

  { path: "sample", component: <Sample /> },

  // User Management
  {
    path: "/user-management",
    component: (
      <RoleProtectedRoute
        allowedRoles={[1]} // Only role 2 can access
        component={<UserManagement />}
      />
    ),
  },
  { path: "/user-management/add", component: <UserManagementAdd /> },
  { path: "/user-management/edit/:id", component: <EditUser /> },
  { path: "/user-management/role", component: <UserManagementRole /> },
  { path: "/user-management/company/:id", component: <UserManagement /> },

  {
    path: "/metrics",
    component: (
      <RoleProtectedRoute
        allowedRoles={[1]} // Only role 2 can access
        component={<Metrics />}
      />
    ),
  },

  // Company Pages
  {
    path: "/company",
    component: (
      <RoleProtectedRoute
        allowedRoles={[1]} // Only role 2 can access
        component={<Company />}
      />
    ),
  },
  { path: "/company/add", component: <AddNewCompany /> },
  // { path: "/company/add/:id", component: <EditNewCompany /> },
  { path: "/company/add/:id", component: <AddNewCompany /> },

  {
    path: "/company/metric-goal",
    // component:<MetricGoal />

    component: (
      <RoleProtectedRoute
        allowedRoles={[1,2]} // Only role 2 can access
        component={<MetricGoal />}
      />
    ),
  },
  {
    path: "/company/team",
    component: (
      <RoleProtectedRoute
        allowedRoles={[2]} // Only role 2 can access
        component={<Team />}
      />
    ),
  },
  { path: "/company/team/add", component: <AddTeam /> },
  { path: "/company/team/edit/:id", component: <AddTeam /> },

  {
    path: "/company/reporting",
    component: (
      <RoleProtectedRoute
        allowedRoles={[2, 3, 4]} // Only role 2 can access
        component={<Reporting />}
      />
    ),
  },

  // Restricted Data Entry Routes (Only role 2 can access)
  {
    path: "/company/data-entry",
    component: (
      <RoleProtectedRoute
        allowedRoles={[2, 3, 4]} // Only role 2 can access
        component={<DataEntry />}
      />
    ),
  },
  {
    path: "/company/data-entry/add",
    component: (
      <RoleProtectedRoute
        allowedRoles={[2]} // Only role 2 can access
        component={<AddDataEntry />}
      />
    ),
  },
  {
    path: "/company/data-entry/:id",
    component: (
      <RoleProtectedRoute
        allowedRoles={[2, 3, 4]} // Only role 2 can access
        component={<EditDataEntry />}
      />
    ),
  },

  { path: "/settings", component: <Settings /> },

  { path: "/company/settings", component: <CompanySettings /> },

  // Billing
  { path: "/billing", component: <BillingInfo /> },
  { path: "/billing/detail/:id", component: <BillingDetail /> },

  // Reports and Security
  { path: "/reports", component: <Reports /> },
  {
    path: "/security",
    component: (
      <RoleProtectedRoute
        allowedRoles={[1]} // Only role 2 can access
        component={<Security />}
      />
    ),
  },

  // Widgets and Tables
  // { path: "/widgets", component: <Widgets /> },
  { path: "/tables-basic", component: <BasicTables /> },

  // API Key
  // { path: "/apps-api-key", component: <APIKey /> },

  // User Profile
  { path: "/profile", component: <UserProfile /> },

  // Sales Manager
  {
    path: "/sales-manager/products",
    component: (
      <RoleProtectedRoute
        allowedRoles={[3]} // Only role 2 can access
        component={<ProductList />}
      />
    ),
  },

  { path: "/sales-manager/products/add", component: <AddProduct /> },
  { path: "/sales-manager/products/edit/:id", component: <EditProduct /> },

  // ----------
  {
    path: "/sale-rep/submit-numbers",
    component: (
      <RoleProtectedRoute
        allowedRoles={[4]} // Only role 2 can access
        component={<SubmitVia />}
      />
    ),
  },

  { path: "/sales-manager/products/add", component: <AddProduct /> },
  { path: "/sales-manager/products/edit/:id", component: <EditProduct /> },
  // -------------

  {
    path: "/company/products",
    component: (
      <RoleProtectedRoute
        allowedRoles={[2]} // Only role 2 can access
        component={<ProductList />}
      />
    ),
  },

  { path: "/company/products/add", component: <AddProduct /> },
  { path: "/company/products/edit/:id", component: <EditProduct /> },

  {
    path: "/sales-manager/team",

    component: (
      <RoleProtectedRoute
        allowedRoles={[3]} // Only role 2 can access
        component={<SalesTeam />}
      />
    ),
  },
  { path: "/sales-manager/team/add", component: <AddSalesTeam /> },
  { path: "/sales-manager/team/:id", component: <EditSalesTeam /> },

  // Setter Gap
  {
    path: "/setter-gap/submit-numbers",
    component: (
      <RoleProtectedRoute
        allowedRoles={[2, 3, 4]} // Only role 2 can access
        component={<SubmitNumber />}
      />
    ),
  },

  // Projections
  {
    path: "/projections",
    component: (
      <RoleProtectedRoute
        allowedRoles={[2, 3, 4]} // Only role 2 can access
        component={<Projections />}
      />
    ),
  },

  // Default Routes
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
