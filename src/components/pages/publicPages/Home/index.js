import React, { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  Space,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const data = [
    {
      key: "1",
      code: "#PN0015",
      table: "Bàn 02",
      phone: "09xx xxx 123",
      point: "120 điểm",
      total: "275,000đ",
      status: "Chờ xác nhận",
    },
    {
      key: "2",
      code: "#PN0014",
      table: "Bàn 03",
      phone: "-",
      point: "-",
      total: "180,000đ",
      status: "Đang phục vụ",
    },
    {
      key: "3",
      code: "#PN0013",
      table: "Bàn 07",
      phone: "08xx xxx 456",
      point: "85 điểm",
      total: "320,000đ",
      status: "Đang phục vụ",
    },
    {
      key: "4",
      code: "#PN0012",
      table: "Bàn 05",
      phone: "09xx xxx 123",
      point: "120 điểm",
      total: "275,000đ",
      status: "Món mới",
    },
    {
      key: "5",
      code: "#PN0011",
      table: "Bàn 03",
      phone: "-",
      point: "-",
      total: "180,000đ",
      status: "Đang phục vụ",
    },
    {
      key: "6",
      code: "#PN0010",
      table: "Bàn 07",
      phone: "08xx xxx 456",
      point: "85 điểm",
      total: "320,000đ",
      status: "Hoàn tất",
    },
  ];

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "code",
      key: "code",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Bàn",
      dataIndex: "table",
      key: "table",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <>
          {text}
          {text !== "-" && (
            <EyeOutlined style={{ marginLeft: 8, color: "#1890ff" }} />
          )}
        </>
      ),
      responsive: ["md", "lg"],
    },
    {
      title: "Điểm tích lũy",
      dataIndex: "point",
      key: "point",
      responsive: ["md", "lg"],
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (text) => (
        <span style={{ fontWeight: 600, color: "#d46b08" }}>{text}</span>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        if (status === "Chờ xác nhận") color = "orange";
        if (status === "Món mới") color = "volcano";
        if (status === "Hoàn tất") color = "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button size="small">Chi tiết</Button>
          {record.status === "Hoàn tất" ? (
            <Button size="small" disabled>
              Đã thanh toán
            </Button>
          ) : (
            <Button type="primary" size="small">
              Thanh toán
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      {/* Header actions */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Nhập mã đơn hoặc số điện thoại..."
          prefix={<SearchOutlined />}
          style={{ maxWidth: 250 }}
        />
        <Space wrap>
          <Select defaultValue="all" style={{ minWidth: 140 }}>
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="waiting">Chờ xác nhận</Option>
            <Option value="serving">Đang phục vụ</Option>
            <Option value="done">Hoàn tất</Option>
          </Select>
          <Select defaultValue="today" style={{ minWidth: 120 }}>
            <Option value="today">Hôm nay</Option>
            <Option value="yesterday">Hôm qua</Option>
            <Option value="week">Tuần này</Option>
          </Select>
          <Select defaultValue="new" style={{ minWidth: 150 }}>
            <Option value="new">Mới nhất → Cũ nhất</Option>
            <Option value="old">Cũ nhất → Mới nhất</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />}>
            Tạo đơn mới
          </Button>
          <Button icon={<PrinterOutlined />}>In hóa đơn</Button>
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
      />

      {/* Pagination */}
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Pagination
          current={currentPage}
          total={127}
          pageSize={5}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Home;
