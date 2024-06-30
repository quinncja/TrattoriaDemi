import React from "react";
import { Html } from "@react-email/html";
import { Row } from "@react-email/row";
import { Column } from "@react-email/column";
import { Text } from "@react-email/text";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Container } from "@react-email/container";

function messageSent(props) {
  const { name, message, email } = props;

  return (
    <Html lang="en">
      <Preview>Contact Form Submission</Preview>
      <Container style={container}>
        <Container style={images}>
          <Img
            style={{ width: "80%", marginLeft: "10%", marginBottom: "15px" }}
            src="https://i.ibb.co/Vwmz0y0/Trattoria-Demi-Centered-Gold.png"
            alt="Trattoria Demi"
          />
          <Img
            style={{ width: "60%", marginLeft: "20%", marginBottom: "30px" }}
            src="https://i.ibb.co/DfQSPr7/Fancy-Line.png"
            alt="-------"
          />
        </Container>
        <Container style={innerContainer}>
        <Row style={row}>
            <Column>
              {" "}
              <Text style={{ ...text, fontWeight: "800", textAlign: "left" }}>
                From
              </Text>
            </Column>
            <Column>
              {" "}
              <Text style={{ ...text, textAlign: "right" }}>
                {" "}
                {name || "name"}
              </Text>
            </Column>
          </Row>
          <Row style={row}>
            <Column>
              {" "}
              <Text style={{ ...text, fontWeight: "800", textAlign: "left" }}>
                email
              </Text>
            </Column>
            <Column>
              {" "}
              <Text style={{ ...text, textAlign: "right" }}>
                {" "}
                {email || "email"}
              </Text>
            </Column>
          </Row>
          <Row style={row}>
            <Column>
              {" "}
              <Text style={{ ...text, fontWeight: "800", textAlign: "left" }}>
                Message
              </Text>
            </Column>
            <Column>
              {" "}
              <Text style={{ ...text, textAlign: "right" }}>
                {" "}
                {message || "message"}
              </Text>
            </Column>
          </Row>
        </Container>
      </Container>
    </Html>
  );
}
export default messageSent;

const container = {
  position: "relative",
  margin: "20px auto",
  paddingLeft: "40px",
  paddingRight: "40px",
  paddingInline: "2%",
  backgroundColor: "#f8f4f1",
  borderRadius: 3,
  overflow: "hidden",
  boxShadow:
    "4px 4px var(--gold), -4px 4px var(--gold), -4px -4px var(--gold), 4px -4px var(--gold), 8px 8px var(--paper-white), -8px 8px var(--paper-white), -8px -8px var(--paper-white), 8px -8px var(--paper-white)",
};

const innerContainer = {
  position: "relative",
  width: "98%",
};
const images = {
  marginTop: "55px",
  width: "100%",
};

const header = {
  color: "#444444",
  marginBottom: "35px",
  marginTop: "35px",
  textAlign: "center",
  fontSize: "20px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const text = {
  ...paragraph,
  color: "#444444",
  fontWeight: "500",
};

const smallerText = {
  ...paragraph,
  color: "#a1a1a1",
  fontWeight: "200",
};

const row = {
  marginBottom: "5px",
};
