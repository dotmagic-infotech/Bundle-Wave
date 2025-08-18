// React Imports
import { useContext, useEffect, useState } from 'react'

// Shopify Imports
import { Badge, BlockStack, Button, ButtonGroup, Card, DataTable, Grid, Icon, InlineGrid, Layout, Page, Pagination, Text, useBreakpoints } from '@shopify/polaris';
import { AffiliateIcon, CartIcon, CashDollarFilledIcon, CursorFilledIcon, OrderIcon, PersonFilledIcon, ViewIcon } from '@shopify/polaris-icons';

// Third Party Impots
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker';
import Chart from "react-apexcharts";

// Custom Component
import { ShopifyContext } from '../../components/ShopifyProvider/ShopifyProvider';
import { useApiRequest } from '../../components/FetchDataAPIs';

const Analytics = () => {

    // Hooks
    const { shopName, currencySymbol } = useContext(ShopifyContext);
    const apiRequest = useApiRequest();

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // State
    const [selectedDateRange, setSelectedDateRange] = useState({
        title: "Last 7 Days",
        alias: "last7days",
        period: {
            since: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
            until: yesterday
        }
    });
    const [tableData, setTableData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState({
        type: "bundle"
    });

    const formatDateLocal = (date) => {
        if (!(date instanceof Date)) return "";
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split("T")[0];
    };

    const startDate = formatDateLocal(selectedDateRange?.period?.since);
    const endDate = formatDateLocal(selectedDateRange?.period?.until);

    const fetchAnalyticsData = async (page) => {
        try {
            const url = `https://bundle-wave-backend.xavierapps.com/api/bundles_analytics?shop=${shopName}&limit=10&pagenumber=${page}&startData=${startDate}&endDate=${endDate}`;
            const { status, data } = await apiRequest(url, 'GET');

            if (status) {
                setTableData(data);
            }
        } catch (error) {
            console.log("error::", error)
        }
    };

    const fetchOrderData = async () => {
        try {
            const url = `https://bundle-wave-backend.xavierapps.com/api/orders_analytics?shop=${shopName}&limit=10&pagenumber=${currentPage}&startData=${startDate}&endDate=${endDate}`;
            const { status, data } = await apiRequest(url, 'GET');

            if (status) {
                setOrderData(data);
            }
        } catch (error) {
            console.log("error::", error)
        }
    };

    useEffect(() => {
        if (data?.type === "bundle") {
            fetchAnalyticsData(currentPage);
        } else {
            fetchOrderData();
        }
    }, [startDate, endDate, currentPage, data?.type]);

    const { lgDown } = useBreakpoints();
    const fixedFirstColumns = lgDown ? 2 : 0;

    const handleChangeValue = (key, value) => {
        setData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
        setCurrentPage(1);
    };

    const analiticsData = [
        { name: "Bundles views", icon: ViewIcon, data: tableData?.analytics?.bundles_views || 0, },
        { name: "Bundles clicks", icon: CursorFilledIcon, data: tableData?.analytics?.bundles_clicks || 0, },
        { name: "Number of sold bundles", icon: CartIcon, data: tableData?.analytics?.bundle_sales_number || 0, },
        { name: "Sales value on bundles", icon: CashDollarFilledIcon, data: `${currencySymbol} ${tableData?.analytics?.bundle_sales_value || 0}` },
    ];

    const buildBundleChart = () => {
        const seriesData = tableData?.analytics?.bundle_chart.map(item => parseFloat(item?.count));
        const labelsData = tableData?.analytics?.bundle_chart.map(item => item?.bundle_name);

        const hasBundles = tableData?.analytics?.bundle_chart?.length > 0 &&
            tableData.analytics.bundle_chart.some(point => point.count > 0);

        return {
            hasBundles,
            series: seriesData,
            options: {
                chart: {
                    type: 'donut',
                },
                labels: labelsData,
                colors: ['#BD75D6', '#E9662A', '#3BAFDA', '#4CC36D', '#F4C542', '#F15887'],
                plotOptions: {
                    pie: {
                        donut: {
                            size: '75%',
                            labels: {
                                show: true,
                                name: { show: true },
                                value: { show: true },
                                total: {
                                    show: true,
                                    label: 'Total Bundles',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    formatter: function (w) {
                                        return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                    }
                                }
                            }
                        }
                    }
                },
                stroke: {
                    show: true,
                    width: 5,
                    colors: ['#fff'],
                },
                dataLabels: {
                    formatter: () => '',
                },
                tooltip: {
                    y: {
                        formatter: val => val,
                    }
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    fontSize: '14px',
                    labels: { colors: '#333' },
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: { position: 'bottom' }
                        }
                    }
                ],
            }
        };
    };

    const buildRevenueChart = () => {
        const formattedSeriesData = tableData?.analytics?.revenue_data?.map(item => ({
            x: new Date(item.sale_date),
            y: parseFloat(item.total_sales)
        })) || [];

        const revenue = formattedSeriesData.length > 0 && formattedSeriesData.some(point => point.y > 0);
        return {
            revenue,
            series: [{
                name: "Revenue",
                data: formattedSeriesData
            }],
            options: {
                chart: {
                    type: 'area',
                    height: 350,
                    zoom: {
                        enabled: true,
                        type: 'x',
                        autoScaleYaxis: true
                    },
                    toolbar: {
                        show: false
                    }
                },
                stroke: {
                    curve: 'straight',
                    width: 2
                },
                colors: ['#22C55E'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.8,
                        stops: [0, 100]
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: false,
                        format: 'dd MMM'
                    },
                },
                yaxis: {
                    labels: {
                        show: false
                    }
                },
                grid: {
                    show: false
                },
                tooltip: {
                    enabled: true
                },
                dataLabels: {
                    enabled: false
                }
            }
        }
    }

    const buildSalesOrderNumber = () => {
        const dateOrder = tableData?.analytics?.number_of_order?.map(entry => entry.sale_date) || [];
        const orderNumbers = tableData?.analytics?.number_of_order?.map(entry => entry.total_orders) || [];

        const hasOrders = orderNumbers.length > 0 && orderNumbers.some(order => order > 0);

        return {
            hasOrders,
            series: [{
                name: 'Order',
                data: orderNumbers
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                    toolbar: {
                        show: false,
                    },
                },
                plotOptions: {
                    bar: {
                        borderRadius: 0,
                        columnWidth: '50%',
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 0
                },
                grid: {
                    show: false
                },
                xaxis: {
                    type: 'datetime',
                    categories: dateOrder,
                    labels: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    },
                },
                yaxis: {
                    // title: {
                    //     text: 'Order',
                    // },
                    labels: {
                        show: false
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: "horizontal",
                        shadeIntensity: 0.5,
                        gradientToColors: ['#00B8D9'],
                        inverseColors: false,
                        opacityFrom: 0.9,
                        opacityTo: 0.9,
                        stops: [0, 100]
                    },
                    colors: ['#1E90FF']
                },
                tooltip: {
                    enabled: true,
                    shared: true,
                    intersect: false,
                    style: {
                        fontSize: '12px'
                    },
                    y: {
                        formatter: function (val) {
                            return `${val} orders`;
                        }
                    }
                }
            },
        }
    }

    const buildCustomerChart = () => {
        const dates = tableData?.analytics?.customers_data.map(entry => entry.date);
        const newCustomers = tableData?.analytics?.customers_data.map(entry => entry.new_customers);
        const repeatCustomers = tableData?.analytics?.customers_data.map(entry => entry.repeat_customers);

        const hasData =
            (newCustomers.length > 0 && newCustomers.some(val => val > 0)) ||
            (repeatCustomers.length > 0 && repeatCustomers.some(val => val > 0));

        return {
            hasData,
            series: [
                { name: 'New Customer', type: 'area', data: newCustomers },
                { name: 'Repeat Customer', type: 'line', data: repeatCustomers }
            ],
            options: {
                chart: { height: 350, type: 'line', toolbar: { show: false } },
                colors: ['#3B82F6', '#22C55E'],
                stroke: { curve: 'smooth', width: [2, 3] },
                fill: { type: 'solid', opacity: [0.25, 1] },
                labels: dates,
                markers: {
                    size: 4,
                    colors: ['#3B82F6', '#22C55E'],
                    strokeColors: '#fff',
                    strokeWidth: 2
                },
                xaxis: { type: 'category', crosshairs: { width: 1 }, labels: { show: false } },
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: y => (typeof y !== "undefined" ? `${y.toFixed(0)} customers` : y)
                    }
                }
            }
        };
    }

    return (
        <Page title="Analytics" fullWidth>
            <Layout>
                <Layout.Section>
                    <BlockStack gap={"500"}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <ButtonGroup variant="segmented">
                                <Button
                                    variant={data.type === "bundle" ? 'primary' : 'secondary'}
                                    pressed={data.type === "bundle"}
                                    onClick={() => {
                                        handleChangeValue("type", "bundle")
                                    }}  
                                >
                                    Based on bundle
                                </Button>
                                <Button
                                    variant={data.type === "order" ? 'primary' : 'secondary'}
                                    pressed={data.type === "order"}
                                    onClick={() => {
                                        handleChangeValue("type", "order")
                                    }}
                                >
                                    Based on order
                                </Button>
                            </ButtonGroup>

                            <DateRangePicker onDateRangeChange={setSelectedDateRange} />
                        </div>

                        {data?.type === "bundle" ? (
                            <InlineGrid gap="400" columns={analiticsData?.length}>
                                {analiticsData?.map((v, i) => (
                                    <Card key={i}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ fontSize: "14px", fontWeight: 600 }}>{v.name}</p>
                                            <div>
                                                <Icon source={v.icon} tone="base" />
                                            </div>
                                        </div>
                                        <p style={{ fontWeight: "600", fontSize: "1.3rem", marginTop: "12px" }}>{v?.data}</p>
                                    </Card>
                                ))}
                            </InlineGrid>
                        ) : (
                            <InlineGrid gap="400" columns={2}>
                                <Card>
                                    <p>Number of bundles</p>
                                    <p style={{ fontWeight: "600", fontSize: "1.3rem", marginTop: "12px" }}>{orderData?.orders?.total_sales_number || 0}</p>
                                </Card>
                                <Card>
                                    <p>Number of orders that include bundles</p>
                                    <p style={{ fontWeight: "600", fontSize: "1.3rem", marginTop: "12px" }}>{currencySymbol} {orderData?.orders?.total_sales_value || 0}</p>
                                </Card>
                            </InlineGrid>
                        )}

                        {data?.type === "bundle" ? (
                            <Grid>
                                {/* Bundles Chart 1 */}
                                <Grid.Cell columnSpan={{ xs: 6, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                    {tableData?.analytics?.bundle_chart.length > 0 &&
                                        <Card padding={0}>
                                            <div style={{ padding: "10px 10px 0px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
                                                <div><Icon source={AffiliateIcon} tone='base' /></div>
                                                <Text as='h3' variant='headingLg'>Total Bundles</Text>
                                            </div>
                                            <div style={{ margin: '32px 0px 0px 0px', transform: "translatey(-11px)" }}>
                                                {(() => {
                                                    const chart = buildBundleChart();
                                                    return chart.hasBundles ? (
                                                        <Chart options={chart.options} series={chart.series} type="donut" height={360} width="100%" />
                                                    ) : (
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            height: '360px',
                                                            fontSize: '1rem'
                                                        }}>
                                                            No bundle data available.
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </Card>
                                    }
                                </Grid.Cell>
                                {/* Revenue Chart 2 */}
                                <Grid.Cell columnSpan={{ xs: 6, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                    {tableData?.analytics?.revenue_data.length > 0 &&
                                        <Card padding={0}>
                                            <div style={{ padding: "10px 10px 0px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
                                                <div><Icon source={CashDollarFilledIcon} tone='base' /></div>
                                                <Text as='h3' variant='headingLg'>Revenue Over Time</Text>
                                            </div>
                                            <div style={{ margin: '17px -6px 0px -20px', transform: "translateY(29px)" }}>
                                                {(() => {
                                                    const chart = buildRevenueChart();
                                                    return chart.revenue ? (
                                                        <Chart options={chart.options} series={chart.series} type="area" height={360} />
                                                    ) : (
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            fontSize: "1rem",
                                                            paddingBottom: "40px",
                                                            height: "360px"
                                                        }}>
                                                            No revenue data available.
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </Card>
                                    }
                                </Grid.Cell>
                                {/* Order Number Chart 3 */}
                                <Grid.Cell columnSpan={{ xs: 6, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                    {tableData?.analytics?.number_of_order.length > 0 &&
                                        <Card padding={0}>
                                            <div style={{ padding: "10px 10px 0px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
                                                <div><Icon source={OrderIcon} tone='base' /></div>
                                                <Text as='h3' variant='headingLg'>Number of Orders by Day</Text>
                                            </div>
                                            <div style={{ margin: '0px -8px 0px 0px', transform: "translateY(29px)" }}>
                                                {(() => {
                                                    const chart = buildSalesOrderNumber();
                                                    return chart.hasOrders ? (
                                                        <Chart options={chart.options} series={chart.series} type="bar" height={370} />
                                                    ) : (
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            fontSize: "1rem",
                                                            paddingBottom: "40px",
                                                            height: "375px"
                                                        }}>
                                                            No order data available.
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </Card>
                                    }
                                </Grid.Cell>
                                {/* Customer Chart 4 */}
                                <Grid.Cell columnSpan={{ xs: 6, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                    {tableData?.analytics?.customers_data.length > 0 &&
                                        <Card padding={0}>
                                            <div style={{ padding: "10px 10px 0px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
                                                <div><Icon source={PersonFilledIcon} tone='base' /></div>
                                                <Text as='h3' variant='headingLg'>New vs Returning Customers</Text>
                                            </div>
                                            <div style={{ margin: '0px 0px 0px -9px', transform: "translateY(14px)" }}>
                                                {(() => {
                                                    const chart = buildCustomerChart();
                                                    return chart.hasData ? (
                                                        <Chart options={chart.options} series={chart.series} type="line" height={370} />
                                                    ) : (
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            fontSize: "1rem",
                                                            height: "370px",
                                                            paddingBottom: "20px"
                                                        }}>
                                                            No customer data available.
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </Card>
                                    }
                                </Grid.Cell>
                            </Grid>
                        ) : (
                            <></>
                        )}

                        {data?.type === "bundle" ? (
                            <div style={{ marginBottom: "1rem" }}>
                                {tableData?.bundles?.length > 0 ?
                                    <>
                                        <DataTable
                                            columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text', 'text']}
                                            headings={[
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Bundle items</div>,
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Bundle name</div>,
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Status</div>,
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Clicks</div>,
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Views</div>
                                            ]}
                                            defaultSortDirection="descending"
                                            stickyHeader
                                            verticalAlign='middle'
                                            fixedFirstColumns={fixedFirstColumns}
                                            rows={(tableData?.bundles || []).map(({ media, bundle_name, status, bundles_views }) => [
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                                    {Array.isArray(media)
                                                        ? media.slice(0, 6).map((imgSrc, index) => (
                                                            <img key={index} src={imgSrc?.url} width="50px" height="50px" alt="Bundle Item" style={{ borderRadius: "5px" }} />
                                                        ))
                                                        : <img src={bundleItem} width="50px" height="50px" alt="Bundle Item" />}
                                                </div>,
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>{bundle_name}</div>,
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
                                                    {status === "Published" ? (
                                                        <Badge tone="success">{status}</Badge>
                                                    ) : status === "Draft" ? (
                                                        <Badge tone="info">{status}</Badge>
                                                    ) : (
                                                        <Badge tone="critical">{status}</Badge>
                                                    )}
                                                </div>,
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>12</div>,
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>{bundles_views}</div>,
                                            ])}
                                        />
                                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                            <Pagination
                                                label={`Showing Page ${tableData.pagination.current_page} of ${tableData.pagination.total_pages}`}
                                                hasPrevious={tableData.pagination.current_page > 1}
                                                onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                hasNext={tableData.pagination.current_page < tableData.pagination.total_pages}
                                                onNext={() => setCurrentPage((prev) => prev + 1)}
                                            />
                                        </div>
                                    </>
                                    :
                                    <></>
                                }
                            </div>
                        ) : (
                            <div style={{ marginBottom: "1rem" }}>
                                {orderData?.orders?.orders_data.length > 0 ?
                                    <>
                                        <DataTable
                                            columnContentTypes={['text', 'text', 'text', 'text']}
                                            headings={[
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Order</div>,
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Order date</div>,
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Items</div>,
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Total Tex</div>,
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Total Discount</div>,
                                                <div style={{ width: "100%", color: "black", fontWeight: "500", fontSize: "1rem" }}>Order's total sales</div>
                                            ]}
                                            defaultSortDirection="descending"
                                            initialSortColumnIndex={4}
                                            stickyHeader
                                            fixedFirstColumns={fixedFirstColumns}
                                            rows={(orderData?.orders?.orders_data || []).map(({ order_number, order_date, total_discounts, total_items, total_price, total_tax }) => [
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>{order_number}</div>,
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>{order_date}</div>,
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>{total_items}</div>,
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>{total_tax}</div>,
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>{total_discounts}</div>,
                                                <div style={{ height: "100%", display: "flex", alignItems: "center" }}>{total_price}</div>,
                                            ])}
                                        />
                                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                            <Pagination
                                                label={`Showing Page ${orderData.pagination.current_page} of ${orderData.pagination.total_pages}`}
                                                hasPrevious={orderData.pagination.current_page > 1}
                                                onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                hasNext={orderData.pagination.current_page < orderData.pagination.total_pages}
                                                onNext={() => setCurrentPage((prev) => prev + 1)}
                                            />
                                        </div>
                                    </>
                                    :
                                    <></>
                                }
                            </div>
                        )}
                    </BlockStack>
                </Layout.Section>
            </Layout>
        </Page >
    )
}

export default Analytics