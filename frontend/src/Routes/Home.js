import dog from "../Images/german-dog.jpg";

const Home = () => {
  return (
    <div class="flex mt-[--margin-top]  items-center justify-center flex-col gap-y-20 w-full ">
      <p class=" font-font1 italic text-center text-gray-600 font-semibold bg-indigo-50 p-2 rounded-md">
        "Every dog deserves a home and every home deserves a dog."
      </p>
      <img src={dog} alt="dog" />
    </div>
  );
};

export default Home;
