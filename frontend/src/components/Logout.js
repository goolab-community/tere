import { useNavigate } from "react-router-dom";

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
    <div
      className="inline-block cursor-pointer fixed top-2 right-4 flex items-center space-x-2"
      onClick={log_out}
    >
      <span></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-slate-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 4.5A1.5 1.5 0 014.5 3h11a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 15.5v-11zM8 10a.75.75 0 01.75-.75h4.19l-1.72-1.72a.75.75 0 111.06-1.06l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H8.75A.75.75 0 018 10z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default Logaut;
