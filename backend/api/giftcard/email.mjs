import React from "react"
import { Html } from "@react-email/html";
import { Row } from "@react-email/row";
import { Column } from "@react-email/column";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Container } from "@react-email/container";

function Email(props) {
  const { amount, recipient, adress, message, date} = props;
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);

  return (
    <Html lang="en">
      <Preview>Your giftcard receipt</Preview>
      <Container style={container}>
        <Heading style={header} as="h2" mt="0">
          Thank you for your purchase!
        </Heading>
        <Container style={innerContainer}>
        <Row >
          <Text style={{ ...text, textAlign: "left", marginBottom: "20px" }}>
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
            <Text style={{ ...text, textAlign: "right" }}> {amount || "amount"}</Text>
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
            <Text style={{ ...text, textAlign: "right" }}> {recipient || "recipient"}</Text>
          </Column>
        </Row>
        <Row style={row}>
          <Column>
            {" "}
            <Text style={{ ...text, fontWeight: "800", textAlign: "left" }}>
              Address
            </Text>
          </Column>
          <Column>
            {" "}
            <Text style={{ ...text, textAlign: "right" }}> {adress || "address"}</Text>
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
            <Text style={{ ...text, textAlign: "right" }}> {formattedDate || "date of purchase"}</Text>
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
            <Text style={{ ...text, textAlign: "right" }}> {message || "message"}</Text>
          </Column>
        </Row>
        </Container>
        <Text style={{ ...text, marginTop: "40px", textAlign: "center" }}>Cheers!</Text>
      </Container>
    </Html>
  );
}
export default Email;

const container = {
  position: "relative",
  margin: "30px auto",
  paddingBlock: "40px",
  paddingInline: "2%",
  backgroundColor: "#f8f4f1",
  borderRadius: 3,
  overflow: "hidden",
  boxShadow:
    "4px 4px var(--gold), -4px 4px var(--gold), -4px -4px var(--gold), 4px -4px var(--gold), 8px 8px var(--paper-white), -8px 8px var(--paper-white), -8px -8px var(--paper-white), 8px -8px var(--paper-white)",
};

const innerContainer = {
  position: "relative",
  width: "60%",

}

const header = {
  color: "#444444",
  marginBottom: "35px",
  textAlign: "center"
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

const row = {
  marginBottom: "5px",
};
