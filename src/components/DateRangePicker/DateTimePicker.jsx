// React Imports
import React, { useState } from "react";

// Shopify Imports
import { Popover, TextField, Icon, Listbox, DatePicker } from "@shopify/polaris";

// Shopify Icons
import { ClockIcon, CalendarIcon } from "@shopify/polaris-icons";

// Custom Component
import { timeOptions } from "../../utils/time_options";

const DateTimePicker = ({
    label,
    dateValue,
    timeValue,
    onDateChange,
    onTimeChange,
}) => {

    // State
    const [popoverActiveDate, setPopoverActiveDate] = useState(false);
    const [popoverActiveTime, setPopoverActiveTime] = useState(false);
    const [{ month, year }, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });

    const togglePopoverDate = () => setPopoverActiveDate((prev) => !prev);
    const togglePopoverTime = () => setPopoverActiveTime((prev) => !prev);

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "50%" }}>
                <Popover
                    active={popoverActiveDate}
                    activator={
                        <TextField
                            label={`${label} Date`}
                            value={dateValue
                                ? new Date(dateValue.getTime() - dateValue.getTimezoneOffset() * 60000)
                                    .toISOString()
                                    .split("T")[0]
                                : ""}
                            onFocus={togglePopoverDate}
                            onChange={() => { }}
                            prefix={<Icon source={CalendarIcon} />}
                            autoComplete="off"
                        />
                    }
                    onClose={togglePopoverDate}
                    preferredAlignment="left"
                >
                    <div style={{ padding: "10px" }}>
                        <DatePicker
                            month={month}
                            year={year}
                            onMonthChange={(month, year) => setDate({ month, year })}
                            onChange={onDateChange}
                            selected={dateValue || new Date()}
                            disableDatesBefore={new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </div>
                </Popover>
            </div>
            <div style={{ width: "50%" }}>
                <Popover
                    active={popoverActiveTime}
                    activator={
                        <TextField
                            label={`${label} Time (Asia/Calcutta)`}
                            value={timeValue}
                            onFocus={togglePopoverTime}
                            onChange={() => { }}
                            prefix={<Icon source={ClockIcon} />}
                            autoComplete="off"
                        />
                    }
                    onClose={togglePopoverTime}
                    preferredAlignment="center"
                >
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        <Listbox
                            onSelect={(selectedValue) => {
                                onTimeChange(selectedValue);
                                setPopoverActiveTime(false);
                            }}
                        >
                            {timeOptions.map((time, index) => (
                                <Listbox.Option key={index} value={time}>
                                    {time}
                                </Listbox.Option>
                            ))}
                        </Listbox>
                    </div>
                </Popover>
            </div>
        </div>
    );
};

export default DateTimePicker;
