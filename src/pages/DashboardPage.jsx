import { useSelector, useDispatch } from "react-redux";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Masonry from "react-masonry-css";
import {
  toggleWidget,
  reorderWidgets,
  setMaximizedWidget,
  clearMaximizedWidget,
} from "../app/features/dashboard/dashboardSlice";
import WidgetCard from "../components/WidgetCard";
import CalculatorWidget from "../components/widgets/CalculatorWidget";
import WeatherWidget from "../components/widgets/WeatherWidget";
import DiaryWidget from "../components/widgets/DiaryWidget";
import KitchenWidget from "../components/widgets/KitchenWidget";
import MiniGameWidget from "../components/widgets/MiniGameWidget";
import NewsWidget from "../components/widgets/NewsWidget";
import ConverterWidget from "../components/widgets/ConverterWidget";
import CryptoWidget from "../components/widgets/CryptoWidget";
import {
  WeatherIcon,
  NewsIcon,
  CryptoIcon,
  CalculatorIcon,
  DiaryIcon,
  KitchenIcon,
  GameIcon,
  ConverterIcon,
} from "../components/Icons";
import "./DashboardPage.css";
import React from "react";

const widgetComponents = {
  weather: <WeatherWidget />,
  news: <NewsWidget />,
  crypto: <CryptoWidget />,
  calculator: <CalculatorWidget />,
  diary: <DiaryWidget />,
  kitchen: <KitchenWidget />,
  game: <MiniGameWidget />,
  converter: <ConverterWidget />,
};

const allWidgets = [
  { key: "weather", name: "Weather", icon: <WeatherIcon /> },
  { key: "news", name: "World News", icon: <NewsIcon /> },
  { key: "crypto", name: "Crypto Tracker", icon: <CryptoIcon /> },
  { key: "calculator", name: "Calculator", icon: <CalculatorIcon /> },
  { key: "diary", name: "Diary", icon: <DiaryIcon /> },
  { key: "kitchen", name: "Kitchen", icon: <KitchenIcon /> },
  { key: "game", name: "Mini-Game", icon: <GameIcon /> },
  { key: "converter", name: "Converter", icon: <ConverterIcon /> },
];

const widgetInfoMap = allWidgets.reduce((acc, widget) => {
  acc[widget.key] = widget;
  return acc;
}, {});

function SortableButton({ id, widget }) {
  const dispatch = useDispatch();
  const { visibleWidgets } = useSelector((state) => state.dashboard);
  const isActive = visibleWidgets.includes(id);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const baseClasses =
    "flex items-center gap-2.5 px-3.5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ease-in-out transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-blue-500";
  const activeClasses = "bg-blue-600 text-white shadow-lg hover:bg-blue-500 scale-105";
  const inactiveClasses =
    "bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 hover:scale-105";

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        type="button"
        onClick={() => dispatch(toggleWidget(widget.key))}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <span className="w-5 h-5">{widget.icon}</span>
        <span>{widget.name}</span>
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { visibleWidgets, widgetOrder, maximizedWidget } = useSelector((state) => state.dashboard);

  const availableWidgetsInOrder = widgetOrder.filter((key) =>
    Object.prototype.hasOwnProperty.call(widgetInfoMap, key)
  );
  const orderedVisibleWidgets = availableWidgetsInOrder.filter((key) =>
    visibleWidgets.includes(key)
  );

  const breakpointColumnsObj = { default: 2, 1024: 2, 768: 1 };
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = widgetOrder.indexOf(active.id);
      const newIndex = widgetOrder.indexOf(over.id);
      dispatch(reorderWidgets(arrayMove(widgetOrder, oldIndex, newIndex)));
    }
  }

  const handleMaximize = (widgetKey) => {
    dispatch(setMaximizedWidget(widgetKey));
  };

  const handleMinimize = () => {
    dispatch(clearMaximizedWidget());
  };

  const renderMaximizedWidget = () => {
    if (!maximizedWidget) return null;
    const widget = widgetInfoMap[maximizedWidget];
    const component = widgetComponents[maximizedWidget];
    return (
      <div className="animate-fade-in w-full">
        <WidgetCard
          title={widget.name}
          widgetKey={widget.key}
          isMaximized={true}
          onMinimize={handleMinimize}
        >
          {React.cloneElement(component, { isMaximized: true })}
        </WidgetCard>
      </div>
    );
  };

  const renderWidgetGrid = () => (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {orderedVisibleWidgets.map((widgetKey) => {
        const widget = widgetInfoMap[widgetKey];
        const component = widgetComponents[widgetKey];
        return (
          <div key={widget.key} className="animate-fade-in">
            <WidgetCard
              title={widget.name}
              widgetKey={widget.key}
              isMaximized={false}
              onMaximize={handleMaximize}
            >
              {React.cloneElement(component, { isMaximized: false })}
            </WidgetCard>
          </div>
        );
      })}
    </Masonry>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16 px-6 rounded-2xl shadow-lg ring-1 ring-black/5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl transition-colors duration-300">
      <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
        <svg
          className="w-10 h-10 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Your Dashboard is Bright and Empty
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
        Use the controls above to add and organize your favorite widgets.
      </p>
    </div>
  );

  return (
    <>
      <div className="p-5 rounded-2xl shadow-lg mb-8 ring-1 ring-black/5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl transition-colors duration-300">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Dashboard Controls
        </h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={availableWidgetsInOrder} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap items-center gap-2">
              {availableWidgetsInOrder.map((widgetKey) => {
                const widget = widgetInfoMap[widgetKey];
                return <SortableButton key={widgetKey} id={widgetKey} widget={widget} />;
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="w-full">
        {maximizedWidget
          ? renderMaximizedWidget()
          : orderedVisibleWidgets.length > 0
          ? renderWidgetGrid()
          : renderEmptyState()}
      </div>
    </>
  );
}
