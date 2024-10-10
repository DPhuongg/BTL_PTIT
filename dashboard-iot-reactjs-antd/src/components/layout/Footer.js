import { Layout, Row } from "antd";
import { HeartFilled } from "@ant-design/icons";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
          <div className="copyright">
            © 2024, made with
            {<HeartFilled />} by
            <a href="#pablo" className="font-weight-bold" target="_blank">
            </a>
          </div>
      </Row>
    </AntFooter>
  );
}

export default Footer;
