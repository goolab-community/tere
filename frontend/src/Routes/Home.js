import dog from "../Images/german-dog.jpg";

const Home = () => {
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
