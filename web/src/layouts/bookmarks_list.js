
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Table, Button, Typography, Space } from 'antd';
import { DeleteOutlined, BarChartOutlined } from '@ant-design/icons';

import { TokenIsValid } from '../api/auth';
import {  GetBookmarks, DeleteBookmarks } from '../api/bookmarks';
import { GetBuildings } from '../api/buildings';

const { Header, Content } = Layout;
const { Text } = Typography;

export default function BookmarksList() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [buildings, setBuildings] = useState({});

    useEffect(() => {
        if (!TokenIsValid(localStorage.getItem('test-token'))) {
            navigate("/login");
        }
        GetBookmarks().then(bookmarks => {
            GetBuildings().then(bld => {
                const buildingsMap = bld.reduce((acc, curr) => {
                    acc[curr.id] = curr;
                    return acc;
                }, {});
                setBuildings(buildingsMap);
                setRows(bookmarks);
            });
        });
    }, [navigate]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'BuildingId',
            key: 'name',
            render: id => buildings[id]?.name || 'Unknown',
        },
        {
            title: 'Info',
            key: 'info',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<BarChartOutlined />} onClick={() => navigate(`/buildings/${record.BuildingId}`)} />
                </Space>
            ),
            align: 'center',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<DeleteOutlined />} onClick={() => deleteBookmark(record.ID)} />
                </Space>
            ),
            align: 'center',
        },
    ];

    const deleteBookmark = (id) => {
        DeleteBookmarks(id).then(() => {
            GetBookmarks().then(data => {
                setRows(data);
            });
        });
    };

    return (
        <Layout className="layout" style={{ minHeight: '100vh' }}>
            <Header>
                <Text style={{ color: '#fff' }}>My Buildings</Text>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['bookmarks']} style={{ float: 'right' }}>
                    <Menu.Item key="all" onClick={() => navigate('/buildings')}>All</Menu.Item>
                    <Menu.Item key="bookmarks" onClick={() => navigate('/bookmarks')}>Bookmarks</Menu.Item>
                </Menu>
                <Button type="text" style={{ color: '#fff', float: 'right' }} onClick={() => {
                    localStorage.removeItem('test-token');
                    navigate("/login");
                }}>
                    Logout
                </Button>
            </Header>
            <Content style={{ padding: '24px' }}>
                <Table columns={columns} dataSource={rows} rowKey="ID" />
            </Content>
        </Layout>
    );
}
