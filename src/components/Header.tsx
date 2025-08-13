import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";

const Header = () => {
  return (
    <header
      className={`flex flex-row justify-end items-center w-full px-4 py-4 mt-4 container mx-auto sm:w-3/4 md:w-3/4 lg:w-3/4
    `}
    >
      {/* <DarkModeSwitch /> */}
    </header>
  );
};

export default Header;
