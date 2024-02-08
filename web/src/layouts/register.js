import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { RegisterUser } from '../api/auth';

const { Title } = Typography;

const LayoutRegister = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate("/login");
    };

    const onFinish = (values) => {
        const { email, password } = values;
        RegisterUser(email, password).then(data => {
            if (data.token === null) {
                navigate("/register");
            } else {
                navigate("/login");
            }
        });
    };

    return (
        <div style={{ padding: '100px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>My Buildings</Title>
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
                style={{ maxWidth: '300px', margin: 'auto' }}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Register
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="link" onClick={redirectToLogin}>
                        Already have an account? Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LayoutRegister;
