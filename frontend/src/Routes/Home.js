import dog from "../Images/german-dog.jpg";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadanimals } from "../redux/reducers/animals";

const Home = () => {
  const user = useSelector((state) => state.user);
  const animals = useSelector((state) => state.animals[0].allAnimals);
  console.log(user);

  const dispatch = useDispatch();

  const api_url = `${process.env.REACT_APP_BACKEND_API_ADDRESS}:` + 
                `${process.env.REACT_APP_BACKEND_API_PORT}${process.env.REACT_APP_BACKEND_API_BASE_URL}`;

  useEffect(() => {
    if (localStorage.token)
      fetch(`${api_url}/animal/animals`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => dispatch(loadanimals({ allAnimals: [...data] })))

        .catch((error) => console.error(error));
  }, []);
  return (
    <div className="flex mt-[--margin-top] pl-[--pading-left] pr-[--pading-right] items-center justify-center flex-col gap-y-20 w-full ">
      <p className=" font-font1 italic text-center text-gray-600 font-semibold bg-indigo-50 p-2 rounded-md">
        "Every dog deserves a home and every home deserves a dog."
      </p>
      <img src={dog} alt="dog" />
    </div>
  );
};

export default Home;
