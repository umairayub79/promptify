import Feed from "@components/Feed";

const Home = ({searchParams}) => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">Discover and Share <br className="max-md:hidden"/>
      <span className="orange_gradient text-center">AI Powered Prompts</span>
      </h1>
      <p className="desc text-center">
        Promptopia is an open-source AI Prompt sharing platform for the modern world
      </p>
      <Feed/>
    </section>
  );
};

export default Home;
