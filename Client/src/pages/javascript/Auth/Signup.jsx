import React, { useEffect, useState } from "react";
import Input from "../../../components/javascript/Input";
import Button from "../../../components/javascript/Button";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/transparentlogo.png";
import { useSnackbar } from "notistack";
import "../../css/auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [validated, setValidated] = useState(false);
  const id = localStorage.getItem("id");

  const [data, setData] = useState({ email: "", password: "" });
  const [finaldata, setFinaldata] = useState({
    email: "",
    password: "",
    username: "@",
    name: "",
    about: "",
  });
  function hasEmail(text) {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

    return emailPattern.test(text);
  }

  useEffect(() => {
    if (id) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handlefinalchange = (e) => {
    setFinaldata({ ...finaldata, [e.target.id]: e.target.value });
  };

  const createaccount = async () => {
    if (finaldata.username === "") {
      enqueueSnackbar("Email is required", { variant: "error" });
    } else if (finaldata.password === "") {
      enqueueSnackbar("Password is required", { variant: "error" });
    } else if (finaldata.name === "") {
      enqueueSnackbar("Name is required", { variant: "error" });
    } else {
      try {
        if (finaldata.about === "") {
          finaldata.about = "The user has no about text.";
        }
        if (!finaldata.username.startsWith("@")) {
          finaldata.username = `@${finaldata.username.replace(" ", "")}`;
        } else {
          finaldata.username.replace(" ", "");
        }

        const response = await fetch(
          "https://lcbp-api.vercel.app/auth/signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finaldata),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (
            response.status === 400 &&
            data.errorMessage.includes("Username already exists")
          ) {
            enqueueSnackbar("Username already exists.", {
              variant: "error",
            });
          } else {
            enqueueSnackbar(data.errorMessage || "An error occurred!", {
              variant: "error",
            });
          }
        } else {
          localStorage.setItem("id", data.id);
          navigate("/chats");
        }
      } catch (err) {
        enqueueSnackbar("An error occurred!", { variant: "error" });
      }
    }
  };

  let submit = async () => {
    try {
      if (data.email === "") {
        enqueueSnackbar("Email is required", { variant: "error" });
      } else if (!hasEmail(data.email)) {
        enqueueSnackbar("Please enter a valid Email.", { variant: "error" });
      } else if (data.password === "") {
        enqueueSnackbar("Password is required", { variant: "error" });
      } else if (data.password.length <= 5) {
        enqueueSnackbar("Parword is too short.", { variant: "error" });
      } else {
        console.log(data.email);
        const response = await fetch("https://lcbp-api.vercel.app/auth/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const responseData = await response.json();

          if (responseData.exists === false) {
            setFinaldata({ ...finaldata, ...data });
            setValidated(true);
          } else {
            enqueueSnackbar(`Email already exists`, { variant: "warning" });
          }
        } else {
          enqueueSnackbar("An unexpected error occurred", { variant: "error" });
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      enqueueSnackbar("An unexpected error occurred", { variant: "error" });
    }
  };

  return validated ? (
    <>
      <div className="maincont2">
        <h1>Enter your details</h1>

        <Input
          label="Username"
          placeholder="create a username"
          type="text"
          value={finaldata.username}
          onchange={handlefinalchange}
          id="username"
        />
        <Input
          label="Name"
          placeholder="Enter your Name"
          type="text"
          value={finaldata.name}
          onchange={handlefinalchange}
          id="name"
        />
        <Input
          label="About"
          placeholder="Enter you about text (optional)"
          type="text"
          value={finaldata.about}
          onchange={handlefinalchange}
          id="about"
        />
        <Button theme="gradient" submit={createaccount} text="Create account" />
      </div>
    </>
  ) : (
    <>
      <div>
        <div className="maincont">
          <section className="leftcont">
            <div className="welcomediv">
              <h1>Sign up</h1>
              <p>Create your LC Chat account</p>
            </div>
            <div className="inputdiv">
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={data.email}
                onchange={handleChange}
                id="email"
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={data.password}
                onchange={handleChange}
                id="password"
              />
            </div>
            <div className="buttonsdiv">
              <Button theme="gradient" text="Signup" submit={submit} />
            </div>
            <div className="leftlastdiv">
              <p>
                Already have an account ?{" "}
                <span
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Log in
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Signup;
