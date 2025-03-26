const Hero = () => {
  return (
    <div className="mx-40 max-xl:mx-auto max-xl:w-[90%] flex-col h-screen">
      {/* Text  */}
      <div className="text-white text-center mt-20">
        {/* Big Devices */}
        <h3 className="h3 -mb-3 max-xl:hidden">Making All Your Software</h3>
        <h1 className="h1 mb-3 max-xl:hidden">Accessible in One Place</h1>

        {/* Small Devices */}
        <p className="p -mb-2 xl:hidden">Making All Your Software</p>
        <h2 className="h2 mb-2 xl:hidden">Accessible in One Place</h2>

        <p className="p text-subtext w-[800px] max-lg:hidden mx-auto">
          Our community-driven platform combines a powerful website builder with
          a seamless React component library. Design your site visually, then
          export it to clean React code in one click. Plus, with our interactive
          community, you help shape the future—request apps, vote on ideas, and
          watch them come to life.
        </p>
        <p className="p text-subtext w-lg lg:hidden mx-auto">
          With our interactive community, you help shape the future—request
          apps, vote on ideas, and watch them come to life.
        </p>
      </div>
      <div></div>
    </div>
  );
};

export default Hero;
