import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Outlet, ScrollRestoration, Scripts, useLocation, Link, useNavigate } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useRef, useEffect, useCallback } from "react";
import { RiBowlFill, RiChatAiFill, RiUserSmileFill, RiSearchFill, RiMapPinLine, RiFilter3Fill, RiArrowLeftLine, RiSendPlaneLine } from "react-icons/ri";
import { gsap } from "gsap";
import { v4 } from "uuid";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
      /* @__PURE__ */ jsx("link", { rel: "icon", type: "image/png", href: "favicon.ico" }),
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "manifest",
          href: "/manifest.json",
          type: "application/manifest+json"
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#fafafa" }),
      /* @__PURE__ */ jsx("meta", { name: "mobile-web-app-capable", content: "yes" }),
      /* @__PURE__ */ jsx("link", { rel: "apple-touch-icon", href: "/icons/icon-192.png" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
      /* @__PURE__ */ jsx("title", { children: "makan mana" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Navbar() {
  const location = useLocation();
  const active = location.pathname;
  const navItems = [
    { id: "/", icon: /* @__PURE__ */ jsx(RiBowlFill, { size: 20 }), route: "/" },
    { id: "/chat", icon: /* @__PURE__ */ jsx(RiChatAiFill, { size: 20 }), route: "/chat" },
    { id: "/about", icon: /* @__PURE__ */ jsx(RiUserSmileFill, { size: 20 }), route: "/about" }
  ];
  return /* @__PURE__ */ jsx("nav", { className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-50", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-6 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg", children: navItems.map(({ id, icon, route }) => /* @__PURE__ */ jsx(
    Link,
    {
      to: route,
      className: `w-10 h-10 flex items-center justify-center rounded-full transition-all
              ${active === route ? "bg-primary text-white" : "text-primary hover:bg-white/10"}`,
      children: icon
    },
    id
  )) }) });
}
function FilterModal({
  isOpen,
  onClose,
  onApply,
  filterOptions,
  isLoading = false
}) {
  const [selected, setSelected] = useState({ place: [], type: [], origin: [] });
  const modalRef = useRef(null);
  const toggle = (key, option) => {
    setSelected((prev) => {
      const exists = prev[key].some((item) => item.value === option.value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((item) => item.value !== option.value) : [...prev[key], option]
      };
    });
  };
  const handleApply = () => {
    onApply(selected);
    setSelected({ place: [], type: [], origin: [] });
    onClose();
  };
  const clearAll = () => {
    setSelected({ place: [], type: [], origin: [] });
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const hasSelections = selected.place.length > 0 || selected.type.length > 0 || selected.origin.length > 0;
  const isSelected = (key, value) => selected[key].some((item) => item.value === value);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4", children: /* @__PURE__ */ jsxs(
    "div",
    {
      ref: modalRef,
      className: "bg-white rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-auto",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-primary", children: "Filter" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              className: "text-gray hover:text-primary text-xl",
              disabled: isLoading,
              children: "×"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-gray mb-2", children: [
            "Place ",
            selected.place.length > 0 && `(${selected.place.length})`
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: filterOptions.place.map((p) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => toggle("place", p),
              disabled: isLoading,
              className: `px-3 py-1 rounded-full text-sm border transition-colors ${isSelected("place", p.value) ? "bg-primary text-white border-primary" : "bg-light text-primary border-primary-light hover:bg-primary-light"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
              children: p.label
            },
            p.value
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-gray mb-2", children: [
            "Type ",
            selected.type.length > 0 && `(${selected.type.length})`
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: filterOptions.type.map((t) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => toggle("type", t),
              disabled: isLoading,
              className: `px-3 py-1 rounded-full text-sm border transition-colors ${isSelected("type", t.value) ? "bg-primary text-white border-primary" : "bg-light text-primary border-primary-light hover:bg-primary-light"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
              children: t.label
            },
            t.value
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-sm font-medium text-gray mb-2", children: [
            "Origin ",
            selected.origin.length > 0 && `(${selected.origin.length})`
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: filterOptions.origin.map((o) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => toggle("origin", o),
              disabled: isLoading,
              className: `px-3 py-1 rounded-full text-sm border transition-colors ${isSelected("origin", o.value) ? "bg-primary text-white border-primary" : "bg-light text-primary border-primary-light hover:bg-primary-light"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`,
              children: o.label
            },
            o.value
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-4 mt-6", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: clearAll,
              disabled: isLoading || !hasSelections,
              className: `w-1/2 py-2 rounded-full font-medium transition-colors ${hasSelections && !isLoading ? "text-primary hover:bg-primary-light" : "text-gray cursor-not-allowed"}`,
              children: "Clear"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleApply,
              disabled: isLoading || !hasSelections,
              className: `w-1/2 py-2 rounded-full font-medium transition-colors ${hasSelections && !isLoading ? "bg-primary text-white hover:bg-primary/90" : "bg-muted text-gray cursor-not-allowed"}`,
              children: isLoading ? "Applying..." : "Apply"
            }
          )
        ] })
      ]
    }
  ) });
}
const GetLocationModal = ({
  onAllow,
  onClose,
  onRequestLocation
}) => {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-6 w-[90%] max-w-sm text-center", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-primary mb-2", children: "Use Your Location?" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray mb-4 text-sm", children: "Allow access to your location to find nearby restaurants." }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            onAllow();
            onRequestLocation();
          },
          className: "flex-1 bg-primary text-white rounded-lg py-2",
          children: "Allow"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "flex-1 bg-gray-200 text-gray-800 rounded-lg py-2",
          children: "Cancel"
        }
      )
    ] })
  ] }) });
};
const buildFilterURL = (selectedFilters) => {
  const params = new URLSearchParams();
  const hasNearby = selectedFilters.place.some((p) => p.value === "nearby");
  if (hasNearby) {
    const loc = sessionStorage.getItem("makanmana_user_loc");
    if (loc) {
      const { latitude, longitude } = JSON.parse(loc);
      params.append("nearby", `${latitude},${longitude}`);
    }
  }
  selectedFilters.place.filter((p) => p.value !== "nearby").forEach((p) => params.append("place", p.value));
  selectedFilters.type.forEach((type) => params.append("type", type.value));
  selectedFilters.origin.forEach(
    (origin) => params.append("origin", origin.value)
  );
  return `/filter?${params.toString()}`;
};
const getSessionItem = (key) => {
  const item = sessionStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return item;
  }
};
const setSessionItem = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(key, serialized);
  } catch {
    sessionStorage.setItem(key, String(value));
  }
};
const ROLL_DURATION = 3;
const VISIBLE_ITEM_HEIGHT = 60;
function Index() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    null
  );
  const [restaurants, setRestaurants] = useState([]);
  const [originalRestaurants, setOriginalRestaurants] = useState([]);
  const [restaurantData, setRestaurantData] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    place: [],
    type: [],
    origin: []
  });
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isFilterOptionsLoading, setIsFilterOptionsLoading] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [pendingNearbyFilter, setPendingNearbyFilter] = useState(null);
  useEffect(() => {
    const loc = sessionStorage.getItem("makanmana_user_loc");
    setHasUserLocation(!!loc);
  }, []);
  const extractFilterOptions = (data) => {
    const placeSet = /* @__PURE__ */ new Set();
    const typeSet = /* @__PURE__ */ new Set();
    const originSet = /* @__PURE__ */ new Set();
    if (Array.isArray(data)) {
      data.forEach((restaurant) => {
        var _a, _b;
        if ("location" in restaurant && restaurant.location) {
          placeSet.add(restaurant.location);
        }
        (_a = restaurant.type) == null ? void 0 : _a.forEach((c) => typeSet.add(c));
        (_b = restaurant.origin) == null ? void 0 : _b.forEach((o) => originSet.add(o));
      });
    } else {
      Object.entries(data).forEach(([place, restaurants2]) => {
        placeSet.add(place);
        restaurants2.forEach((restaurant) => {
          var _a, _b;
          (_a = restaurant.type) == null ? void 0 : _a.forEach((c) => typeSet.add(c));
          (_b = restaurant.origin) == null ? void 0 : _b.forEach((o) => originSet.add(o));
        });
      });
    }
    const toFilterOption = (item) => ({
      label: item,
      value: item.toLowerCase()
      // ensure value is lowercase for backend
    });
    return {
      place: Array.from(placeSet).map(toFilterOption),
      type: Array.from(typeSet).map(toFilterOption),
      origin: Array.from(originSet).map(toFilterOption)
    };
  };
  const getAllRestaurantNames = (data) => {
    return Object.values(data).flat().map((r) => r.name);
  };
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const rounded = (num) => Number(num.toFixed(5));
        const { latitude, longitude } = position.coords;
        const locationData = {
          latitude: rounded(latitude),
          longitude: rounded(longitude)
        };
        sessionStorage.setItem(
          "makanmana_user_loc",
          JSON.stringify(locationData)
        );
        setHasUserLocation(true);
        setShowLocationModal(false);
        if (pendingNearbyFilter) {
          handleApplyFilter(pendingNearbyFilter);
          setPendingNearbyFilter(null);
        }
      },
      (error) => {
        console.error("Location access denied or error:", error);
        alert("Unable to get your location. Please enable location access.");
        setPendingNearbyFilter(null);
      }
    );
  };
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(
          `${"https://api.naimroslan.dev"}/restaurants`
        );
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setRestaurants(json.data);
          setOriginalRestaurants(json.data);
        } else {
          const restaurantNames = getAllRestaurantNames(json);
          setRestaurantData(json);
          setRestaurants(restaurantNames);
          setOriginalRestaurants(restaurantNames);
          setFilterOptions(extractFilterOptions(json));
        }
      } catch (err) {
        console.error("Failed to load restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.set(containerRef.current, { y: 0 });
  }, [restaurants.length]);
  const rollRestaurants = useCallback(() => {
    if (isRolling || !containerRef.current || restaurants.length === 0) return;
    setIsRolling(true);
    setSelectedRestaurant(null);
    const itemHeight = VISIBLE_ITEM_HEIGHT;
    const totalHeight = itemHeight * restaurants.length;
    gsap.set(containerRef.current, { y: 0 });
    gsap.to(containerRef.current, {
      y: -totalHeight * 2,
      duration: ROLL_DURATION,
      ease: "power2.inOut",
      onComplete: () => {
        const idx = Math.floor(Math.random() * restaurants.length);
        setSelectedRestaurant(restaurants[idx]);
        setIsRolling(false);
        gsap.set(containerRef.current, { y: -idx * itemHeight });
      }
    });
  }, [isRolling, restaurants]);
  const onSearch = () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    navigate("/chat", { state: { query: trimmed } });
  };
  const handleRestaurantClick = (restaurantName) => {
    navigate("/chat", { state: { query: restaurantName } });
  };
  const handleApplyFilter = async (selectedFilters) => {
    const isNearby = selectedFilters.place.some((p) => p.value === "nearby");
    if (isNearby) {
      const location = getSessionItem(
        "makanmana_user_loc"
      );
      if (!location) {
        setPendingNearbyFilter(selectedFilters);
        setShowLocationModal(true);
        return;
      }
    }
    setIsFilterLoading(true);
    try {
      const params = buildFilterURL(selectedFilters);
      const url = `${"https://api.naimroslan.dev"}${params}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const filteredData = await res.json();
      const restaurantNames = Object.values(filteredData).flat().filter(Boolean);
      setRestaurants(restaurantNames);
      setSelectedRestaurant(null);
      setHasActiveFilters(true);
      if (containerRef.current) {
        gsap.set(containerRef.current, { y: 0 });
      }
    } catch (err) {
      console.error("Filter fetch error:", err);
      alert("Failed to filter restaurants. Please try again.");
    } finally {
      setIsFilterLoading(false);
      setIsFilterOpen(false);
    }
  };
  const openFilterModal = async () => {
    if (filterOptions.place.length === 0 && filterOptions.type.length === 0 && filterOptions.origin.length === 0) {
      try {
        setIsFilterOptionsLoading(true);
        const res = await fetch(
          `${"https://api.naimroslan.dev"}/filter-options`
        );
        const data = await res.json();
        setFilterOptions({
          place: [
            { label: "Nearby", value: "nearby" },
            // ensure value lowercase for backend
            { label: "Sunway Putra Mall", value: "sunway-putra-mall" },
            { label: "TRX Mall", value: "trx-mall" }
          ],
          type: data.type.map((item) => ({
            label: item,
            value: item.toLowerCase()
          })),
          origin: data.origin.map((item) => ({
            label: item,
            value: item.toLowerCase()
          }))
        });
      } catch (err) {
        console.error("Failed to load filter options:", err);
        alert("Failed to load filter options. Please try again.");
      } finally {
        setIsFilterOptionsLoading(false);
      }
    }
    setIsFilterOpen(true);
  };
  const resetFilters = () => {
    setRestaurants(originalRestaurants);
    setSelectedRestaurant(null);
    setHasActiveFilters(false);
    if (containerRef.current) {
      gsap.set(containerRef.current, { y: 0 });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-light flex flex-col", children: [
    /* @__PURE__ */ jsx("main", { className: "flex-1 px-4 pt-6 pb-24 overflow-auto", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-primary text-xl font-semibold mb-2", children: "Ask Me Anything" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-primary-light rounded-full p-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              onKeyPress: (e) => e.key === "Enter" && onSearch(),
              className: "flex-1 bg-transparent focus:outline-none text-primary px-2 font-funnel font-semibold",
              placeholder: "What you feel like eating?"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onSearch,
              disabled: !search.trim(),
              className: "bg-light px-5 py-3 rounded-full text-primary text-xl font-bold disabled:opacity-50",
              children: /* @__PURE__ */ jsx(RiSearchFill, {})
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-primary text-xl font-semibold", children: "Today's Pick" }),
          hasActiveFilters && /* @__PURE__ */ jsxs("span", { className: "text-sm font-normal text-gray", children: [
            "(",
            restaurants.length,
            " filtered)"
          ] }),
          !hasUserLocation && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowLocationModal(true),
              className: "p-1 transition-colors text-gray hover:text-primary",
              children: /* @__PURE__ */ jsx(RiMapPinLine, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          hasActiveFilters && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: resetFilters,
              className: "text-sm text-primary underline hover:text-primary/80",
              children: "Reset"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: openFilterModal,
              className: `p-1 transition-colors ${hasActiveFilters ? "text-primary" : "text-gray"}`,
              children: /* @__PURE__ */ jsx(RiFilter3Fill, { className: "w-6 h-6" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl overflow-hidden border border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-[180px] overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: containerRef,
              className: "absolute top-[60px] inset-x-0 transition-all",
              children: [
                restaurants.map((name, i) => {
                  const isSelected = name === selectedRestaurant;
                  return /* @__PURE__ */ jsx(
                    "div",
                    {
                      onClick: () => handleRestaurantClick(name),
                      className: `h-[60px] flex items-center justify-center text-xl font-semibold transition-opacity cursor-pointer ${isSelected ? "text-primary opacity-100" : "text-gray opacity-30"}`,
                      children: name
                    },
                    name + i
                  );
                }),
                restaurants.length === 0 && /* @__PURE__ */ jsx("div", { className: "h-[60px] flex items-center justify-center text-gray text-lg", children: hasActiveFilters ? "No restaurants match your filters" : "Loading restaurants..." })
              ]
            }
          )
        ] }),
        selectedRestaurant && !isRolling && /* @__PURE__ */ jsx("div", { className: "p-4 bg-light text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-gray", children: [
          "Makan",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-primary", children: selectedRestaurant }),
          " ",
          "jom!"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: rollRestaurants,
          disabled: isRolling || restaurants.length === 0,
          className: `w-full py-4 px-6 rounded-xl text-white font-semibold text-xl transition-all ${isRolling || restaurants.length === 0 ? "bg-muted cursor-not-allowed" : "bg-primary active:scale-95 hover:bg-primary/90"}`,
          children: isRolling ? "Rolling..." : restaurants.length === 0 ? hasActiveFilters ? "No restaurants available" : "Loading..." : "Makan mana?"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(Navbar, { className: "fixed bottom-0 left-0 right-0 z-50" }),
    /* @__PURE__ */ jsx(
      FilterModal,
      {
        isOpen: isFilterOpen,
        onClose: () => setIsFilterOpen(false),
        onApply: handleApplyFilter,
        filterOptions,
        isLoading: isFilterOptionsLoading
      }
    ),
    showLocationModal && /* @__PURE__ */ jsx(
      GetLocationModal,
      {
        onAllow: () => setShowLocationModal(false),
        onClose: () => setShowLocationModal(false),
        onRequestLocation: handleGetLocation
      }
    )
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
function About() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white flex flex-col justify-center items-center px-6 py-10 space-y-8 text-center", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-bold text-primary leading", children: [
      "Built with love,",
      /* @__PURE__ */ jsx("br", {}),
      "shared with you."
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
      "Check out my portfolio at",
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://naimroslan.dev",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-primary underline hover:text-primary-dark transition",
          children: "naimroslan.dev"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Navbar, { className: "fixed bottom-0 left-0 right-0 z-50" })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: About
}, Symbol.toStringTag, { value: "Module" }));
function Chat() {
  var _a;
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = ((_a = location.state) == null ? void 0 : _a.query) || "";
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const purpleBlobRef = useRef(null);
  const blueBlobRef = useRef(null);
  const hasSentInitial = useRef(false);
  useEffect(() => {
    const animateBlob = (ref, radius, duration, clockwise = true) => {
      let angle = 0;
      const dir = clockwise ? 1 : -1;
      gsap.to(
        {},
        {
          duration,
          repeat: -1,
          ease: "none",
          onUpdate: () => {
            angle += dir * 2 * Math.PI / (60 * duration);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            gsap.set(ref.current, { x, y });
          }
        }
      );
    };
    animateBlob(purpleBlobRef, 40, 10, true);
    animateBlob(blueBlobRef, 60, 14, true);
  }, []);
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, isTyping]);
  useEffect(() => {
    const welcome = [
      { text: "What do you feel like eating?", isUser: false }
    ];
    setMessages(
      initialQuery ? [...welcome, { text: initialQuery, isUser: true }] : welcome
    );
    if (initialQuery && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage(initialQuery, true);
    }
  }, [initialQuery]);
  useEffect(() => {
    const existing = getSessionItem("chat_session_id");
    if (!existing) {
      const newId = v4();
      setSessionItem("chat_session_id", newId);
    }
  });
  const sendMessage = async (text, auto = false) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!auto) {
      setMessages((prev) => [...prev, { text: trimmed, isUser: true }]);
    }
    setInputText("");
    setIsTyping(true);
    try {
      const sessionId = getSessionItem("chat_session_id");
      const res = await fetch(`${"https://api.naimroslan.dev"}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, sessionId })
      });
      const json = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          text: json.response || "Oh no, my owner must have forgeten to buy more credits 🙏 I'll let him know",
          isUser: false
        }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Try again later.", isUser: false }
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  const handleSendMessage = () => {
    sendMessage(inputText);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-light flex flex-col relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-0 flex items-center justify-center pointer-events-none", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: purpleBlobRef,
          className: "w-[500px] h-[400px] bg-purple-300 rounded-full mix-blend-multiply blur-2xl opacity-80"
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: blueBlobRef,
          className: "w-[500px] h-[400px] bg-blue-300 rounded-full mix-blend-multiply blur-2xl opacity-80 ml-[-200px] mt-[200px]"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/20 backdrop-blur-xl z-0" }),
    /* @__PURE__ */ jsx("header", { className: "relative z-10 px-4 py-6 bg-transparent", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/"),
          className: "absolute left-0 p-2 -m-2",
          children: /* @__PURE__ */ jsx(RiArrowLeftLine, { size: 24, className: "text-primary" })
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-primary", children: "Chat" })
    ] }) }) }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 relative z-10 px-4 pb-24", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md mx-auto h-full", children: /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto space-y-3 pr-2", children: [
      messages.map((msg, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `max-w-[85%] p-3 text-[15px] leading-relaxed rounded-2xl ${msg.isUser ? "bg-secondary text-white ml-auto rounded-br-md" : "bg-primary text-light rounded-bl-md shadow-sm border border-border"}`,
          children: msg.text
        },
        index
      )),
      isTyping && /* @__PURE__ */ jsxs("div", { className: "bg-primary text-light px-4 py rounded-xl rounded-bl-md inline-block border border-border w-fit", children: [
        /* @__PURE__ */ jsx("span", { className: "dot-wave", children: "." }),
        /* @__PURE__ */ jsx("span", { className: "dot-wave animation-delay-150", children: "." }),
        /* @__PURE__ */ jsx("span", { className: "dot-wave animation-delay-300", children: "." })
      ] }),
      /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 z-10 bg-gradient-to-t from-light via-light to-transparent", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-white rounded-full p-2 shadow-sm border border-border", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: inputText,
          onChange: (e) => setInputText(e.target.value),
          onKeyPress: handleKeyPress,
          placeholder: "Ask me anything about food...",
          className: "flex-1 bg-transparent focus:outline-none text-primary px-3 text-[15px] font-funnel font-semibold placeholder:text-gray"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSendMessage,
          disabled: !inputText.trim(),
          className: `px-4 py-3 rounded-full text-lg transition-all ${inputText.trim() ? "bg-primary text-white active:scale-95" : "bg-muted text-gray cursor-not-allowed"}`,
          children: /* @__PURE__ */ jsx(RiSendPlaneLine, {})
        }
      )
    ] }) }) })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Chat
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Dgl1lkKY.js", "imports": ["/assets/index-CFxg3Tr1.js", "/assets/components-JMU3ypcm.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-D17lqLbw.js", "imports": ["/assets/index-CFxg3Tr1.js", "/assets/components-JMU3ypcm.js"], "css": ["/assets/root-B_7x2RjN.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-Bmp0rUR5.js", "imports": ["/assets/index-CFxg3Tr1.js", "/assets/index-CqA6Po1E.js", "/assets/session-BuNBObg0.js", "/assets/Navbar-C7K0pfzt.js", "/assets/components-JMU3ypcm.js"], "css": [] }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/about-ytoZP5m5.js", "imports": ["/assets/index-CFxg3Tr1.js", "/assets/Navbar-C7K0pfzt.js", "/assets/index-CqA6Po1E.js", "/assets/components-JMU3ypcm.js"], "css": [] }, "routes/chat": { "id": "routes/chat", "parentId": "root", "path": "chat", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/chat-Ck9-RwwX.js", "imports": ["/assets/index-CFxg3Tr1.js", "/assets/index-CqA6Po1E.js", "/assets/session-BuNBObg0.js"], "css": [] } }, "url": "/assets/manifest-6d9e83d5.js", "version": "6d9e83d5" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/chat": {
    id: "routes/chat",
    parentId: "root",
    path: "chat",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
