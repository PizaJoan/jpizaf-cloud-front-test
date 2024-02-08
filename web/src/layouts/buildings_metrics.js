import { TokenIsValid } from '../api/auth'
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Menu, Button, DatePicker, Typography, Tabs } from 'antd';
import Moment from 'moment';
import { GetBuildingMetrics } from '../api/buildings';
import Chart from "react-google-charts";
import './buildingMetrics.css';

const { Header, Content } = Layout;
const { Text } = Typography;
const { TabPane } = Tabs;

const BuildingMetrics = () => {
    const navigate = useNavigate();
    const { buildingId } = useParams();
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(Moment('2021-01-01'));
    const [endDate, setEndDate] = useState(Moment('2022-08-01'));
    const [interval, setInterval] = useState('daily');
    const [chartHeight, setChartHeight] = useState(0);

    useEffect(() => {
        function handleResize() {
            setChartHeight(window.innerHeight - 65);
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (!TokenIsValid(localStorage.getItem('test-token'))) {
            navigate("/login");
            navigate(0);
        }
    }, []);

    useEffect(() => {
        const formattedStartDate = startDate.format('YYYY-MM-DD');
        const formattedEndDate = endDate.format('YYYY-MM-DD');
        GetBuildingMetrics(buildingId, formattedStartDate, formattedEndDate, interval)
            .then(metricsData => {
                const tmpData = [
                    [{ type: "date", label: "Day" }, "Average energy consumption"]
                ];

                for (let i = 0; i < metricsData.length - 1; i++) {
                    const row = [new Date(Date.parse(metricsData[i].timestamp)), metricsData[i].value];
                    tmpData.push(row);
                }
                setData(tmpData);
            });
    }, [buildingId, startDate, endDate, interval]);

    const logoutUser = () => {
        localStorage.removeItem('test-token');
        navigate("/login");
        navigate(0);
    };

    const handleStartDateChange = date => {
        setStartDate(date);
    };

    const handleEndDateChange = date => {
        setEndDate(date);
    };

    const handleTabChange = key => {
        setInterval(key === '2' ? 'hourly' : 'daily');
    };

    const goToBookmarks = () => {
        navigate("/bookmarks");
        navigate(0);
    };

    const goToBuildings = () => {
        navigate("/buildings");
        navigate(0);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header>
                <Text style={{ color: '#fff' }}>My Buildings</Text>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['metrics']}>
                    <Menu.Item key="all" onClick={goToBuildings}>All</Menu.Item>
                    <Menu.Item key="bookmarks" onClick={goToBookmarks}>Bookmarks</Menu.Item>
                </Menu>
                <Button type="text" style={{ color: '#fff', float: 'right' }} onClick={logoutUser}>
                    Logout
                </Button>
            </Header>
            <Content className="content-wrapper">
                <div className="date-picker-wrapper">
                    <DatePicker value={startDate} onChange={handleStartDateChange} />
                    <DatePicker value={endDate} onChange={handleEndDateChange} />
                </div>
                <div className="tabs-wrapper">
                    <Tabs defaultActiveKey="1" onChange={handleTabChange}>
                        <TabPane tab="Daily" key="1" />
                        <TabPane tab="Hourly" key="2" />
                    </Tabs>
                </div>
                <div className="chart-container">
                    <Chart
                        chartType="LineChart"
                        data={data}
                        width={'100%'}
                        height={chartHeight}
                        loader={<div>Loading Chart</div>}
                        options={{
                            hAxis: {
                                title: 'Day',
                            },
                            vAxis: {
                                title: 'Average Energy Consumption',
                            },
                        }}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default BuildingMetrics;

