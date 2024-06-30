import React from "react";
import { Html } from "@react-email/html";
import { Row } from "@react-email/row";
import { Column } from "@react-email/column";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Container } from "@react-email/container";

function giftcardReceipt(props) {
  const { amount, recipient, address, message, id, date } = props;

  return (
    <Html lang="en">
      <Preview>Your giftcard receipt</Preview>
      <Container style={container}>
        <Container style={images}>
          <Img
            style={{ width: "80%", marginLeft: "10%", marginBottom: "15px" }}
            src="https://i.ibb.co/Vwmz0y0/Trattoria-Demi-Centered-Gold.png"
            alt="Trattoria Demi"
          />
          <Img
            style={{ width: "60%", marginLeft: "20%" }}
            src="https://i.ibb.co/DfQSPr7/Fancy-Line.png"
            alt="-------"
          />
        </Container>
        <Heading style={header} as="h2" mt="0">
          Thank you for your purchase!
        </Heading>
        <Container style={innerContainer}>
          <Row>
            <Text
              style={{
                ...text,
                textAlign: "left",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              Your reciept is shown below
            </Text>
          </Row>
          <Row style={row}>
            <Column>
              {" "}
              <Text style={{ ...text, fontWeight: "800", textAlign: "left" }}>
                Amount
              </Text>
            </Column>
            <Column>
              {" "}
              <Text style={{ ...text, textAlign: "right" }}>
                {" "}
                {amount || "amount"}
              </Text>
            </Column>
          </Row>
          <Row style={row}>
            <Column>
              {" "}
              <Text style={{ ...text, fontWeight: "800", textAlign: "left" }}>
                Recipient
              </Text>
            </Column>
            <Column>
              {" "}
              <Text style={{ ...text, textAlign: "right" }}>
                {" "}
                {recipient || "recipient"}
              </Text>
            </Column>
          </Row>
          <Row style={row}>
            <Column style={{ display: "flex" }}>
              {" "}
              <Text style={{ ...text, fontWeight: "800", textAlign: "left" }}>
                Address
              </Text>
            </Column>
            <Column>
              {" "}
              <Text style={{ ...text, textAlign: "right" }}>
                {" "}
                {address || "address"}
              </Text>
            </Column>
          </Row>
          <Row style={row}>
            <Column>
              {" "}
              <Text style={{ ...text, fontWeight: "800", textAlign: "left" }}>
                Purchase Date
              </Text>
            </Column>
            <Column>
              {" "}
              <Text style={{ ...text, textAlign: "right" }}>
                {" "}
                {date || "date of purchase"}
              </Text>
            </Column>
          </Row>
          <Row style={row}>
            <Column style={{ display: "flex" }}>
              {" "}
              <Text
                style={{
                  ...text,
                  fontWeight: "800",
                  textAlign: "left",
                  top: 0,
                }}
              >
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
        <Text
          style={{
            ...text,
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          Cheers!
        </Text>
        <Text
          style={{
            ...smallerText,
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          {id}
        </Text>
      </Container>
    </Html>
  );
}
export default giftcardReceipt;

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
