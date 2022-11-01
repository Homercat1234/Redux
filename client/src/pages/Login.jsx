import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";

export default function Login() {
  return (
    <Container fluid className="p-0 noGutters" style={{ height: "100vh" }}>
      <Row className="m-0 noGutters">
        <Col className="p-0 noGutters">
          <Row lg={6} className="justify-content-center noGutters">
            <Col lg={4} noGutters={true}>
              <div
                className="bg order-1"
                style={{
                  backgroundImage:
                    "url(https://www.hec.ca/en/profs/guy.pare.jpg)",
                  height: "100%",
                }}
              />
            </Col>
            <Col lg={5} noGutters={true} className="noGutters">
              <div className="bg-dark">
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
