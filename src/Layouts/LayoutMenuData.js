import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dashboardIcon from "../assets/newImages/dashboard.svg";
import dashboardWhiteIcon from "../assets/images/menusvg/dahboard-white.svg";
import userManagement from "../assets/newImages/user-management.svg";
import company from "../assets/newImages/companies.svg";
import metrics from "../assets/newImages/metrics.svg";
import report from "../assets/newImages/reports.svg";
import security from "../assets/newImages/security.svg";
import settings from "../assets/newImages/setting.svg";
import billing from "../assets/newImages/billing.svg";
import userManagementActive from "../assets/newImages/user-managementActive.svg";
// active icon
import dashboardActive from "../assets/activetabs/dashboard-active.svg";
import companyActive from "../assets/activetabs/companies-active.svg";
import reportActive from "../assets/activetabs/chart.svg";
import metricsActive from "../assets/activetabs/metrics-active.svg";
import securityActive from "../assets/activetabs/security-active.svg";
import umActive from "../assets/activetabs/user-manag-active.svg";
import settingActive from "../assets/activetabs/setting-active.svg";
import chartActive from "../assets/activetabs/report-active.svg";
import { useUserInfo } from "../Context/UserContext";

const Navdata = () => {
  const history = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState("");
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isApps, setIsApps] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isBaseUi, setIsBaseUi] = useState(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState(false);
  const [isForms, setIsForms] = useState(false);
  const [isTables, setIsTables] = useState(false);
  const [isCharts, setIsCharts] = useState(false);
  const [isIcons, setIsIcons] = useState(false);
  const [isMaps, setIsMaps] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);
  // New Pages
  const [iscompany, setIsCompany] = useState(false);
  const [isManage, setIsManage] = useState(false);
  const [isMetrics, setIsMetrics] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [isSecurity, setIsSecurity] = useState(false);
  const [isBilling, setIsBilling] = useState(false);
  const [isSetting, setIsSetting] = useState(false);

  const [isLanding, setIsLanding] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");
  const { userData, updateUserInfo, userInfo } = useUserInfo();

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }
    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState !== "Landing") {
      setIsLanding(false);
    }
    // New pages
    if (iscurrentState !== "Companies") {
      setIsCompany(false);
    }
    if (iscurrentState !== "Management") {
      setIsManage(false);
    }
    if (iscurrentState !== "metrics") {
      setIsMetrics(false);
    }
    if (iscurrentState !== "reports") {
      setIsReport(false);
    }
    if (iscurrentState !== "security") {
      setIsReport(false);
    }
    if (iscurrentState !== "billing") {
      setIsBilling(false);
    }

    if (iscurrentState !== "Settings") {
      setIsSetting(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
    // New pages
    isManage,
    isReport,
    isBilling,
    isMetrics,
    isSecurity,
    isSetting,
    iscompany,
  ]);

  const [role, setRole] = useState();
  console;
  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setRole(JSON.parse(storedUser).role); // Parse the JSON string
    }
  }, [userInfo]);

  let menuItems = [];

  if (role == 1) {
    menuItems = [
      {
        label: "Menu",
        isHeader: true,
      },

      {
        id: "dashboard",
        label: "Dashboard",
        icon: "ri-honour-line",
        iconSVG:
          isActive === "dashboard" ? userManagementActive : dashboardIcon,
        link: "/dashboard",
        activeSVG: dashboardActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("dashboard");
          setIsActive("dashboard");
          updateIconSidebar(e);
        },
      },

      // {
      //   id: "reporting_dashboard",
      //   label: "Reporting Dashboard",
      //   // icon: "ri-honour-line",
      //   iconSVG:
      //     isActive === "submit_number" ? userManagementActive : userManagement,
      //   link: "/company/reporting",
      //   activeSVG: umActive,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIscurrentState("submit_number");
      //     setIsActive("submit_number");
      //     updateIconSidebar(e);
      //   },
      // },
      // {
      //   id: "Management",
      //   label: "Sample",
      //   // icon: "ri-honour-line",
      //   iconSVG:
      //     isActive === "Management" ? userManagementActive : userManagement,
      //   link: "/sample",
      //   activeSVG: umActive,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIscurrentState("Management");
      //     setIsActive("Management");
      //     updateIconSidebar(e);
      //   },
      // },
      {
        id: "Management",
        label: "User Management",
        // icon: "ri-honour-line",
        iconSVG:
          isActive === "Management" ? userManagementActive : userManagement,
        link: "/user-management",
        activeSVG: umActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("Management");
          setIsActive("Management");
          updateIconSidebar(e);
        },
      },
      {
        id: "Companies",
        label: "Companies",
        // icon: "ri-honour-line",
        iconSVG: isActive === "Companies" ? userManagementActive : company,
        link: "/company",
        activeSVG: companyActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("Companies");
          setIsActive("Companies");
          updateIconSidebar(e);
        },
      },

      {
        id: "metrics",
        label: "Metrics & Goals",
        // icon: "ri-honour-line",
        iconSVG: isActive === "metrics" ? userManagementActive : metrics,
        link: "/company/metric-goal",
        activeSVG: metricsActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("metrics");
          setIsActive("metrics");
          updateIconSidebar(e);
        },
      },

      // {
      //   id: "metrics",
      //   label: "Metrics & Goals",
      //   // icon: "ri-honour-line",
      //   iconSVG: isActive === "metrics" ? userManagementActive : metrics,
      //   link: "/metrics",
      //   activeSVG: metricsActive,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIscurrentState("metrics");
      //     setIsActive("metrics");
      //     updateIconSidebar(e);
      //   },
      // },
      {
        id: "reports",
        label: "Reports & Analytics",
        // icon: "ri-honour-line",
        iconSVG: isActive === "reports" ? userManagementActive : report,
        link: "/reports",
        activeSVG: reportActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("reports");
          setIsActive("reports");
          updateIconSidebar(e);
        },
      },

      {
        id: "security",
        label: "Security & Access",
        // icon: "ri-honour-line",
        iconSVG: isActive === "security" ? userManagementActive : security,
        link: "/security",
        activeSVG: securityActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("security");
          setIsActive("security");
          updateIconSidebar(e);
        },
      },
      {
        id: "billing",
        label: "Billing Information",
        // icon: "ri-honour-line",
        iconSVG: isActive === "billing" ? userManagementActive : billing,
        link: "/billing",
        activeSVG: chartActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("billing");
          setIsActive("billing");
          updateIconSidebar(e);
        },
      },

      {
        id: "Settings",
        label: "Settings",
        // icon: "ri-honour-line",
        iconSVG: isActive === "Settings" ? userManagementActive : settings,
        link: "/settings",
        activeSVG: settingActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("Settings");
          setIsActive("Settings");
          updateIconSidebar(e);
        },
      },

      {
        label: "pages",
        isHeader: true,
      },
    ];
  }

  if (role == 2) {
    menuItems = [
      {
        label: "Menu",
        isHeader: true,
      },

      // {
      //   id: "dashboard",
      //   label: "Dashboard",
      //   // icon: "ri-honour-line",
      //   iconSVG:
      //     isActive === "dashboard" ? userManagementActive : dashboardIcon,
      //   link: "/dashboard",
      //   activeSVG: dashboardActive,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIscurrentState("dashboard");
      //     setIsActive("dashboard");
      //     updateIconSidebar(e);
      //   },
      // },

      {
        id: "reporting_dashboard",
        // label: "Reporting Dashboard",
        // label: "Reports & Analystics",
        label: "Dashboard",

        // icon: "ri-honour-line",
        iconSVG:
          isActive === "submit_number" ? userManagementActive : userManagement,
        // link: "/company/reporting",
        link: "/dashboard",

        activeSVG: umActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("submit_number");
          setIsActive("submit_number");
          updateIconSidebar(e);
        },
      },

      {
        id: "Team",
        label: "Team",
        // icon: "ri-honour-line",
        iconSVG: isActive === "Team" ? userManagementActive : userManagement,
        link: "/company/team",
        activeSVG: umActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("Team");
          setIsActive("Team");
          updateIconSidebar(e);
        },
      },

      {
        id: "products",
        label: "Products",
        // icon: "ri-honour-line",
        iconSVG: isActive === "products" ? userManagementActive : metrics,
        link: "/company/products",
        activeSVG: metricsActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("products");
          setIsActive("products");
          updateIconSidebar(e);
        },
      },

      {
        id: "metrics",
        label: "Metrics & Goals",
        // icon: "ri-honour-line",
        iconSVG: isActive === "metrics" ? userManagementActive : metrics,
        link: "/company/metric-goal",
        activeSVG: metricsActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("metrics");
          setIsActive("metrics");
          updateIconSidebar(e);
        },
      },

      {
        id: "data_entry",
        label: "Data Entry",
        // icon: "ri-honour-line",
        iconSVG: isActive === "data_entry" ? userManagementActive : report,
        link: "/company/data-entry",
        activeSVG: reportActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("data_entry");
          setIsActive("data_entry");
          updateIconSidebar(e);
        },
      },

      {
        id: "projections",
        label: "Projections",
        // icon: "ri-honour-line",
        iconSVG: isActive === "products" ? userManagementActive : metrics,
        link: "/projections",
        activeSVG: metricsActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("products");
          setIsActive("products");
          updateIconSidebar(e);
        },
      },

      // {
      //   id: "submit_number",
      //   label: "Submit Numbers",
      //   // icon: "ri-honour-line",
      //   iconSVG:
      //     isActive === "submit_number" ? userManagementActive : userManagement,
      //   link: "/setter-gap/submit-numbers",
      //   activeSVG: umActive,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIscurrentState("submit_number");
      //     setIsActive("submit_number");
      //     updateIconSidebar(e);
      //   },
      // },

      // {
      //   id: "reports",
      //   label: "Reports & Analytics",
      //   // icon: "ri-honour-line",
      //   iconSVG: isActive === "reports" ? userManagementActive : report,
      //   link: "/reports",
      //   activeSVG: reportActive,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIscurrentState("reports");
      //     setIsActive("reports");
      //     updateIconSidebar(e);
      //   },
      // },

      {
        id: "Settings",
        label: "Settings",
        // icon: "ri-honour-line",
        iconSVG: isActive === "Settings" ? userManagementActive : settings,
        link: "/settings",
        activeSVG: settingActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("Settings");
          setIsActive("Settings");
          updateIconSidebar(e);
        },
      },

      {
        label: "pages",
        isHeader: true,
      },
    ];
  }

  if (role == 3) {
    menuItems = [
      {
        label: "Menu",
        isHeader: true,
      },

      {
        id: "dashboard",
        label: "Dashboard",
        // icon: "ri-honour-line",
        iconSVG:
          isActive === "dashboard" ? userManagementActive : dashboardIcon,
        link: "/dashboard",
        activeSVG: dashboardActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("dashboard");
          setIsActive("dashboard");
          updateIconSidebar(e);
        },
      },

      {
        id: "Teams",
        label: "Team Management",
        // icon: "ri-honour-line",
        iconSVG: isActive === "Teams" ? userManagementActive : userManagement,
        link: "/sales-manager/team/",
        activeSVG: umActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("Teams");
          setIsActive("Teams");
          updateIconSidebar(e);
        },
      },

      {
        id: "products",
        label: "Products",
        // icon: "ri-honour-line",
        iconSVG: isActive === "products" ? userManagementActive : metrics,
        link: "/sales-manager/products",
        activeSVG: metricsActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("products");
          setIsActive("products");
          updateIconSidebar(e);
        },
      },
      {
        id: "projections",
        label: "Projections",
        // icon: "ri-honour-line",
        iconSVG: isActive === "products" ? userManagementActive : metrics,
        link: "/projections",
        activeSVG: metricsActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("products");
          setIsActive("products");
          updateIconSidebar(e);
        },
      },
      {
        id: "data_entry",
        label: "Data Entry",
        // icon: "ri-honour-line",
        iconSVG: isActive === "data_entry" ? userManagementActive : report,
        link: "/company/data-entry",
        activeSVG: reportActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("data_entry");
          setIsActive("data_entry");
          updateIconSidebar(e);
        },
      },

      // {
      //   id: "submit_number",
      //   label: "Submit Numbers",
      //   // icon: "ri-honour-line",
      //   iconSVG:
      //     isActive === "submit_number" ? userManagementActive : userManagement,
      //   link: "/setter-gap/submit-numbers",
      //   activeSVG: umActive,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIscurrentState("submit_number");
      //     setIsActive("submit_number");
      //     updateIconSidebar(e);
      //   },
      // },

      {
        id: "reports",
        label: "Reports & Analytics",
        // icon: "ri-honour-line",
        iconSVG: isActive === "reports" ? userManagementActive : report,
        link: "/reports",
        activeSVG: reportActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("reports");
          setIsActive("reports");
          updateIconSidebar(e);
        },
      },

      {
        id: "Settings",
        label: "Settings",
        // icon: "ri-honour-line",
        iconSVG: isActive === "Settings" ? userManagementActive : settings,
        link: "/settings",
        activeSVG: settingActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("Settings");
          setIsActive("Settings");
          updateIconSidebar(e);
        },
      },

      {
        label: "pages",
        isHeader: true,
      },
    ];
  }

  if (role == 4) {
    menuItems = [
      {
        label: "Menu",
        isHeader: true,
      },

      {
        id: "dashboard",
        label: "Dashboard",
        // icon: "ri-honour-line",
        iconSVG:
          isActive === "dashboard" ? userManagementActive : dashboardIcon,
        link: "/dashboard",
        activeSVG: dashboardActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("dashboard");
          setIsActive("dashboard");
          updateIconSidebar(e);
        },
      },

      {
        id: "submit_number_via_products",
        label: "Submit Numbers",
        // icon: "ri-honour-line",
        iconSVG:
          isActive === "submit_number" ? userManagementActive : userManagement,
        link: "/sale-rep/submit-numbers",
        activeSVG: umActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("submit_number");
          setIsActive("submit_number");
          updateIconSidebar(e);
        },
      },

      // {
      //   id: "submit_number",
      //   label: "Submit Numbers",
      //   // icon: "ri-honour-line",
      //   iconSVG:
      //     isActive === "submit_number" ? userManagementActive : userManagement,
      //   link: "/setter-gap/submit-numbers",
      //   activeSVG: umActive,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIscurrentState("submit_number");
      //     setIsActive("submit_number");
      //     updateIconSidebar(e);
      //   },
      // },

      // {
      //   id: "data_entry",
      //   label: "Data Entry",
      //   // icon: "ri-honour-line",
      //   iconSVG: isActive === "data_entry" ? userManagementActive : report,
      //   link: "/company/data-entry",
      //   activeSVG: reportActive,
      //   click: function (e) {
      //     e.preventDefault();
      //     setIscurrentState("data_entry");
      //     setIsActive("data_entry");
      //     updateIconSidebar(e);
      //   },
      // },

      {
        id: "Settings",
        label: "Settings",
        // icon: "ri-honour-line",
        iconSVG: isActive === "Settings" ? userManagementActive : settings,
        link: "/settings",
        activeSVG: settingActive,
        click: function (e) {
          e.preventDefault();
          setIscurrentState("Settings");
          setIsActive("Settings");
          updateIconSidebar(e);
        },
      },

      {
        label: "pages",
        isHeader: true,
      },
    ];
  }

  // console.log(3)

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
