import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCryptoData } from "../../app/features/crypto/cryptoSlice";
import Spinner from "../Spinner";

const CRYPTO_INFO = {
  bitcoin: {
    name: "Bitcoin",
    icon: (
      <svg
        className="w-8 h-8 text-yellow-500"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 8H14C15.1046 8 16 8.89543 16 10C16 11.1046 15.1046 12 14 12M10 8V12M10 8H8.5M10 8V6.5M14 12H10M14 12C15.1046 12 16 12.8954 16 14C16 15.1046 15.1046 16 14 16H10M10 12V16M10 16H8.5M10 16V17.5M13 8V6.5M13 17.5V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  ethereum: {
    name: "Ethereum",
    icon: (
      <svg
        className="w-8 h-8 text-gray-700 dark:text-gray-300"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 3.20798L6.97874 10.1605L12 12.8643L17.0213 10.1605L12 3.20798ZM11.0272 1.13901C11.5062 0.4758 12.4938 0.475796 12.9728 1.13901L19.1771 9.72952C19.6017 10.3175 19.4118 11.1448 18.7732 11.4887L12.5689 14.8294C12.2138 15.0207 11.7863 15.0207 11.4311 14.8294L5.22683 11.4887C4.58826 11.1448 4.3983 10.3175 4.82294 9.72952L11.0272 1.13901Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.7098 13.5271C18.8691 12.9474 19.9967 14.3627 19.1728 15.3632L12.9263 22.9482C12.4463 23.5311 11.5537 23.5311 11.0737 22.9482L4.82719 15.3632C4.00325 14.3627 5.13091 12.9474 6.29016 13.5271L12 16.382L17.7098 13.5271ZM16 16.5L12.5367 18.3497C12.1988 18.5186 11.8012 18.5186 11.4633 18.3497L8 16.5L12 20.927L16 16.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  dogecoin: {
    name: "Dogecoin",
    icon: (
      <svg
        className="w-8 h-8 text-amber-600"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5 16C17.75 16 17.75 8 12.5 8H11C9.89543 8 9 8.89543 9 10V14C9 15.1046 9.89543 16 11 16H12.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 12H11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
};

const CryptoItem = ({ coinData, coinInfo }) => {
  const change = coinData.usd_24h_change;
  const isPositive = change >= 0;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/60 rounded-xl hover:bg-gray-100/90 dark:hover:bg-gray-700/80 transition-colors duration-200">
      <div className="flex items-center gap-4">
        {coinInfo.icon}
        <div>
          <p className="font-bold text-gray-800 dark:text-gray-100">{coinInfo.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">USD</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
          ${coinData.usd.toLocaleString()}
        </p>
        <div
          className={`flex items-center justify-end text-sm font-semibold ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          <svg className="w-4 h-4 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
            {isPositive ? (
              <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 01-.75-.75V5.612L5.28 9.64a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v10.638l3.97-3.968a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l3.97 3.968V3.75A.75.75 0 0110 3z"
                clipRule="evenodd"
              />
            )}
          </svg>
          <span>{change.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

const ErrorState = ({ error }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full mb-3">
      <svg
        className="w-8 h-8 text-red-600 dark:text-red-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.636-1.214 2.476-1.214 3.112 0l5.57 10.647A1.75 1.75 0 0115.253 16H4.42a1.75 1.75 0 01-1.686-2.254l5.523-10.647zM10 9a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 0110 9zm0 6a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <p className="font-semibold text-gray-700 dark:text-gray-200">Failed to load prices</p>
    <p className="text-sm text-red-500 dark:text-red-400 mt-1 max-w-xs">{error}</p>
  </div>
);

export default function CryptoWidget() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCryptoData());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <Spinner text="Loading prices..." />;
  }

  if (status === "failed") {
    return <ErrorState error={error} />;
  }

  if (status === "succeeded") {
    return (
      <div className="space-y-3">
        {Object.keys(data).map((key) => {
          const coinData = data[key];
          const coinInfo = CRYPTO_INFO[key];
          if (!coinData || !coinInfo) return null;

          return <CryptoItem key={key} coinData={coinData} coinInfo={coinInfo} />;
        })}
      </div>
    );
  }

  return null;
}
