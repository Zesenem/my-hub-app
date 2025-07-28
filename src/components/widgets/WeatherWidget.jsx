import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWeatherByCity, fetchWeatherByCoords } from "../../app/features/weather/weatherSlice";
import Spinner from "../Spinner";

const getGradientByWeather = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return "from-gray-600 to-gray-800";
  if (weatherId >= 300 && weatherId < 600) return "from-blue-500 to-indigo-700";
  if (weatherId >= 600 && weatherId < 700) return "from-cyan-300 to-sky-500";
  if (weatherId === 800) return "from-sky-500 to-blue-600";
  if (weatherId > 800) return "from-slate-500 to-slate-600";
  return "from-indigo-600 to-indigo-800";
};

const CurrentWeatherDisplay = ({ data }) => {
  if (!data || !data.weather) return null;

  const { name, main, weather, sys } = data;
  const { description, id: weatherId } = weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
  const gradient = getGradientByWeather(weatherId);

  return (
    <div className={`text-white p-5 rounded-2xl shadow-lg bg-gradient-to-br ${gradient}`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            {name}, {sys.country}
          </h2>
          <p className="text-base capitalize opacity-90 mt-1">{description}</p>
        </div>
        <img src={iconUrl} alt={description} className="w-24 h-24 -mt-6 -mr-4 drop-shadow-lg" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-base">
        <div className="bg-white/20 p-3 rounded-xl text-center backdrop-blur-sm">
          <p className="font-bold text-4xl">{Math.round(main.temp)}°C</p>
          <p className="text-sm opacity-80">Feels like {Math.round(main.feels_like)}°</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl text-center backdrop-blur-sm">
          <p className="font-bold text-4xl">{main.humidity}%</p>
          <p className="text-sm opacity-80">Humidity</p>
        </div>
      </div>
    </div>
  );
};

const ForecastDisplay = ({ forecastData }) => {
  const fiveDayForecast = useMemo(() => {
    if (!forecastData?.list) return [];

    const dailyData = forecastData.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { temps: [], icons: {} };
      }
      acc[date].temps.push(item.main.temp);
      const icon = item.weather[0].icon.replace("n", "d");
      acc[date].icons[icon] = (acc[date].icons[icon] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(dailyData)
      .map((date) => {
        const day = dailyData[date];
        const mostCommonIcon = Object.keys(day.icons).reduce((a, b) =>
          day.icons[a] > day.icons[b] ? a : b
        );
        return {
          date,
          maxTemp: Math.round(Math.max(...day.temps)),
          minTemp: Math.round(Math.min(...day.temps)),
          icon: mostCommonIcon,
        };
      })
      .slice(0, 5);
  }, [forecastData]);

  if (fiveDayForecast.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">5-Day Forecast</h3>
      <div className="grid grid-cols-5 gap-2 text-center">
        {fiveDayForecast.map((day, index) => {
          const dayName =
            index === 0
              ? "Today"
              : new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });
          const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
          return (
            <div
              key={day.date}
              className="flex flex-col items-center bg-gray-100/80 dark:bg-gray-700/50 p-2 rounded-xl transition-colors hover:bg-gray-200/90 dark:hover:bg-gray-700/80"
            >
              <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{dayName}</p>
              <img
                src={iconUrl}
                alt="weather icon"
                className="w-12 h-12 dark:filter-none [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.3))]"
              />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {day.maxTemp}°
                </span>
                <span className="opacity-70"> / {day.minTemp}°</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function WeatherWidget() {
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const { data, status, error } = useSelector((state) => state.weather);

  useEffect(() => {
    if (status === "idle") {
      navigator.geolocation?.getCurrentPosition(
        (position) =>
          dispatch(
            fetchWeatherByCoords({ lat: position.coords.latitude, lon: position.coords.longitude })
          ),
        () => dispatch(fetchWeatherByCity("Lisbon"))
      );
    }
  }, [dispatch, status]);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (city.trim()) {
        dispatch(fetchWeatherByCity(city.trim()));
        setCity("");
      }
    },
    [dispatch, city]
  );

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="flex group">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter a city..."
            className="flex-grow w-full p-2.5 border-2 border-r-0 border-gray-200 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 group-focus-within:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2.5 rounded-r-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed border-2 border-l-0 border-blue-600 hover:border-blue-700"
            disabled={status === "loading" || !city.trim()}
          >
            {status === "loading" ? (
              <Spinner isButtonSpinner={true} />
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      <div className="mt-4">
        {status === "loading" && !data && <Spinner text="Fetching weather..." />}
        {status === "failed" && (
          <p className="text-center text-red-500 dark:text-red-400 font-semibold pt-4">{error}</p>
        )}
        {data?.current && (
          <div className="animate-fade-in">
            <CurrentWeatherDisplay data={data.current} />
            <ForecastDisplay forecastData={data.forecast} />
          </div>
        )}
      </div>
    </div>
  );
}
