import axios from "axios";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Inputbox } from "../components/Inputbox";
import { Subheading } from "../components/Subheading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bottomwarning } from "../components/Bottomwarning";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function hello() {
    console.log("making backend call");
    const response=await axios.post("http://localhost:3000/api/v1/user/signup", {
      username,
      firstName,
      lastName,
      password,
    });
    console.log(response);
    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  }

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Signup"} />
          <Subheading label={"Enter your information to create an account"} />
          <Inputbox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="Dipanshu"
            label={"First Name"}
          />
          <Inputbox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Raj"
            label={"Last Name"}
          />
          <Inputbox
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            placeholder="dipthebeginner@gmail.com"
            label={"User Name"}
          />
          <Inputbox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />

          <div className="pt-4">
            <Button onClick={hello} label={"Sign up"} />
          </div>
          <Bottomwarning
            label={"Already have an account ?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
