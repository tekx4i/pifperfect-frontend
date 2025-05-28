import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
} from "reactstrap";

import "react-toastify/dist/ReactToastify.css";

import { Link, useNavigate } from "react-router-dom";

import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import LogoPIF from "../../assets/newImages/PIFPerfect.png";
import { useForm } from "react-hook-form";
import { apiPost, apiGet, apiGetPublic } from "../../CustomHooks/useAuth.js";

const Register = () => {
  const [roles, setRoles] = useState([]);
  const token = localStorage.getItem("token");
  const { REACT_APP_API_URL, REACT_APP_API_IMG_URL } = process.env;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // const url = "http://192.168.88.52:3000/api/auth/register"; // Static URL
    const url = `${REACT_APP_API_URL}auth/register`;
    const params = {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 2,
    };
    const response = await apiPost(url, params);
    if (response.success) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
    }
  };

  // Get Roles
  const getRoles = async () => {
    try {
      const url = `${REACT_APP_API_URL}auth/roles`;

      const params = {};
      const response = await apiGetPublic(url, params);
      if (response.success) {
        const dbValues = response.data.records;
        setRoles(dbValues);
      }
    } catch (error) {
      //   setUserLoading(false);
      console.log(error);
    } finally {
      //   setUserLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  document.title = "Register | PIFPerfect";

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <img className="mb-4" src={LogoPIF} alt="" height="20" />
                      <h5 className="text-primary">Create New Account</h5>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={handleSubmit(onSubmit)} 
                        className="needs-validation"
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="useremail" className="form-label">
                            First Name <span className="text-danger">*</span>
                          </Label>
                          <input
                            id="first_name"
                            name="first_name"
                            className="form-control"
                            placeholder="Enter first name"
                            {...register("first_name")}
                            type="text"
                          />
                          {/* {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                                    ) : null} */}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="useremail" className="form-label">
                            Last Name <span className="text-danger">*</span>
                          </Label>
                          <input
                            id="last_name"
                            name="last_name"
                            className="form-control"
                            placeholder="Enter first name"
                            {...register("last_name")}
                            type="text"
                          />
                          {/* {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                                    ) : null} */}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="useremail" className="form-label">
                            Email <span className="text-danger">*</span>
                          </Label>
                          <input
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email address"
                            {...register("email")}
                            type="email"
                          />
                          {/* {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                                    ) : null} */}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="phone" className="form-label">
                            Phone <span className="text-danger">*</span>
                          </Label>
                          <input
                            className="form-control"
                            name="phone"
                            type="number"
                            placeholder="Enter phone"
                            {...register("phone")}
                          />
                          {/* {validation.touched.first_name && validation.errors.first_name ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.first_name}</div></FormFeedback>
                                                    ) : null} */}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="userpassword" className="form-label">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <input
                            className="form-control"
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            {...register("password")}
                          />
                          {/* {validation.touched.password && validation.errors.password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.password}</div></FormFeedback>
                                                    ) : null} */}
                        </div>

                        <div className="mb-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="form-label"
                          >
                            Confirm Password{" "}
                            <span className="text-danger">*</span>
                          </Label>
                          <input
                            className="form-control"
                            name="confirm_password"
                            type="password"
                            placeholder="Confirm Password"
                            {...register("confirm_password")}
                          />
                          {/* {validation.touched.confirm_password && validation.errors.confirm_password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.confirm_password}</div></FormFeedback>
                                                    ) : null} */}
                        </div>

                        <div className="mb-4">
                          <p className="mb-0 fs-12 text-muted fst-italic mr-4">
                            By registering you agree to the PIFPerfect
                            <Link
                              to="#"
                              className="text-primary text-decoration-underline fst-normal fw-medium ml-4"
                            >
                              Terms of Use
                            </Link>
                          </p>
                        </div>

                        <div className="mt-4">
                          <button className="default__btn_auth" type="submit">
                            Sign Up
                          </button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title text-muted">
                              Create account with
                            </h5>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="btn btn-primary btn-icon waves-effect waves-light"
                            >
                              <i className="ri-facebook-fill fs-16"></i>
                            </button>{" "}
                            <button
                              type="button"
                              className="btn btn-danger btn-icon waves-effect waves-light"
                            >
                              <i className="ri-google-fill fs-16"></i>
                            </button>{" "}
                            <button
                              type="button"
                              className="btn btn-dark btn-icon waves-effect waves-light"
                            >
                              <i className="ri-github-fill fs-16"></i>
                            </button>{" "}
                            <button
                              type="button"
                              className="btn btn-info btn-icon waves-effect waves-light"
                            >
                              <i className="ri-twitter-fill fs-16"></i>
                            </button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Already have an account ?{" "}
                    <Link
                      to="/login"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Signin{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Register;
