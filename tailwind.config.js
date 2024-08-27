/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "screen-1/2": "50vh",
        "screen-1/3": "33.333333vh",
        "screen-2/3": "66.666667vh",
        "screen-1/4": "25vh",
        "screen-3/4": "75vh",
        screen: "100vh",
      },
      width: {
        screen: "100vw",
      },
      textColor: {
        labelFaint: "#9CA3AF",
        labelMuted: "#6b7076",
      },
      backgroundColor: {
        controlSelected: "#F3F4F6",
      },
    },
  },
  plugins: [],
};
