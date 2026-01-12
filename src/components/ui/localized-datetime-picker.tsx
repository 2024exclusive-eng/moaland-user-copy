"use client";

import { ko, zhCN, enUS } from "date-fns/locale";
import { usePathname } from "next/navigation";
import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// Register locales
registerLocale("ko", ko);
registerLocale("zh", zhCN);
registerLocale("en", enUS);

interface LocalizedDateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  disabled?: boolean;
}

export function LocalizedDateTimePicker({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  className = "",
  disabled = false,
}: LocalizedDateTimePickerProps) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "ko";

  // Map app locale to date-fns locale
  const getDateFnsLocale = () => {
    switch (locale) {
      case "zh":
        return "zh";
      case "en":
        return "en";
      default:
        return "ko";
    }
  };

  // Get date format based on locale
  const getDateFormat = () => {
    switch (locale) {
      case "zh":
        return "yyyy年MM月dd日 HH:mm";
      case "en":
        return "yyyy/MM/dd hh:mm aa";
      default:
        return "yyyy. MM. dd. aa hh:mm";
    }
  };

  // Get time format based on locale
  const getTimeFormat = () => {
    switch (locale) {
      case "zh":
        return "HH:mm";
      case "en":
        return "hh:mm aa";
      default:
        return "aa hh:mm";
    }
  };

  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      showTimeSelect
      timeFormat={getTimeFormat()}
      timeIntervals={30}
      dateFormat={getDateFormat()}
      locale={getDateFnsLocale()}
      placeholderText={placeholder}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      className={`w-full h-10 px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-sm text-black placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea3a50] ${className}`}
      wrapperClassName="w-full"
      timeCaption={locale === "zh" ? "时间" : locale === "en" ? "Time" : "시간"}
    />
  );
}
