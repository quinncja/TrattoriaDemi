import { Html } from "@react-email/html";
import { Row } from "@react-email/row";
import { Column } from "@react-email/column";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Container } from "@react-email/container";
import FancyLine from "../images/FancyLine.png";
import Logo from "../images/TrattoriaDemiCenteredWhite.png";

export function Email(props) {
  const { amount, recipient, adress, message } = props;

  return (
    <Html lang="en">
      <Preview>Your giftcard receipt</Preview>
      <Container style={container}>
        <Img
          src={Logo}
          alt="Trattoria Demi"
          width="80%"
          style={{
            filter:
              "invert(15%) sepia(10%) saturate(4247%) hue-rotate(329deg) brightness(88%) contrast(87%)",
            marginLeft: "8%",
          }}
        />
        <Img
          src={FancyLine}
          alt="-"
          width="40%"
          style={{ marginLeft: "30%", marginTop: "10px" }}
        />
        <Heading style={header} as="h2" mt="0">
          Thank you for your purchase!
        </Heading>
        <Row style={{ width: "60%" }}>
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
            <Text style={{ ...text, textAlign: "right" }}> {amount}</Text>
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
            <Text style={{ ...text, textAlign: "right" }}> {recipient}</Text>
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
            <Text style={{ ...text, textAlign: "right" }}> {adress}</Text>
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
            <Text style={{ ...text, textAlign: "right" }}> {message}</Text>
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
            <Text style={{ ...text, textAlign: "right" }}> {message}</Text>
          </Column>
        </Row>
        <Text style={{ ...text, marginTop: "40px" }}>Cheers!</Text>
      </Container>
    </Html>
  );
}

const container = {
  margin: "30px auto",
  paddingBlock: "40px",
  width: "600px",
  backgroundColor: "#f8f4f1",
  borderRadius: 3,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  alignItems: "center",
  boxShadow:
    "4px 4px var(--gold), -4px 4px var(--gold), -4px -4px var(--gold), 4px -4px var(--gold), 8px 8px var(--paper-white), -8px 8px var(--paper-white), -8px -8px var(--paper-white), 8px -8px var(--paper-white)",
};

const header = {
  color: "#444444",
  marginBottom: "35px",
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
  width: "50%",
  marginBottom: "5px",
};

export default Email;
