import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Layout, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { LoginUser } from '../api/auth';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function LayoutLogin() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const redirectToRegister = () => {
        navigate("/register");
    };

    const onFinish = ({ email, password }) => {
        if (!email || !password) {
            return;
        }

        LoginUser(email, password).then(data => {
            if (data.token === null) {
                navigate("/register");
            } else {
                localStorage.setItem('test-token', data.Token);
                localStorage.setItem('email', data.Email);
                navigate("/buildings");
            }
        });
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <Title style={{ color: '#fff', margin: 0 }} level={3}>My Buildings</Title>
                <Button type="link" onClick={redirectToRegister} style={{ color: '#fff', float: 'right' }}>Register</Button>
            </Header>
            <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                    <Form
                        form={form}
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                        style={{ maxWidth: 300 }}
                    >
                        <Title level={2}>Login</Title>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your Email!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
}

