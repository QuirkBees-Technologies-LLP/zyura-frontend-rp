import logo from "../../assets/home/footer-logo.svg";

export const PolicyHeader = () => {
  return (
    <header className="border-b border-[#d9e1ee] bg-white">
      <div className="mx-auto flex h-20 max-w-[1920px] items-center px-6 md:px-10 lg:px-12">
        <a href="/" aria-label="Go to homepage">
          <img src={logo} alt="Zyura logo" className="h-12 w-auto object-contain" />
        </a>
      </div>
    </header>
  );
};

