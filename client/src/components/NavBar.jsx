import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logout } from "../utils/auth.js";
import { CircleX, Menu } from "lucide-react";
const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="flex flex-col items-start md:flex-row justify-between md:items-center w-full p-4 bg-white shadow-md ">
      <div className="flex flex-row justify-between w-full">
        <a href="/">
          <h1 className="text-2xl font-bold text-gray-800">Barber Shop</h1>
        </a>
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            {menuOpen ? <CircleX size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start md:items-center gap-4">
        <div
          className={`flex-col justify-start items-start md:flex-row md:flex md:items-center gap-4 ${menuOpen ? "flex" : "hidden"} md:flex`}
        >
          {isLoggedIn ? (
            <>
              {/* <Avatar src={userInfo?.avatar} alt={userInfo?.name} /> */}
              <Button asChild variant="outline">
                <a href="/">Home</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/dashboard">Dashboard</a>
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <a href="/sign-in">Sign In</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/sign-in">Sign Up</a>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
