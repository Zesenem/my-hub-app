import { useSelector, useDispatch } from "react-redux";
import {
  digitPressed,
  operatorPressed,
  equalsPressed,
  clearPressed,
  toggleSignPressed,
  percentPressed,
} from "../../app/features/calculator/calculatorSlice";

const CalcButton = ({ onClick, label, variant = "default", className = "" }) => {
  const baseClasses =
    "flex items-center justify-center h-16 text-2xl font-semibold rounded-2xl shadow-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 active:scale-95";

  const variants = {
    default:
      "bg-gray-200/80 text-gray-800 hover:bg-gray-300/90 dark:bg-gray-700/80 dark:text-gray-100 dark:hover:bg-gray-600/90",
    operator:
      "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-300/50 dark:shadow-orange-900/80",
    action:
      "bg-gray-400/80 text-gray-900 hover:bg-gray-500/80 dark:bg-gray-500/80 dark:text-gray-50 dark:hover:bg-gray-500/90",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {label}
    </button>
  );
};

export default function CalculatorWidget() {
  const dispatch = useDispatch();
  const display = useSelector((state) => state.calculator.display);

  const buttons = [
    { label: "AC", action: () => dispatch(clearPressed()), variant: "action" },
    { label: "+/-", action: () => dispatch(toggleSignPressed()), variant: "action" },
    { label: "%", action: () => dispatch(percentPressed()), variant: "action" },
    { label: "÷", action: () => dispatch(operatorPressed({ operator: "/" })), variant: "operator" },
    { label: "7", action: () => dispatch(digitPressed({ digit: "7" })) },
    { label: "8", action: () => dispatch(digitPressed({ digit: "8" })) },
    { label: "9", action: () => dispatch(digitPressed({ digit: "9" })) },
    { label: "×", action: () => dispatch(operatorPressed({ operator: "*" })), variant: "operator" },
    { label: "4", action: () => dispatch(digitPressed({ digit: "4" })) },
    { label: "5", action: () => dispatch(digitPressed({ digit: "5" })) },
    { label: "6", action: () => dispatch(digitPressed({ digit: "6" })) },
    { label: "-", action: () => dispatch(operatorPressed({ operator: "-" })), variant: "operator" },
    { label: "1", action: () => dispatch(digitPressed({ digit: "1" })) },
    { label: "2", action: () => dispatch(digitPressed({ digit: "2" })) },
    { label: "3", action: () => dispatch(digitPressed({ digit: "3" })) },
    { label: "+", action: () => dispatch(operatorPressed({ operator: "+" })), variant: "operator" },
    { label: "0", action: () => dispatch(digitPressed({ digit: "0" })), className: "col-span-2" },
    { label: ".", action: () => dispatch(digitPressed({ digit: "." })) },
    { label: "=", action: () => dispatch(equalsPressed()), variant: "operator" },
  ];

  return (
    <div className="w-full max-w-xs mx-auto p-2">
      <div className="text-right text-5xl font-light p-4 mb-3 rounded-2xl bg-gray-100 dark:bg-gray-900/60 text-gray-900 dark:text-white overflow-x-auto">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <CalcButton
            key={btn.label}
            label={btn.label}
            onClick={btn.action}
            variant={btn.variant}
            className={btn.className}
          />
        ))}
      </div>
    </div>
  );
}
