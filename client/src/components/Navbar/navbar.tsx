import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ArrowBtn from "./arrowbtn"; // Ensure this path is correct

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sliderStyle, setSliderStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
    transition: "none",
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [bgOpaque, setBgOpaque] = useState(false);

  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  
  // WOUTER: Get current location
  const [location, setLocation] = useLocation();

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { text: "Home", href: "/" },
    { text: "Events", href: "/events" },
    { text: "Blogs", href: "/blogs" },
    { text: "Articles", href: "/audio/v27" },
    { text: "OurTeam", href: "/ourteam" },
  ];

  const getActiveIndex = () => {
    return navLinks.findIndex((link) => {
      if (link.text === "Articles") {
        return location.startsWith("/audio");
      }
      if (link.href === "/") {
        return location === "/";
      }
      return location.startsWith(link.href);
    });
  };

  const activeIndex = getActiveIndex();

  // Handle Slider Position
  useLayoutEffect(() => {
    if (activeIndex !== -1 && navLinksRef.current[activeIndex]) {
      const activeTab = navLinksRef.current[activeIndex];
      if (activeTab) {
        setSliderStyle((prev) => ({
          ...prev,
          left: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
          opacity: 1,
          transition: prevIndex !== null ? "all 300ms ease-in-out" : "none",
        }));
        setPrevIndex(activeIndex);
      }
    } else {
      setSliderStyle((prev) => ({
        ...prev,
        opacity: 0,
        transition: "all 300ms ease-in-out",
      }));
    }
  }, [location, activeIndex, prevIndex]);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    const tab = navLinksRef.current[index];
    if (tab) {
      setSliderStyle({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
        opacity: 1,
        transition: "all 300ms ease-in-out",
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    const currentActiveIndex = getActiveIndex();
    const activeTab = navLinksRef.current[currentActiveIndex];
    if (activeTab) {
      setSliderStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
        opacity: 1,
        transition: "all 300ms ease-in-out",
      });
    } else {
      setSliderStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  // Handle Scroll Opacity
  useEffect(() => {
    if (location !== "/") {
      setBgOpaque(false);
      return;
    }

    const handleScroll = () => {
      const sections = [
        document.getElementById("events-carousel"),
        document.getElementById("recent-blogs"),
        document.getElementById("footer"),
      ].filter((sec): sec is HTMLElement => sec !== null);

      const navHeight = 80;
      const scrollY = window.scrollY + navHeight;
      let inside = false;

      sections.forEach((sec) => {
        if (
          scrollY >= sec.offsetTop &&
          scrollY < sec.offsetTop + sec.offsetHeight
        ) {
          inside = true;
        }
      });

      setBgOpaque(inside);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  // Handle Click Outside Mobile Menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`w-full fixed top-0 z-50 transition-colors duration-300 ${
          location === "/"
            ? bgOpaque
              ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-red-100"
              : "bg-transparent backdrop-blur-md"
            : "bg-transparent backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <div className="cursor-pointer">
                <img
                    src="/navbar_logo.png"
                    alt="Pictoreal Logo"
                    width={150}
                    height={32}
                    className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex flex-grow justify-center">
              <div
                onMouseLeave={handleMouseLeave}
                className="relative flex items-center px-2 py-2 bg-red-50 rounded-full border border-red-100/50"
              >
                {navLinks.map((link, index) => {
                  const isHighlighted =
                    hoveredIndex !== null
                      ? index === hoveredIndex
                      : index === activeIndex;

                  return (
                    <Link
                      key={link.text}
                      href={link.href}
                      ref={(el: HTMLAnchorElement | null) => {
                        navLinksRef.current[index] = el;
                      }}
                      onMouseEnter={() => handleMouseEnter(index)}
                      className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer ${
                        isHighlighted ? "text-white" : "text-gray-700 hover:text-red-900"
                      }`}
                    >
                      {link.text}
                    </Link>
                  );
                })}

                {/* Animated Slider (Now Red) */}
                <div
                  className="absolute top-2 bottom-2 bg-red-600 rounded-full pointer-events-none shadow-md shadow-red-200"
                  style={{ 
                    ...sliderStyle, 
                    height: "calc(100% - 1rem)" 
                  }}
                />
              </div>
            </div>

            {/* Arrow Button (Red Theme Props) */}
            {/* <div className="hidden md:block">
              <ArrowBtn 
                text="Magazines" 
                path="/magazines" 
                bgColor="#DC2626"      // red-600
                hoverColor="#B91C1C"   // red-700
                textColor="#FFFFFF"
                circleBg="#FFFFFF"
                arrowColor="#DC2626"
              />
            </div> */}

             <Button 
                            size="lg" 
                            className="bg-red-600 text-white hover:bg-red-700 h-12 px-8 text-lg font-semibold shadow-lg shadow-red-200 rounded-full transition-all hover:scale-105" 
                            onClick={() => setLocation("/register")}
                        >
                            Register Now
                        </Button>

            {/* Mobile Toggle */}
            <button
              ref={toggleBtnRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-red-600"
            >
              {isMobileMenuOpen ? (
                <span className="text-2xl font-bold">✕</span>
              ) : (
                <span className="text-2xl font-bold">☰</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed top-20 right-0 w-3/4 max-w-xs bg-white rounded-l-3xl shadow-xl shadow-red-900/10 z-40 transition-transform duration-300 ease-in-out border-l border-red-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-4 flex flex-col items-center">
          {navLinks.map((link) => (
            <Link key={link.text} href={link.href}>
                <a 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-3 rounded-2xl hover:bg-red-50 text-gray-800 hover:text-red-600 font-medium transition-colors"
                >
                    {link.text}
                </a>
            </Link>
          ))}
          <div className="pt-2">
            <ArrowBtn 
                text="Magazines" 
                path="/magazines" 
                bgColor="#DC2626" 
                hoverColor="#B91C1C"
                textColor="#FFFFFF"
                circleBg="#FFFFFF"
                arrowColor="#DC2626"
            />
          </div>
        </div>
      </div>
    </>
  );
}