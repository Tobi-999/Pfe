import React from "react";
import { Typography, Row, Col, Card, Button, Space } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  CameraOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function Home() {
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          background: "#f0f2f5",
        }}
      >
        <Title level={1}>Smart HR Management</Title>
        <Paragraph
          style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}
        >
          Streamline your HR processes with our comprehensive solution featuring
          job management, leave tracking, and AI-powered attendance monitoring.
        </Paragraph>
        <Space style={{ marginTop: "24px" }}>
          <Button
            type="primary"
            size="large"
            onClick={() => (window.location.href = "/login")}
          >
            Get Started
          </Button>
          <Button size="large">Learn More</Button>
        </Space>
      </div>

      {/* Features Section */}
      <Row gutter={[24, 24]} style={{ marginTop: "48px" }}>
        <Col xs={24} md={8}>
          <Card hoverable>
            <div style={{ textAlign: "center" }}>
              <FileTextOutlined
                style={{ fontSize: "48px", color: "#1890ff" }}
              />
              <Title level={3} style={{ marginTop: "16px" }}>
                Job Management
              </Title>
              <Paragraph>
                Efficiently manage job postings, applications, and recruitment
                processes. Track candidates and streamline your hiring workflow.
              </Paragraph>
              <Button type="link">Learn More →</Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <div style={{ textAlign: "center" }}>
              <CalendarOutlined
                style={{ fontSize: "48px", color: "#52c41a" }}
              />
              <Title level={3} style={{ marginTop: "16px" }}>
                Leave Management
              </Title>
              <Paragraph>
                Simplify leave requests and approvals. Track employee time-off,
                manage schedules, and maintain accurate attendance records.
              </Paragraph>
              <Button type="link">Learn More →</Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card hoverable>
            <div style={{ textAlign: "center" }}>
              <CameraOutlined style={{ fontSize: "48px", color: "#722ed1" }} />
              <Title level={3} style={{ marginTop: "16px" }}>
                AI Camera Detection
              </Title>
              <Paragraph>
                Advanced facial recognition technology for accurate attendance
                tracking. Real-time monitoring and automated reporting for
                better workforce management.
              </Paragraph>
              <Button type="link">Learn More →</Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* CTA Section */}
      <div
        style={{
          textAlign: "center",
          marginTop: "48px",
          padding: "48px 0",
          background: "#f0f2f5",
        }}
      >
        <Title level={2}>Ready to Transform Your HR Management?</Title>
        <Paragraph style={{ fontSize: "16px", marginBottom: "24px" }}>
          Join organizations that trust our platform for their HR needs
        </Paragraph>
        <Button type="primary" size="large">
          join our system Now
        </Button>
      </div>
    </div>
  );
}

export default Home;
