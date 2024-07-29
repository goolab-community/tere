import { useNavigate, Form, Redirect } from "react-router-dom";

const Logaut = () => {
  let navigate = useNavigate();
  const log_out = () => {
    console.log("logout");
    localStorage.clear();

    navigate("/");
    window.location.reload();
    return "Secsess log out";
  };

  return (
    <div class=" inline-block cursor-pointer" onClick={log_out}>
      Logout
    </div>
  );
};

export default Logaut;
