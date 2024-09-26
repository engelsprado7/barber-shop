import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logout } from "../utils/auth.js";
import { CircleX, Menu } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useStore } from "@nanostores/react";
import { currentShop, isOpen } from "../currentTurnStore.js";

let URL = "";

if (import.meta.env.MODE === "development") {
  console.log("development");
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
} else {
  URL = import.meta.env.PUBLIC_URL_API_BACKEND;
}

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const $isOpen = useStore(isOpen);
  const $currentShop = useStore(currentShop);
  console.log($currentShop);
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleToggle = () => {
    fetch(`${URL}/api/shop/${$currentShop.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
        refresh_token: `${localStorage.getItem("refresh_token")}`,
      },
      body: JSON.stringify({ status: !$isOpen }),
    }).then((res) => {
      if (res.ok) {
        isOpen.set(!$isOpen);
      } else {
        console.error("Failed to update shop status");
      }
    });
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
              {/* Create a switch toogle that updated the shop status */}

              <div className="flex items-center space-x-2">
                <Label htmlFor="airplane-mode">Estado</Label>

                <Switch
                  id="airplane-mode"
                  checked={$isOpen}
                  onCheckedChange={handleToggle}
                />
              </div>
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
