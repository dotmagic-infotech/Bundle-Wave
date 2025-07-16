// React Imports
import { useState } from "react";

// Shopify Imports
import {
    Button,
    Popover,
    DatePicker,
    TextField,
    InlineStack,
    Icon,
    Select,
} from "@shopify/polaris";

// Shopify Icons
import { CalendarIcon, ArrowRightIcon } from "@shopify/polaris-icons";

const DateRangePicker = ({ onDateRangeChange }) => {

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const ranges = [
        { title: "Today", alias: "today", period: { since: today, until: today } },
        { title: "Yesterday", alias: "yesterday", period: { since: yesterday, until: yesterday } },
        {
            title: "Last 7 Days",
            alias: "last7days",
            period: { since: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), until: yesterday },
        },
        {
            title: "Last Month",
            alias: "lastmonth",
            period: { since: firstDayOfLastMonth, until: lastDayOfLastMonth },
        },
        {
            title: "Custom",
            alias: "custom",
            period: { since: today, until: today },
        },
    ];

    // State
    const [popoverActive, setPopoverActive] = useState(false);
    const [activeDateRange, setActiveDateRange] = useState(ranges[2]);

    const [{ month, year }, setDate] = useState({
        month: activeDateRange.period.since.getMonth(),
        year: activeDateRange.period.since.getFullYear(),
    });

    const [selectedDates, setSelectedDates] = useState({
        start: activeDateRange.period.since,
        end: activeDateRange.period.until,
    });

    const formatDate = (date) => {
        const data = date
            ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0]
            : ""

        return data;
    }

    const handleDateRangeChange = (newRange) => {
        setActiveDateRange(newRange);
        setSelectedDates({
            start: newRange.period.since,
            end: newRange.period.until,
        });
        setDate({
            month: newRange.period.since.getMonth(),
            year: newRange.period.since.getFullYear(),
        });

        onDateRangeChange(newRange);
    }

    const handleCalendarChange = ({ start, end }) => {
        setSelectedDates({ start, end });
        setActiveDateRange(ranges.find((r) => r.alias === "custom"));
    }

    const apply = () => {
        setActiveDateRange({
            title: "Custom",
            alias: "custom",
            period: { since: selectedDates.start, until: selectedDates.end },
        });
        setPopoverActive(false);
        onDateRangeChange({
            title: "Custom",
            alias: "custom",
            period: { since: selectedDates.start, until: selectedDates.end },
        });
    }

    return (
        <Popover
            active={popoverActive}
            activator={
                <Button icon={CalendarIcon} onClick={() => setPopoverActive(!popoverActive)}>
                    {formatDate(selectedDates.start)} ~ {formatDate(selectedDates.end)}
                </Button>
            }
            onClose={() => setPopoverActive(false)}
        >
            <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Select
                    label="Date range"
                    options={ranges.map((range) => ({
                        value: range.alias,
                        label: range.title,
                    }))}
                    onChange={(value) => {
                        const selectedRange = ranges.find((range) => range.alias === value);
                        if (selectedRange) {
                            handleDateRangeChange(selectedRange);
                        }
                        if (value !== "custom") {
                            setPopoverActive(false);
                        }
                    }}
                    value={activeDateRange.alias}
                />

                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ width: "50%" }}>
                        <TextField
                            value={selectedDates.start
                                ? new Date(selectedDates.start.getTime() - selectedDates.start.getTimezoneOffset() * 60000)
                                    .toISOString()
                                    .split("T")[0]
                                : ""}
                            prefix={<Icon source={CalendarIcon} />}
                            onChange={(newValue) => {
                                setSelectedDates((prev) => ({
                                    ...prev,
                                    start: new Date(newValue),
                                }));
                            }}
                            type="date"
                        />
                    </div>
                    <Icon source={ArrowRightIcon} />
                    <div style={{ width: "50%" }}>
                        <TextField
                            value={selectedDates.end
                                ? new Date(selectedDates.end.getTime() - selectedDates.end.getTimezoneOffset() * 60000)
                                    .toISOString()
                                    .split("T")[0]
                                : ""}
                            prefix={<Icon source={CalendarIcon} />}
                            onChange={(newValue) => {
                                setSelectedDates((prev) => ({
                                    ...prev,
                                    end: new Date(newValue),
                                }));
                            }}
                            type="date"
                        />
                    </div>
                </div>

                <DatePicker
                    month={month}
                    year={year}
                    selected={selectedDates}
                    onMonthChange={(month, year) => setDate({ month, year })}
                    onChange={handleCalendarChange}
                    disableDatesAfter={new Date(new Date().setDate(new Date().getDate()))}
                    allowRange
                />

                <InlineStack gap="200" align="end">
                    <Button onClick={() => setPopoverActive(false)}>Cancel</Button>
                    <Button primary onClick={apply} style={{ marginLeft: "10px" }}>
                        Apply
                    </Button>
                </InlineStack>
            </div>
        </Popover>
    );
}

export default DateRangePicker;
