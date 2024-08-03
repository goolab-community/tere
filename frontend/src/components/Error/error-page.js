import { useRouteError, Link, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  console.log(error);

  const handleCklick = () => {
    // navigate("/");
    localStorage.clear();
    // window.location.reload();
  };
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-14">
      <Link to={"login"} onClick={handleCklick}>
        <h2> Back to Login {"<--"} </h2>
      </Link>

      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i className=" decoration-red-700 underline">
          {error.statusText || error.message}
        </i>
      </p>
    </div>
  );
}
