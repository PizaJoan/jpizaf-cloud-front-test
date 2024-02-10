
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Table, Button, Typography } from 'antd';
import { StarOutlined, StarFilled, BarChartOutlined } from '@ant-design/icons';

import { TokenIsValid } from '../api/auth';
import { GetBuildings } from '../api/buildings';
import { GetBookmarks, SaveBookmarks, DeleteBookmarks } from '../api/bookmarks';
import './buildingList.css'

const { Header, Content } = Layout;
const { Text } = Typography;

const BuildingList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [buildings, setBuildings] = useState([]);
    const [bookmarks, setBookmarks] = useState({});
    const [selectedKey, setSelectedKey] = useState('');

    useEffect(() => {
        if (!TokenIsValid(localStorage.getItem('test-token'))) {
            navigate("/login");
        }

        const pathname = location.pathname;
        setSelectedKey(pathname === '/buildings' ? 'all' : 'bookmarks');

        Promise.all([GetBuildings(), GetBookmarks()]).then(([data, bld]) => {

          setBuildings(data);
          const bookmarksMap = bld.reduce((acc, curr) => {
              acc[curr.BuildingId] = curr;
              return acc;
          }, {});
          setBookmarks(bookmarksMap);
        });
        
    }, [navigate, location]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Info',
            dataIndex: 'id',
            key: 'info',
            render: (text, record) => (
                <Button icon={<BarChartOutlined />} onClick={() => goToBuildingMetrics(record.id)} />
            ),
            align: 'center',
        },
        {
            title: 'Favourites',
            dataIndex: 'id',
            key: 'favourites',
            render: (text, record) => (
                bookmarks[record.id] ? (
                    <Button icon={<StarFilled />} onClick={() => deleteBookmark(record.id)} />
                ) : (
                    <Button icon={<StarOutlined />} onClick={() => saveBookmark(record.id)} />
                )
            ),
            align: 'center',
        },
    ];

    const goToBuildingMetrics = (id) => {
        navigate(`/buildings/${id}`);
    };

    const saveBookmark = (id) => {
        SaveBookmarks(id).then(() => updateBookmarks());
    };

    const deleteBookmark = (id) => {
        if (bookmarks[id]) {
            DeleteBookmarks(bookmarks[id].ID).then(() => updateBookmarks());
        }
    };

    const updateBookmarks = () => {
        GetBookmarks().then(bld => {
            const bookmarksMap = bld.reduce((acc, curr) => {
                acc[curr.BuildingId] = curr;
                return acc;
            }, {});
            setBookmarks(bookmarksMap);
        });
    };

    return (
        <Layout className="layout" style={{ minHeight: '100vh' }}>
            <Header>
                <Text style={{ color: '#fff' }}>My Buildings</Text>
                <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]} style={{ float: 'right' }}>
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
            <Content style={{ padding: '50px' }}>
                <Table columns={columns} dataSource={buildings} rowKey="id" />
            </Content>
        </Layout>
    );
};

export default BuildingList;
