import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useProducts from "@/hooks/useProducts";
import ProductCard from "@/components/common/ProductCard";
import { Button } from "@/components/ui/Button";
import useSeller from "@/hooks/useSeller";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const categories = [
  {
    name: "Electronics",
    image: "/images/categories/home_electronics.jpg",
    //   "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
  },
  {
    name: "Fashion",
    image: "/images/categories/home_fashion.jpg",
    // "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80",
  },
  {
    name: "Home",
    image: "/images/categories/home_home.jpg",
    // "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80",
  },
  {
    name: "Beauty",
    image: "/images/categories/home_beauty.jpg",
    // "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80",
  },
];

const heroSlides = [
  {
    id: 1,
    badge: "🔥 Mega Sale 2026",
    title: "Biggest Deals on Electronics",
    description:
      "Discover the latest smartphones, laptops, headphones and gadgets from trusted sellers.",
    buttonText: "Shop Electronics",
    buttonLink: "/products?category=Electronics",
    image: "/images/hero/hero_electronics.jpg",
    // "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&q=85",
  },
  {
    id: 2,
    badge: "👗 Fashion Sale",
    title: "Upgrade Your Style",
    description:
      "Explore trending fashion, premium clothing, shoes and accessories at amazing prices.",
    buttonText: "Shop Fashion",
    buttonLink: "/products?category=Fashion",
    image: "/images/hero/hero_fasion.jpg",
    // "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=85",
  },
  {
    id: 3,
    badge: "🏠 Home & Living",
    title: "Make Your Home Beautiful",
    description:
      "Find stylish furniture, home decor and everyday essentials for your perfect home.",
    buttonText: "Shop Home",
    buttonLink: "/products?category=Home",
    image: "/images/hero/hero_home.jpg",
    // "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
  },
  {
    id: 4,
    badge: "✨ Beauty Collection",
    title: "Discover Your Beauty Essentials",
    description:
      "Shop skincare, makeup and beauty essentials from your favorite brands.",
    buttonText: "Shop Beauty",
    buttonLink: "/products?category=Beauty",
    image: "/images/hero/hero_beauty.jpg",
    // "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=85",
  },
];

const Home = () => {
  const { products, loading, fetchProducts } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchProducts({
      page: 1,
      limit: 8,
      sort: "latest",
    });
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const slide = heroSlides[currentSlide];
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Banner */}
      {/* <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
              🔥 Mega Sale 2026
            </span>

            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
              Biggest Deals on Electronics, Fashion & Home
            </h1>

            <p className="mt-5 text-lg text-gray-300 leading-relaxed">
              Shop from top sellers, discover trending products, and enjoy
              secure payments with fast delivery across India.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold px-6 py-3">
                  Shop Now
                </Button>
              </Link>

              <Link to="/products?sort=latest">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black px-6 py-3"
                >
                  Explore New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* ================= HERO SLIDER ================= */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        {/* Slides */}
        <div className="relative h-[460px] sm:h-[520px] lg:h-[580px]">
          {heroSlides.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Center Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

              {/* ================= CENTER CONTENT ================= */}
              <div className="relative z-10 h-full flex items-center justify-center px-5 sm:px-8">
                <div className="w-full max-w-4xl text-center flex flex-col items-center">
                  {/* Badge */}
                  <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm sm:text-base font-medium backdrop-blur-md">
                    {item.badge}
                  </span>

                  {/* Title */}
                  <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-white max-w-4xl">
                    {item.title}
                  </h1>

                  {/* Description */}
                  <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl">
                    {item.description}
                  </p>

                  {/* Buttons */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Link to={item.buttonLink}>
                      <Button className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold px-7 py-3 shadow-lg">
                        {item.buttonText}
                      </Button>
                    </Link>

                    <Link to="/products?sort=latest">
                      <Button
                        variant="outline"
                        className="border-white/70 bg-white/5 text-white hover:bg-white hover:text-black px-7 py-3 backdrop-blur-sm"
                      >
                        Explore Products
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PREVIOUS BUTTON ================= */}
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="
      absolute
      left-3 sm:left-5
      top-1/2
      -translate-y-1/2
      z-20
      w-10 h-10
      sm:w-12 sm:h-12
      rounded-full
      bg-black/40
      hover:bg-black/70
      border border-white/10
      backdrop-blur-sm
      flex items-center justify-center
      transition-all duration-200
      hover:scale-105
    "
        >
          <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* ================= NEXT BUTTON ================= */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="
      absolute
      right-3 sm:right-5
      top-1/2
      -translate-y-1/2
      z-20
      w-10 h-10
      sm:w-12 sm:h-12
      rounded-full
      bg-black/40
      hover:bg-black/70
      border border-white/10
      backdrop-blur-sm
      flex items-center justify-center
      transition-all duration-200
      hover:scale-105
    "
        >
          <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* ================= DOTS ================= */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-yellow-400"
                  : "w-2 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* ================= SLIDE COUNTER ================= */}
        <div className="absolute bottom-5 right-5 sm:right-8 z-20 hidden sm:block">
          <span className="text-sm text-white/80">
            {String(currentSlide + 1).padStart(2, "0")} /{" "}
            {String(heroSlides.length).padStart(2, "0")}
          </span>
        </div>
      </section>
      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link
            to="/products"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="mt-4 text-center font-semibold text-gray-800 group-hover:text-blue-600">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
      {/* Deal Banner */}
      {/* <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-wide font-semibold opacity-90">
                Limited Time
              </p>
              <h3 className="text-3xl font-bold mt-2">
                Lightning Deals Up to 70% Off
              </h3>
              <p className="mt-2 text-orange-100">
                Grab your favorite gadgets and accessories before the deal ends.
              </p>
            </div>

            <Link to="/products?sort=discount">
              <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-6 py-3">
                View Deals
              </Button>
            </Link>
          </div>
        </section> */}
      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Trending Products
          </h2>
          <Link
            to="/products?sort=popular"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            See more
          </Link>
        </div>

        {loading.fetch ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 animate-pulse border border-gray-100"
              >
                <div className="bg-gray-200 h-40 rounded-xl" />
                <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
      {/* Featured Sellers */}
      {/* Why Choose Us */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Why Shop With Us?
            </h2>
            <p className="text-gray-500 mt-2">
              Everything you need for a secure and smooth shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl">🚚</div>
              <h3 className="mt-3 font-semibold">Fast Delivery</h3>
              <p className="text-sm text-gray-500 mt-1">Across India</p>
            </div>

            <div className="p-4">
              <div className="text-4xl">🔒</div>
              <h3 className="mt-3 font-semibold">Secure Payments</h3>
              <p className="text-sm text-gray-500 mt-1">100% protected</p>
            </div>

            <div className="p-4">
              <div className="text-4xl">↩️</div>
              <h3 className="mt-3 font-semibold">Easy Returns</h3>
              <p className="text-sm text-gray-500 mt-1">Hassle-free</p>
            </div>

            <div className="p-4">
              <div className="text-4xl">🎧</div>
              <h3 className="mt-3 font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-500 mt-1">Always available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

// import React from "react";

// const Home = () => {
//   return <div>Home</div>;
// };

// export default Home;
