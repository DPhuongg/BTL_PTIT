import { useEffect } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Badge,
  Button,
} from "antd";

import { NavLink } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { FaBell } from "react-icons/fa";

function Header({
  name,
  subName
}) {
  useEffect(() => window.scrollTo(0, 0));
  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={6}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/">Pages</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ textTransform: "capitalize" }}>
              {name.replace("/", "")}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize" }}
            >
              {subName.replace("/", "")}
            </span>
          </div>
        </Col>
        <Col span={24} md={18} className="header-control">
          <Badge size="small" count={4}>
            <FaBell/>
          </Badge>
          <Button type="link" >
            <IoMdSettings/>
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Header;
