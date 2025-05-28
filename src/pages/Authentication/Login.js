import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Label,
  Row,
  Button,
  Form,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
// Formik validation
import { createSelector } from "reselect";
import LogoPIF from "../../assets/newImages/PIFPerfect.png";
import auth from "../../CustomHooks/useAuth";
import { useForm } from "react-hook-form";
import { setStorage } from "../../helpers/storage";
import { useUserInfo } from "../../Context/UserContext";

const Login = (props) => {
  const [data, setData] = useState({});
  const { REACT_APP_API_URL } = process.env;

  const [isLoading, setIsLoading] = useState(false);
  const { userData, updateUserInfo, userInfo } = useUserInfo();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const selectLayoutState = (state) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state.Account.user,
    error: state.Login.error,
    loading: state.Login.loading,
    errorMsg: state.Login.errorMsg,
  }));
  const { user, error, loading, errorMsg } = useSelector(loginpageData);

  const [passwordShow, setPasswordShow] = useState(false);

  const [resp, setResp] = useState([]);

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setData(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  const handleUpdateUser = (e, f) => {
    const newUserInfo = { ...f, role: e };

    updateUserInfo(newUserInfo);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const url = `${REACT_APP_API_URL}auth/login`;

      const params = { email: data.email, password: data.password };
      const response = await auth.apiPost(url, params);

      if (response.success) {
        setResp(response);

        localStorage.setItem("token", response.payload.token);
        setStorage("userInfo", response.payload);

        handleUpdateUser(response.payload.role, response.payload);

        if (response?.payload?.token) {
        } else {
          console.error("Login failed");
        }
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        // setIsLoading(false);
        console.log("false1");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
      console.log("false3");
    }
  };

  document.title = "Login | PIFPerfect";
  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo"></Link>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <img className="mb-4" src={LogoPIF} alt="" height="20" />
                      <h5 className="text-primary">Welcome Back !</h5>
                      <p className="text-muted">
                        Sign in to continue to PIFPerfect.
                      </p>
                    </div>
                    <div className="p-2 mt-4">
                      <Form onSubmit={handleSubmit(onSubmit)} action="#">
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            Email
                          </Label>
                          <input
                            {...register("email")}
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                          />
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <input
                              {...register("password")}
                              name="password"
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                            />
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              id="password-addon"
                              onClick={() => setPasswordShow(!passwordShow)}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <button
                            disabled={error ? null : loading ? true : false}
                            className="default__btn_auth"
                            type="submit"
                          >
                            {loading ? (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                Loading...{" "}
                              </Spinner>
                            ) : null}
                            Sign In
                          </button>
                        </div>

                        <div className="mt-4 text-center">
                          <div className="signin-other-title">
                            <h5 className="fs-13 mb-4 title">Sign In with</h5>
                          </div>
                          <div>
                            <Link
                              to="#"
                              className="btn btn-primary btn-icon me-1"
                              onClick={(e) => {
                                e.preventDefault();
                                socialResponse("facebook");
                              }}
                            >
                              <i className="ri-facebook-fill fs-16" />
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-danger btn-icon me-1"
                              onClick={(e) => {
                                e.preventDefault();
                                socialResponse("google");
                              }}
                            >
                              <i className="ri-google-fill fs-16" />
                            </Link>
                            <Button color="dark" className="btn-icon">
                              <i className="ri-github-fill fs-16"></i>
                            </Button>{" "}
                            <Button color="info" className="btn-icon">
                              <i className="ri-twitter-fill fs-16"></i>
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Don't have an account ?{" "}
                    <Link
                      to="/register"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Signup{" "}
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

export default withRouter(Login);
